import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, TrendingUp, Globe, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataProvider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useTutorialAutoStart } from "@/hooks/useTutorialAutoStart";

const datosConexiones = [
  { hora: "07:00", conexiones: 45, sospechosas: 2 },
  { hora: "07:10", conexiones: 52, sospechosas: 1 },
  { hora: "07:20", conexiones: 128, sospechosas: 5 },
  { hora: "07:30", conexiones: 234, sospechosas: 12 },
  { hora: "07:40", conexiones: 189, sospechosas: 8 },
  { hora: "07:50", conexiones: 156, sospechosas: 4 },
];

const datosTrafico = [
  { equipo: "SERV-FACT", trafico: 15.4 },
  { equipo: "DB-Clientes", trafico: 12.8 },
  { equipo: "PC-Ventas-1", trafico: 8.3 },
  { equipo: "PORTATIL-MKT", trafico: 6.7 },
  { equipo: "PC-Contabilidad", trafico: 5.2 },
];

export default function Analisis() {
  useTutorialAutoStart();
  const { user } = useAuth();
  const { alerts } = useData();

  if (user?.rol !== "Administrador") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Acceso Restringido</CardTitle>
              <CardDescription>
                Esta sección está disponible solo para administradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                El análisis de conectividad y tráfico requiere permisos de administrador.
                Contacte a su administrador si necesita acceso a esta información.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate metrics from real alerts
  const alertasAltas = alerts.filter(a => a.nivel === "Alta" && a.estado === "Activa");
  const alertasMedias = alerts.filter(a => a.nivel === "Media" && a.estado === "Activa");
  const alertasBajas = alerts.filter(a => a.nivel === "Baja" && a.estado === "Activa");

  // Simulated metrics (would come from network monitoring in real system)
  const conexionesActivas = 47 + Math.floor(Math.random() * 10); // Simulate variation
  const conexionesSospechosas = alertasAltas.length + alertasMedias.length;
  const picosTrafic = alertasAltas.filter(a => a.type === 'data_exfiltration').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Conectividad</h1>
          <p className="text-muted-foreground">
            Monitoreo de conexiones de red y detección de comportamiento anómalo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3" data-tutorial="connectivity-metrics">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conexiones Activas</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conexionesActivas}</div>
              <p className="text-xs text-muted-foreground">Simulado - En sistema real</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destinos Sospechosos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conexionesSospechosas}</div>
              <p className="text-xs text-muted-foreground">Alertas Alta + Media activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Picos de Tráfico</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{picosTrafic}</div>
              <p className="text-xs text-muted-foreground">Intentos de exfiltración detectados</p>
            </CardContent>
          </Card>
        </div>


        <Card data-tutorial="traffic-chart">
          <CardHeader>
            <CardTitle>Tráfico por Equipo</CardTitle>
            <CardDescription>Volumen de datos transferidos en las últimas 24 horas (GB)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosTrafico}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="equipo"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  className="text-xs"
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  className="text-xs"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar
                  dataKey="trafico"
                  fill="hsl(var(--primary))"
                  name="Tráfico (GB)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card data-tutorial="suspicious-connections">
          <CardHeader>
            <CardTitle>Conexiones Sospechosas Detectadas</CardTitle>
            <CardDescription>
              IPs y dominios que requieren atención inmediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.filter(a => a.nivel === "Alta" || a.nivel === "Media").map((alert) => (
                <div key={alert.id} className={`flex items-start justify-between p-4 border rounded-lg ${alert.nivel === "Alta" ? "border-destructive bg-destructive/5" : "border-warning bg-warning/5"}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {alert.nivel === "Alta" ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <Globe className="h-4 w-4 text-warning" />}
                      <span className="font-medium">{alert.nivel === "Alta" ? "Amenaza Crítica Detectada" : "Alerta de Seguridad"}</span>
                      <Badge className={alert.nivel === "Alta" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"}>{alert.nivel}</Badge>
                    </div>
                    <p className="text-sm mb-2">
                      {alert.descripcion}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Equipo: {alert.equipo_nombre}</span>
                      <span>{new Date(alert.fecha).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}

              {alerts.filter(a => a.nivel === "Alta" || a.nivel === "Media").length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">No hay conexiones sospechosas detectadas</p>
                  <p className="text-xs text-muted-foreground mt-1">El sistema está monitoreando activamente la red</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card data-tutorial="recommendations">
          <CardHeader>
            <CardTitle>Recomendaciones</CardTitle>
            <CardDescription>Acciones sugeridas basadas en el análisis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasAltas.length === 0 && alertasMedias.length === 0 ? (
                <div className="p-4 border rounded-lg bg-success/5 border-success/20">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-success">Sistema Seguro</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        No hay alertas críticas o medias activas. Continuar con monitoreo rutinario.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {alertasAltas.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-destructive mb-1">{alert.equipo_nombre}</p>
                          <p className="text-sm mb-2">{alert.recomendacion}</p>
                          <p className="text-xs text-muted-foreground">
                            Alerta: {alert.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {alertasMedias.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg bg-warning/5 border-warning/20">
                      <div className="flex items-start gap-2">
                        <Activity className="h-5 w-5 text-warning mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-warning mb-1">{alert.equipo_nombre}</p>
                          <p className="text-sm mb-2">{alert.recomendacion}</p>
                          <p className="text-xs text-muted-foreground">
                            Alerta: {alert.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div >
    </DashboardLayout >
  );
}
