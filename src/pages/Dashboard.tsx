import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataProvider";
import { Shield, AlertTriangle, HardDrive, Activity } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { mockEquipment } from "@/data/mockData";

export default function Dashboard() {
  const navigate = useNavigate();
  const { equipment, alerts } = useData();

  const seguros = equipment.filter(e => e.estado_seguridad === "Seguro").length;
  const enRiesgo = equipment.filter(e => e.estado_seguridad === "Advertencia").length;
  const amenazados = equipment.filter(e => e.estado_seguridad === "Amenaza").length;
  const alertasActivas = alerts.filter(a => a.estado === "Activa").length;

  const porcentajeSeguro = Math.round((seguros / equipment.length) * 100);
  const porcentajeRiesgo = Math.round((enRiesgo / equipment.length) * 100);
  const porcentajeAmenaza = Math.round((amenazados / equipment.length) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Seguridad</h1>
          <p className="text-muted-foreground">Vista general del estado de protección de su empresa</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipos Seguros</CardTitle>
              <Shield className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{porcentajeSeguro}%</div>
              <p className="text-xs text-muted-foreground">{seguros} de {equipment.length} equipos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Riesgo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{porcentajeRiesgo}%</div>
              <p className="text-xs text-muted-foreground">{enRiesgo} equipos requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amenazas Activas</CardTitle>
              <Activity className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{amenazados}</div>
              <p className="text-xs text-muted-foreground">Requieren acción inmediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <HardDrive className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertasActivas}</div>
              <p className="text-xs text-muted-foreground">Notificaciones pendientes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Equipos</CardTitle>
            <CardDescription>Resumen de todos los equipos registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Conexión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((equipo) => (
                  <TableRow key={equipo.id}>
                    <TableCell className="font-medium">{equipo.nombre}</TableCell>
                    <TableCell>{equipo.usuario}</TableCell>
                    <TableCell>
                      <StatusBadge status={equipo.estado_seguridad} type="security" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={equipo.estado_conexion_agente} type="connection" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => navigate("/equipos")}>Ver todos los equipos</Button>
            </div>
          </CardContent>
        </Card>

        {alertasActivas > 0 && (
          <div className="space-y-4">
            {/* Amenazas Críticas */}
            {alerts.filter(a => a.estado === "Activa" && a.nivel === "Alta").length > 0 && (
              <Card className="border-danger">
                <CardHeader>
                  <CardTitle className="text-danger">Amenazas Críticas</CardTitle>
                  <CardDescription>Requieren acción inmediata para proteger sus sistemas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alerts.filter(a => a.estado === "Activa" && a.nivel === "Alta").map((alerta) => (
                      <div key={alerta.id} className="p-3 bg-muted rounded-lg flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={alerta.nivel} type="alert" />
                            <span className="font-medium">{alerta.equipo_nombre}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alerta.descripcion}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => navigate("/alertas")}>
                          Ver detalles
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Advertencias Informativas */}
            {alerts.filter(a => a.estado === "Activa" && (a.nivel === "Media" || a.nivel === "Baja")).length > 0 && (
              <Card className="border-warning">
                <CardHeader>
                  <CardTitle className="text-warning">Advertencias Informativas</CardTitle>
                  <CardDescription>Revise estas notificaciones cuando sea conveniente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alerts.filter(a => a.estado === "Activa" && (a.nivel === "Media" || a.nivel === "Baja")).map((alerta) => (
                      <div key={alerta.id} className="p-3 bg-muted rounded-lg flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={alerta.nivel} type="alert" />
                            <span className="font-medium">{alerta.equipo_nombre}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alerta.descripcion}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => navigate("/alertas")}>
                          Ver detalles
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
