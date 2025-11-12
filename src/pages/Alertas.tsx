import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAlerts } from "@/data/mockData";
import { Alert } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alert[]>(mockAlerts);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<Alert | null>(null);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const { toast } = useToast();

  const marcarComoResuelta = (id: string) => {
    setAlertas(alertas.map(a => a.id === id ? { ...a, estado: "Resuelta" as const } : a));
    toast({
      title: "Alerta resuelta",
      description: "La alerta ha sido marcada como resuelta correctamente",
    });
    setDialogAbierto(false);
  };

  const solicitarAyuda = (alerta: Alert) => {
    toast({
      title: "Solicitud de ayuda enviada",
      description: `Un técnico especializado revisará la alerta ${alerta.id} en las próximas 2 horas`,
    });
  };

  const verDetalles = (alerta: Alert) => {
    setAlertaSeleccionada(alerta);
    setDialogAbierto(true);
  };

  const alertasActivas = alertas.filter(a => a.estado === "Activa");
  const alertasResueltas = alertas.filter(a => a.estado === "Resuelta");

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
              <div className="text-2xl font-bold">{alertasResueltas.length}</div>
              <p className="text-xs text-muted-foreground">En las últimas 24h</p>
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
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => verDetalles(alerta)}
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => marcarComoResuelta(alerta.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Resuelta
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => solicitarAyuda(alerta)}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Solicitar Ayuda
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
            {alertasResueltas.map((alerta) => (
              <div key={alerta.id} className="p-3 border rounded-lg opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">{alerta.equipo_nombre}</span>
                      <StatusBadge status={alerta.nivel} type="alert" />
                    </div>
                    <p className="text-sm text-muted-foreground">{alerta.descripcion}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alerta.fecha).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la Alerta</DialogTitle>
              <DialogDescription>
                Información completa y pasos recomendados
              </DialogDescription>
            </DialogHeader>
            
            {alertaSeleccionada && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alertaSeleccionada.nivel} type="alert" />
                    <span className="font-medium">{alertaSeleccionada.equipo_nombre}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(alertaSeleccionada.fecha).toLocaleString('es-ES')}
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">Descripción:</p>
                  <p className="text-sm">{alertaSeleccionada.descripcion}</p>
                </div>

                <div className="bg-primary/10 p-3 rounded">
                  <p className="font-medium mb-1">Siguiente paso recomendado:</p>
                  <p className="text-sm">{alertaSeleccionada.recomendacion}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => marcarComoResuelta(alertaSeleccionada.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Resuelta
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => solicitarAyuda(alertaSeleccionada)}
                    className="flex-1"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Solicitar Ayuda
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
