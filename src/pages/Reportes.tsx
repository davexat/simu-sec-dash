import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, TrendingUp, AlertTriangle, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataProvider";
import { useTutorialAutoStart } from "@/hooks/useTutorialAutoStart";

export default function Reportes() {
  useTutorialAutoStart();
  const { toast } = useToast();
  const { user } = useAuth();
  const { equipment, alerts, resolvedAlerts, incidents, calculateRiskLevel } = useData();

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
                Los reportes ejecutivos requieren permisos de administrador.
                Contacte a su administrador si necesita acceso a esta información.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const descargarReporte = () => {
    toast({
      title: "Generando reporte",
      description: "El reporte PDF se descargará en unos segundos",
    });

    setTimeout(() => {
      toast({
        title: "Reporte generado",
        description: "El archivo se ha descargado correctamente",
      });
    }, 2000);
  };

  const seguros = equipment.filter(e => e.estado_seguridad === "Seguro").length;
  const enRiesgo = equipment.filter(e => e.estado_seguridad === "Advertencia").length;
  const amenazados = equipment.filter(e => e.estado_seguridad === "Amenaza").length;
  const alertasActivas = alerts.filter(a => a.estado === "Activa").length;

  // Total de alertas resueltas en esta sesión + incidentes históricos resueltos
  const totalResueltos = resolvedAlerts.length + incidents.filter(i => i.estado === "Resuelto").length;

  // Dynamic risk calculation
  const riskData = calculateRiskLevel();

  // Calculate percentages for equipment status
  const totalEquipment = equipment.length;
  const segurosPercent = totalEquipment > 0 ? Math.round((seguros / totalEquipment) * 100) : 0;
  const enRiesgoPercent = totalEquipment > 0 ? Math.round((enRiesgo / totalEquipment) * 100) : 0;
  const amenazadosPercent = totalEquipment > 0 ? Math.round((amenazados / totalEquipment) * 100) : 0;

  // Calculate resolution rate based on alerts (not incidents)
  const totalAlertsEver = alerts.length + resolvedAlerts.length; // Active + Resolved
  const alertasResueltas = resolvedAlerts.length;
  const resolutionRate = totalAlertsEver > 0 ? Math.round((alertasResueltas / totalAlertsEver) * 100) : 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reportes Ejecutivos</h1>
            <p className="text-muted-foreground">
              Resúmenes y análisis para toma de decisiones estratégicas
            </p>
          </div>
          <Button onClick={descargarReporte}>
            <Download className="h-4 w-4 mr-2" />
            Descargar Reporte PDF
          </Button>
        </div>

        <Card data-tutorial="monthly-summary">
          <CardHeader>
            <CardTitle>Resumen del Mes Actual</CardTitle>
            <CardDescription>Diciembre 2025 • Vista general de seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Equipos Seguros</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{seguros}</p>
                  <Badge className="bg-success/10 text-success">
                    {segurosPercent}% del total
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">de {totalEquipment} equipos</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">En Riesgo</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{enRiesgo}</p>
                  <Badge className="bg-warning/10 text-warning">{enRiesgoPercent}% del total</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">requieren atención</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Amenazas Activas</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{amenazados}</p>
                  <Badge className="bg-danger/10 text-danger">{amenazadosPercent}% del total</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">críticas</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Tasa de Resolución</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{resolutionRate}%</p>
                  <Badge className={`${resolutionRate >= 80 ? 'bg-success/10 text-success' :
                    resolutionRate >= 50 ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                    {alertasResueltas}/{totalAlertsEver}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">alertas resueltas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card data-tutorial="protection-level">
            <CardHeader>
              <CardTitle>Nivel de Riesgo General</CardTitle>
              <CardDescription>Evaluación basada en todos los indicadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Riesgo Actual</span>
                  <Badge className={`${riskData.level === 'ALTO' ? 'bg-destructive/10 text-destructive' :
                    riskData.level === 'MEDIO' ? 'bg-warning/10 text-warning' :
                      'bg-green-500/10 text-green-600'
                    }`}>{riskData.level}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nivel de Protección</span>
                    <span className="font-medium">{100 - riskData.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${riskData.level === 'ALTO' ? 'bg-destructive' :
                      riskData.level === 'MEDIO' ? 'bg-warning' :
                        'bg-green-500'
                      }`} style={{ width: `${100 - riskData.percentage}%` }} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Se detectaron {alertasActivas} alertas activas que requieren atención.
                  {riskData.level === 'ALTO' && ' Se recomienda resolver las amenazas críticas INMEDIATAMENTE.'}
                  {riskData.level === 'MEDIO' && ' Se recomienda resolver las amenazas en las próximas 24 horas.'}
                  {riskData.level === 'BAJO' && ' El sistema está operando normalmente.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipos Críticos</CardTitle>
              <CardDescription>Sistemas que requieren atención prioritaria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-danger/10 rounded">
                  <div>
                    <p className="font-medium">PC-Ventas-1</p>
                    <p className="text-xs text-muted-foreground">Amenaza de ransomware detectada</p>
                  </div>
                  <Badge className="bg-danger text-danger-foreground">Crítico</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded">
                  <div>
                    <p className="font-medium">SERV-FACT</p>
                    <p className="text-xs text-muted-foreground">Agente desactualizado</p>
                  </div>
                  <Badge className="bg-warning text-warning-foreground">Advertencia</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">LAP-Admin</p>
                    <p className="text-xs text-muted-foreground">Sin conexión prolongada</p>
                  </div>
                  <Badge variant="secondary">Revisar</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Rendimiento</CardTitle>
            <CardDescription>Indicadores clave del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-success" />
                  <p className="font-medium">Tiempo de Respuesta</p>
                </div>
                <p className="text-2xl font-bold mb-1">2.4 horas</p>
                <p className="text-sm text-muted-foreground">
                  Promedio para resolver incidentes críticos
                </p>
              </div>
              <div data-tutorial="incidents-history">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <p className="font-medium">Historial de Incidentes</p>
                </div>
                <p className="text-2xl font-bold mb-1">{incidents.length}</p>
                <p className="text-sm text-muted-foreground">
                  {alertasActivas} alertas activas requieren atención
                </p>
              </div>
              <div data-tutorial="backup-success">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <p className="font-medium">Respaldos Exitosos</p>
                </div>
                <p className="text-2xl font-bold mb-1">98.5%</p>
                <p className="text-sm text-muted-foreground">
                  De todos los respaldos programados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones Ejecutivas</CardTitle>
            <CardDescription>Acciones prioritarias para mejorar la seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <strong>Acción Inmediata:</strong> Aislar y restaurar PC-Ventas-1 debido a la detección de ransomware.
                Impacto estimado en operaciones: 2-4 horas.
              </li>
              <li className="text-sm">
                <strong>Próximas 48 horas:</strong> Actualizar el agente de seguridad en SERV-FACT durante la próxima
                ventana de mantenimiento. Coordinar con el equipo de sistemas.
              </li>
              <li className="text-sm">
                <strong>Esta semana:</strong> Revisar y reforzar las políticas de seguridad para dispositivos USB.
                Se detectaron 3 intentos de conexión no autorizada.
              </li>
              <li className="text-sm">
                <strong>Mes actual:</strong> Considerar actualizar equipos críticos como
                DB-Clientes para obtener monitoreo 24/7 y respuesta prioritaria.
              </li>
              <li className="text-sm">
                <strong>Capacitación:</strong> Programar sesión de concientización sobre phishing para el equipo de ventas
                después del incidente reportado en octubre.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-2">Reporte Completo Disponible</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Este resumen incluye los datos más relevantes del mes. El reporte completo en PDF contiene
                  gráficos detallados, análisis de tendencias y recomendaciones específicas por equipo.
                </p>
                <Button onClick={descargarReporte} variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Reporte Completo (PDF)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
