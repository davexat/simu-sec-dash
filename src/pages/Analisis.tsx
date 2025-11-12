import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, TrendingUp, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Analisis() {
  const { user } = useAuth();

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

  const conexionesActivas = 47;
  const conexionesSospechosas = 3;
  const picosTrafic = 2;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Conectividad</h1>
          <p className="text-muted-foreground">
            Monitoreo de conexiones de red y detección de comportamiento anómalo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conexiones Activas</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conexionesActivas}</div>
              <p className="text-xs text-muted-foreground">En este momento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destinos Sospechosos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conexionesSospechosas}</div>
              <p className="text-xs text-muted-foreground">Requieren revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Picos de Tráfico</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{picosTrafic}</div>
              <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Conexiones</CardTitle>
            <CardDescription>Actividad de red en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-2 text-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">Visualización de conexiones en tiempo real</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gráfico simulado mostrando patrones de tráfico de red
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conexiones Sospechosas Detectadas</CardTitle>
            <CardDescription>
              IPs y dominios que requieren atención inmediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 border rounded-lg border-warning">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-warning" />
                    <span className="font-medium">Conexión a IP sospechosa</span>
                    <Badge className="bg-warning/10 text-warning">Media</Badge>
                  </div>
                  <p className="text-sm mb-2">
                    El equipo PC-Ventas-1 intentó conectarse a 185.220.101.45, una IP asociada con actividad maliciosa conocida.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Origen: PC-Ventas-1 (192.168.1.103)</span>
                    <span>Destino: 185.220.101.45:443</span>
                    <span>Protocolo: HTTPS</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 border rounded-lg border-warning">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-warning" />
                    <span className="font-medium">Dominio no confiable</span>
                    <Badge className="bg-warning/10 text-warning">Media</Badge>
                  </div>
                  <p className="text-sm mb-2">
                    SERV-FACT intentó acceder a un dominio recientemente registrado sin historial de confianza.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Origen: SERV-FACT</span>
                    <span>Destino: suspicious-domain-2024.xyz</span>
                    <span>Bloqueado automáticamente</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 border rounded-lg border-primary">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-medium">Pico de tráfico inusual</span>
                    <Badge className="bg-primary/10 text-primary">Baja</Badge>
                  </div>
                  <p className="text-sm mb-2">
                    DB-Clientes registró un aumento del 340% en tráfico saliente entre las 03:00 y 04:00 AM.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Equipo: DB-Clientes</span>
                    <span>Volumen: 2.4 GB transferidos</span>
                    <span>Hora: 03:15 - 04:00</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones</CardTitle>
            <CardDescription>Acciones sugeridas basadas en el análisis</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <span>
                  <strong>PC-Ventas-1:</strong> Ejecutar análisis completo de malware y revisar procesos en ejecución
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <span>
                  <strong>SERV-FACT:</strong> Mantener bloqueado el acceso al dominio sospechoso y monitorear intentos futuros
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-primary mt-0.5" />
                <span>
                  <strong>DB-Clientes:</strong> Verificar respaldos programados que podrían explicar el pico de tráfico nocturno
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
