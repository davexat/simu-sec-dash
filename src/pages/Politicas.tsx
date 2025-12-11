import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPolicies, mockEquipment } from "@/data/mockData";
import { SecurityPolicy, PolicyConfiguration, Equipment } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updatePolicy, getPolicyState, savePolicyChanges, getPolicyStateForEquipment, getAllPolicyConfigurations } from "@/services/policyService";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, ChevronDown, ChevronUp, AlertTriangle, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Politicas() {
  const [politicas, setPoliticas] = useState<SecurityPolicy[]>(mockPolicies);
  const [policyConfigs, setPolicyConfigs] = useState<PolicyConfiguration[]>([]);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set());
  const [pendingGlobalChanges, setPendingGlobalChanges] = useState<Map<string, boolean>>(new Map());
  const [pendingEquipmentChanges, setPendingEquipmentChanges] = useState<PolicyConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const hasUnsavedChanges = pendingGlobalChanges.size > 0 || pendingEquipmentChanges.length > 0;

  // Cargar estado inicial desde Firebase
  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        // Cargar estados globales de políticas
        const updatedPolicies = await Promise.all(
          mockPolicies.map(async (policy) => {
            const isEnabled = await getPolicyState(policy.id);
            return { ...policy, habilitada: isEnabled };
          })
        );
        setPoliticas(updatedPolicies);

        // Cargar configuraciones por equipo desde Firebase
        const configurations = await getAllPolicyConfigurations();
        setPolicyConfigs(configurations);
      } catch (error) {
        console.error("Error fetching policies:", error);
        toast({
          title: "Error de sincronización",
          description: "No se pudieron cargar los estados de las políticas desde el servidor",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [toast]);

  // Advertencia al intentar salir con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const togglePolicyExpanded = (policyId: string) => {
    const newExpanded = new Set(expandedPolicies);
    if (newExpanded.has(policyId)) {
      newExpanded.delete(policyId);
    } else {
      newExpanded.add(policyId);
    }
    setExpandedPolicies(newExpanded);
  };

  const toggleGlobalPolicy = (policyId: string) => {
    if (user?.rol !== "Administrador") {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden modificar políticas de seguridad",
        variant: "destructive",
      });
      return;
    }

    const currentPolicy = politicas.find(p => p.id === policyId);
    if (!currentPolicy) return;

    const newState = !currentPolicy.habilitada;

    // Actualizar estado local
    setPoliticas(politicas.map(p =>
      p.id === policyId ? { ...p, habilitada: newState } : p
    ));

    // Agregar a cambios pendientes
    const newPending = new Map(pendingGlobalChanges);
    newPending.set(policyId, newState);
    setPendingGlobalChanges(newPending);
  };

  const toggleEquipmentPolicy = (policyId: string, equipmentId: string, currentState: boolean) => {
    if (user?.rol !== "Administrador") {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden modificar políticas de seguridad",
        variant: "destructive",
      });
      return;
    }

    const newState = !currentState;

    // Buscar si ya existe una configuración para este equipo/política
    const existingConfigIndex = policyConfigs.findIndex(
      c => c.policyId === policyId && c.equipmentId === equipmentId
    );

    let newConfigs = [...policyConfigs];

    if (existingConfigIndex >= 0) {
      // Actualizar existente
      newConfigs[existingConfigIndex] = {
        ...newConfigs[existingConfigIndex],
        enabled: newState
      };
    } else {
      // Crear nueva configuración
      newConfigs.push({
        policyId,
        equipmentId,
        enabled: newState
      });
    }

    setPolicyConfigs(newConfigs);

    // Agregar a cambios pendientes
    const pendingConfig: PolicyConfiguration = {
      policyId,
      equipmentId,
      enabled: newState
    };

    const newPending = [...pendingEquipmentChanges.filter(
      c => !(c.policyId === policyId && c.equipmentId === equipmentId)
    ), pendingConfig];

    setPendingEquipmentChanges(newPending);
  };

  const getEquipmentPolicyState = (policyId: string, equipmentId: string): { enabled: boolean; isException: boolean } => {
    const config = policyConfigs.find(
      c => c.policyId === policyId && c.equipmentId === equipmentId
    );

    const globalPolicy = politicas.find(p => p.id === policyId);
    const globalState = globalPolicy?.habilitada || false;

    if (config) {
      return {
        enabled: config.enabled,
        isException: config.enabled !== globalState
      };
    }

    return {
      enabled: globalState,
      isException: false
    };
  };

  const handleSaveChanges = async () => {
    if (user?.rol !== "Administrador") {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden guardar cambios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const globalChanges = Array.from(pendingGlobalChanges.entries()).map(([policyId, enabled]) => ({
        policyId,
        enabled
      }));

      await savePolicyChanges(globalChanges, pendingEquipmentChanges);

      toast({
        title: "Cambios guardados",
        description: `Se guardaron ${globalChanges.length + pendingEquipmentChanges.length} cambios exitosamente`,
      });

      // Limpiar cambios pendientes
      setPendingGlobalChanges(new Map());
      setPendingEquipmentChanges([]);
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios en el servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    // Revertir cambios globales
    const revertedPolicies = politicas.map(policy => {
      if (pendingGlobalChanges.has(policy.id)) {
        return { ...policy, habilitada: !policy.habilitada };
      }
      return policy;
    });

    setPoliticas(revertedPolicies);

    // Revertir cambios de equipos
    const revertedConfigs = policyConfigs.filter(config => {
      return !pendingEquipmentChanges.some(
        pending => pending.policyId === config.policyId && pending.equipmentId === config.equipmentId
      );
    });

    setPolicyConfigs(revertedConfigs);

    // Limpiar pendientes
    setPendingGlobalChanges(new Map());
    setPendingEquipmentChanges([]);
    setShowDiscardDialog(false);

    toast({
      title: "Cambios descartados",
      description: "Se revirtieron todos los cambios pendientes",
    });
  };

  const habilitadas = politicas.filter(p => p.habilitada).length;
  const totalChanges = pendingGlobalChanges.size + pendingEquipmentChanges.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Políticas de Seguridad</h1>
          <p className="text-muted-foreground">
            Configure reglas de protección con control granular por equipo
          </p>
        </div>

        {/* Floating Action Bar for Unsaved Changes */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <Card className="border-warning bg-background/95 backdrop-blur shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-semibold">Cambios sin guardar</p>
                      <p className="text-sm text-muted-foreground">
                        {totalChanges} modificación{totalChanges !== 1 ? "es" : ""} pendiente{totalChanges !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDiscardDialog(true)}
                      className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Descartar
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      disabled={loading}
                      className="bg-primary shadow-md hover:shadow-lg transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⏳</span> Guardando...
                        </span>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user?.rol !== "Administrador" && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Modo de Solo Lectura</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1 ml-7">
                Solo los administradores pueden modificar políticas de seguridad.
                Contacte a su administrador si necesita realizar cambios.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Políticas Activas</CardTitle>
              <Shield className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{habilitadas}</div>
              <p className="text-xs text-muted-foreground">
                de {politicas.length} políticas disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipos Protegidos</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockEquipment.length}</div>
              <p className="text-xs text-muted-foreground">
                Con configuración granular disponible
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Políticas</CardTitle>
            <CardDescription>
              Configure políticas globalmente o establezca excepciones por equipo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {politicas.map((politica) => {
              const isExpanded = expandedPolicies.has(politica.id);
              // Una excepción real es aquella cuyo estado difiere de la política global
              const realExceptions = policyConfigs.filter(
                c => c.policyId === politica.id && c.enabled !== politica.habilitada
              );

              return (
                <div
                  key={politica.id}
                  className="border rounded-lg"
                >
                  <div className="flex items-start justify-between p-4">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium">{politica.nombre}</p>
                        {politica.habilitada ? (
                          <Badge className="bg-success/10 text-success">Activa</Badge>
                        ) : (
                          <Badge variant="secondary">Inactiva</Badge>
                        )}
                        {realExceptions.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {realExceptions.length} {realExceptions.length === 1 ? "excepción" : "excepciones"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{politica.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={politica.habilitada}
                        onCheckedChange={() => toggleGlobalPolicy(politica.id)}
                        disabled={user?.rol !== "Administrador"}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePolicyExpanded(politica.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-muted/30 p-4">
                      <p className="text-sm font-medium mb-3">Configuración por equipo:</p>
                      <div className="space-y-2">
                        {mockEquipment.map((equipment) => {
                          const state = getEquipmentPolicyState(politica.id, equipment.id);

                          return (
                            <div
                              key={equipment.id}
                              className="flex items-center justify-between p-2 bg-background rounded border"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{equipment.nombre}</span>
                                <span className="text-xs text-muted-foreground">({equipment.usuario})</span>
                                {state.isException && (
                                  <Badge variant="outline" className="text-xs">Excepción</Badge>
                                )}
                              </div>
                              <Switch
                                checked={state.enabled}
                                onCheckedChange={() => toggleEquipmentPolicy(politica.id, equipment.id, state.enabled)}
                                disabled={user?.rol !== "Administrador"}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Descartar cambios?</DialogTitle>
            <DialogDescription>
              Tienes {totalChanges} cambio{totalChanges !== 1 ? "s" : ""} sin guardar. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscardDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDiscardChanges}>
              Descartar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
