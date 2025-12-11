import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataProvider";
import { Alert } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, HelpCircle, XCircle } from "lucide-react";

export default function Alertas() {
  const { alerts, resolvedAlerts, resolveAlert, requestHelp } = useData();
  const [ayudaSolicitada, setAyudaSolicitada] = useState<Record<string, boolean>>({});

  const handleSolicitarAyuda = (alerta: Alert) => {
    requestHelp(alerta);
    setAyudaSolicitada(prev => ({ ...prev, [alerta.id]: true }));
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
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={ayudaSolicitada[alerta.id] ? "secondary" : "default"}
                      onClick={() => handleSolicitarAyuda(alerta)}
                      disabled={ayudaSolicitada[alerta.id]}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {ayudaSolicitada[alerta.id] ? "Ayuda Solicitada" : "Solicitar Ayuda"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alerta.id, true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Falso Positivo
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resolveAlert(alerta.id, false)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resuelta
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
    </DashboardLayout>
  );
}
