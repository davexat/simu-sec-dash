import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEquipment } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, Play, Download, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Equipos() {
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroUbicacion, setFiltroUbicacion] = useState<string>("todos");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [accionEnProgreso, setAccionEnProgreso] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const { toast } = useToast();

  const equiposFiltrados = mockEquipment.filter(equipo => {
    const cumpleFiltroEstado = filtroEstado === "todos" || equipo.estado_seguridad === filtroEstado;
    const cumpleFiltroUbicacion = filtroUbicacion === "todos" || equipo.ubicacion === filtroUbicacion;
    return cumpleFiltroEstado && cumpleFiltroUbicacion;
  });

  const ubicaciones = Array.from(new Set(mockEquipment.map(e => e.ubicacion)));

  const simularAccion = (accion: string, equipoNombre: string) => {
    setAccionEnProgreso(true);
    setProgreso(0);
    
    const intervalo = setInterval(() => {
      setProgreso(prev => {
        if (prev >= 100) {
          clearInterval(intervalo);
          setAccionEnProgreso(false);
          toast({
            title: "Acción completada",
            description: `${accion} en ${equipoNombre} finalizado exitosamente`,
          });
          setDialogAbierto(false);
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  const verDetalles = (equipoId: string) => {
    setEquipoSeleccionado(equipoId);
    setDialogAbierto(true);
    setProgreso(0);
  };

  const equipoActual = mockEquipment.find(e => e.id === equipoSeleccionado);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Equipos</h1>
          <p className="text-muted-foreground">
            Administre todos los equipos conectados con sus agentes de seguridad
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre equipos por estado de seguridad y ubicación</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex-1">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado de seguridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Seguro">Seguro</SelectItem>
                  <SelectItem value="Advertencia">Advertencia</SelectItem>
                  <SelectItem value="Amenaza">Amenaza</SelectItem>
                  <SelectItem value="Desconectado">Desconectado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filtroUbicacion} onValueChange={setFiltroUbicacion}>
                <SelectTrigger>
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las ubicaciones</SelectItem>
                  {ubicaciones.map(ubicacion => (
                    <SelectItem key={ubicacion} value={ubicacion}>{ubicacion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipos Registrados ({equiposFiltrados.length})</CardTitle>
            <CardDescription>
              Vista detallada de todos los equipos con sus agentes de seguridad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Sistema Operativo</TableHead>
                  <TableHead>Estado Seguridad</TableHead>
                  <TableHead>Conexión Agente</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equiposFiltrados.map((equipo) => (
                  <TableRow key={equipo.id}>
                    <TableCell className="font-mono text-xs">{equipo.id}</TableCell>
                    <TableCell className="font-medium">{equipo.nombre}</TableCell>
                    <TableCell>{equipo.usuario}</TableCell>
                    <TableCell>{equipo.OS}</TableCell>
                    <TableCell>
                      <StatusBadge status={equipo.estado_seguridad} type="security" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={equipo.estado_conexion_agente} type="connection" />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{equipo.version_agente}</Badge>
                    </TableCell>
                    <TableCell>{equipo.ubicacion}</TableCell>
                    <TableCell>{equipo.plan}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => verDetalles(equipo.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Equipo</DialogTitle>
              <DialogDescription>
                Información completa y acciones disponibles
              </DialogDescription>
            </DialogHeader>
            
            {equipoActual && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nombre del equipo</p>
                    <p className="text-sm text-muted-foreground">{equipoActual.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{equipoActual.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Usuario</p>
                    <p className="text-sm text-muted-foreground">{equipoActual.usuario}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sistema Operativo</p>
                    <p className="text-sm text-muted-foreground">{equipoActual.OS}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Versión del Agente</p>
                    <p className="text-sm text-muted-foreground">{equipoActual.version_agente}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Plan</p>
                    <p className="text-sm text-muted-foreground">{equipoActual.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado de Seguridad</p>
                    <StatusBadge status={equipoActual.estado_seguridad} type="security" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conexión del Agente</p>
                    <StatusBadge status={equipoActual.estado_conexion_agente} type="connection" />
                  </div>
                </div>

                {accionEnProgreso && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Procesando acción...</p>
                    <Progress value={progreso} />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => simularAccion("Análisis completo", equipoActual.nombre)}
                    disabled={accionEnProgreso}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Forzar Análisis
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => simularAccion("Descarga de respaldo", equipoActual.nombre)}
                    disabled={accionEnProgreso}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Respaldo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => simularAccion("Sincronización", equipoActual.nombre)}
                    disabled={accionEnProgreso}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar Agente
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
