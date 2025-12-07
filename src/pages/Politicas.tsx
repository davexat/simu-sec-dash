import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPolicies } from "@/data/mockData";
import { SecurityPolicy } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { updatePolicy, getPolicyState } from "@/services/policyService";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Politicas() {
  const [politicas, setPoliticas] = useState<SecurityPolicy[]>(mockPolicies);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Cargar estado inicial desde Firebase
  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const updatedPolicies = await Promise.all(
          mockPolicies.map(async (policy) => {
            const isEnabled = await getPolicyState(policy.id);
            return { ...policy, habilitada: isEnabled };
          })
        );
        setPoliticas(updatedPolicies);
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

  const togglePolitica = async (id: string) => {
    if (user?.rol !== "Administrador") {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden modificar políticas de seguridad",
        variant: "destructive",
      });
      return;
    }

    // Optimistic update
    const previousState = [...politicas];
    const politica = politicas.find(p => p.id === id);
    if (!politica) return;

    const nuevoEstado = !politica.habilitada;

    setPoliticas(politicas.map(p =>
      p.id === id ? { ...p, habilitada: nuevoEstado } : p
    ));

    try {
      await updatePolicy(id, nuevoEstado);

      toast({
        title: nuevoEstado ? "Política habilitada" : "Política deshabilitada",
        description: `${politica.nombre} ha sido ${nuevoEstado ? "activada" : "desactivada"} correctamente`,
      });
    } catch (error) {
      // Revert on error
      setPoliticas(previousState);
      toast({
        title: "Error al actualizar",
        description: "No se pudo guardar el cambio en el servidor",
        variant: "destructive",
      });
    }
  };

  const habilitadas = politicas.filter(p => p.habilitada).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Políticas de Seguridad</h1>
          <p className="text-muted-foreground">
            Configure reglas de protección que se aplicarán automáticamente a todos los equipos
          </p>
        </div>

        {user?.rol !== "Administrador" && (
          <Card className="border-warning">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
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
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Todas las políticas se aplican automáticamente
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Políticas</CardTitle>
            <CardDescription>
              Active o desactive políticas de seguridad según las necesidades de su empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {politicas.map((politica) => (
              <div
                key={politica.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{politica.nombre}</p>
                    {politica.habilitada ? (
                      <Badge className="bg-success/10 text-success">Activa</Badge>
                    ) : (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{politica.descripcion}</p>
                </div>
                <Switch
                  checked={politica.habilitada}
                  onCheckedChange={() => togglePolitica(politica.id)}
                  disabled={user?.rol !== "Administrador"}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Cambios</CardTitle>
            <CardDescription>Registro de modificaciones recientes en las políticas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded">
                <div className="rounded-full p-2 bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Política aplicada: Bloquear dispositivos USB</p>
                  <p className="text-xs text-muted-foreground">Habilitada por Admin • Hace 2 días</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded">
                <div className="rounded-full p-2 bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Política aplicada: Detectar programas desconocidos</p>
                  <p className="text-xs text-muted-foreground">Habilitada por Admin • Hace 5 días</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded">
                <div className="rounded-full p-2 bg-warning/10">
                  <Shield className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Política desactivada: Control de acceso remoto</p>
                  <p className="text-xs text-muted-foreground">Deshabilitada por Admin • Hace 1 semana</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Recomendaciones de Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                <span>Mantenga activas al menos 3 políticas de seguridad básicas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                <span>Revise y actualice las políticas mensualmente según las necesidades del negocio</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                <span>Documente los cambios de políticas para auditorías futuras</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
