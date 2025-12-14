import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataProvider";
import { Alert } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, HelpCircle, XCircle, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Alertas() {
  const { alerts, resolvedAlerts, resolveAlert, requestHelp, canResolveAlert, helpRequestedIds } = useData();
  const [confirmFalsePositive, setConfirmFalsePositive] = useState<Alert | null>(null);

  const handleSolicitarAyuda = (alerta: Alert) => {
    requestHelp(alerta);
  };

  const handleFalsePositiveClick = (alerta: Alert) => {
    setConfirmFalsePositive(alerta);
  };

  const confirmFalsePositiveAction = () => {
    if (confirmFalsePositive) {
      resolveAlert(confirmFalsePositive.id, true);
      setConfirmFalsePositive(null);
    }
  };

  const alertasActivas = alerts.filter(a => a.estado === "Activa");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Centro de Alertas</h1>
          <p className="text-muted-foreground">
            Gestione y responda a las alertas de seguridad del sistema
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertasActivas.length}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Resueltas</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedAlerts.length}</div>
              <p className="text-xs text-muted-foreground">En esta sesión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alertasActivas.filter(a => a.nivel === "Alta").length}
              </div>
              <p className="text-xs text-muted-foreground">Prioridad alta</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alertas Activas</CardTitle>
            <CardDescription>
              Alertas que requieren atención inmediata o seguimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertasActivas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
                <p>No hay alertas activas en este momento</p>
              </div>
            ) : (
              alertasActivas.map((alerta) => (
                <div key={alerta.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={alerta.nivel} type="alert" />
                        <span className="font-medium">{alerta.equipo_nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alerta.fecha).toLocaleString('es-ES')}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alerta.descripcion}</p>
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="font-medium mb-1">Recomendación:</p>
                        <p>{alerta.recomendacion}</p>
                      </div>

                      {/* Prerequisites Section */}
                      {alerta.prerequisites && alerta.prerequisites.length > 0 && (
                        <div className="mt-3 p-3 border rounded bg-card">
                          <p className="text-sm font-semibold mb-2">Acciones Requeridas:</p>
                          <div className="space-y-2">
                            {alerta.prerequisites.map((prereq) => {
                              const isCompleted = prereq.checkCompleted();
                              return (
                                <div key={prereq.id} className="flex items-start gap-2">
                                  <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center pointer-events-none select-none ${isCompleted ? 'bg-green-500 border-green-500' : 'border-muted-foreground bg-muted'
                                    }`}>
                                    {isCompleted && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <span className={`text-sm select-none ${isCompleted ? 'text-muted-foreground line-through' : ''
                                    }`}>{prereq.description}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={helpRequestedIds.includes(alerta.id) ? "secondary" : "default"}
                      onClick={() => handleSolicitarAyuda(alerta)}
                      disabled={helpRequestedIds.includes(alerta.id)}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {helpRequestedIds.includes(alerta.id) ? "Ayuda Solicitada" : "Solicitar Ayuda"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFalsePositiveClick(alerta)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Falso Positivo
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resolveAlert(alerta.id, false)}
                      disabled={!canResolveAlert(alerta)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {canResolveAlert(alerta) ? 'Resolver' : 'Completar Acciones Primero'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas Resueltas</CardTitle>
            <CardDescription>Historial de alertas gestionadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resolvedAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay alertas resueltas en esta sesión</p>
              </div>
            ) : (
              resolvedAlerts.map((alerta) => (
                <div key={alerta.id} className="p-3 border rounded-lg opacity-70">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {alerta.estado === "Falso Positivo" ? (
                          <XCircle className="h-4 w-4 text-warning" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        <span className="font-medium">{alerta.equipo_nombre}</span>
                        <StatusBadge status={alerta.nivel} type="alert" />
                        <span className="text-xs px-2 py-0.5 rounded bg-muted">
                          {alerta.estado}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alerta.descripcion}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alerta.fecha).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>


      </div>

      {/* False Positive Confirmation Dialog */}
      <Dialog open={!!confirmFalsePositive} onOpenChange={() => setConfirmFalsePositive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              ¿Marcar como Falso Positivo?
            </DialogTitle>
            <DialogDescription>
              Esta acción indica que la alerta fue incorrecta o no representa una amenaza real.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-warning/10 border border-warning/20 rounded p-3 mb-4">
              <p className="text-sm font-medium mb-1">Advertencia</p>
              <p className="text-sm text-muted-foreground">
                Marcar una alerta como falso positivo significa que el sistema generó una alerta incorrecta.
                Solo use esta opción si está completamente seguro de que no hay amenaza real.
              </p>
            </div>
            {confirmFalsePositive && (
              <div className="space-y-2">
                <p className="text-sm"><strong>Equipo:</strong> {confirmFalsePositive.equipo_nombre}</p>
                <p className="text-sm"><strong>Descripción:</strong> {confirmFalsePositive.descripcion}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmFalsePositive(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmFalsePositiveAction}>
              Confirmar Falso Positivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
