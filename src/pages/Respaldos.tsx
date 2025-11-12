import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBackups } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { HardDrive, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Respaldos() {
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [respaldoSeleccionado, setRespaldoSeleccionado] = useState<string | null>(null);
  const [restaurando, setRestaurando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const { toast } = useToast();

  const verificados = mockBackups.filter(b => b.integridad === "Verificado").length;
  const pendientes = mockBackups.filter(b => b.integridad === "Pendiente").length;
  const errores = mockBackups.filter(b => b.integridad === "Error").length;

  const iniciarRestauracion = (backupId: string) => {
    setRestaurando(true);
    setProgreso(0);

    const intervalo = setInterval(() => {
      setProgreso(prev => {
        if (prev >= 100) {
          clearInterval(intervalo);
          setRestaurando(false);
          toast({
            title: "Restauración completada",
            description: "Los archivos han sido restaurados exitosamente",
          });
          setDialogAbierto(false);
          return 100;
        }
        return prev + 10;
      });
    }, 800);
  };

  const getIntegridadBadge = (integridad: string) => {
    switch (integridad) {
      case "Verificado":
        return <Badge className="bg-success/10 text-success"><CheckCircle className="h-3 w-3 mr-1" />Verificado</Badge>;
      case "Pendiente":
        return <Badge className="bg-warning/10 text-warning"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case "Error":
        return <Badge className="bg-danger/10 text-danger"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return null;
    }
  };

  const backupActual = mockBackups.find(b => b.id === respaldoSeleccionado);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Respaldos</h1>
          <p className="text-muted-foreground">
            Administre copias de seguridad automáticas y restaure información cuando sea necesario
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respaldos Verificados</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verificados}</div>
              <p className="text-xs text-muted-foreground">Integridad confirmada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Verificación</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendientes}</div>
              <p className="text-xs text-muted-foreground">Proceso en curso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Almacenado</CardTitle>
              <HardDrive className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockBackups.reduce((acc, b) => acc + parseInt(b.tamaño), 0)} GB
              </div>
              <p className="text-xs text-muted-foreground">Espacio utilizado</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Respaldos Automáticos</CardTitle>
            <CardDescription>
              Listado de copias de seguridad realizadas automáticamente por el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Estado de Integridad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBackups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-mono text-xs">{backup.id}</TableCell>
                    <TableCell className="font-medium">{backup.equipo_nombre}</TableCell>
                    <TableCell>{new Date(backup.fecha).toLocaleString('es-ES')}</TableCell>
                    <TableCell>{backup.tamaño}</TableCell>
                    <TableCell>{getIntegridadBadge(backup.integridad)}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setRespaldoSeleccionado(backup.id);
                          setDialogAbierto(true);
                        }}
                        disabled={backup.integridad === "Error"}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Restaurar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Respaldos</CardTitle>
            <CardDescription>
              Los respaldos automáticos están configurados para ejecutarse diariamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Frecuencia de respaldo</p>
                  <p className="text-sm text-muted-foreground">Diario a las 02:00 AM</p>
                </div>
                <Badge>Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Retención de datos</p>
                  <p className="text-sm text-muted-foreground">Mantener últimos 30 respaldos</p>
                </div>
                <Badge>Configurado</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Verificación de integridad</p>
                  <p className="text-sm text-muted-foreground">Automática después de cada respaldo</p>
                </div>
                <Badge className="bg-success/10 text-success">Habilitado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restaurar Respaldo</DialogTitle>
              <DialogDescription>
                Confirme los detalles antes de proceder con la restauración
              </DialogDescription>
            </DialogHeader>
            
            {backupActual && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Equipo</p>
                    <p className="text-sm text-muted-foreground">{backupActual.equipo_nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fecha del respaldo</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(backupActual.fecha).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tamaño</p>
                    <p className="text-sm text-muted-foreground">{backupActual.tamaño}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado de integridad</p>
                    {getIntegridadBadge(backupActual.integridad)}
                  </div>
                </div>

                {restaurando && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Restaurando archivos...</p>
                    <Progress value={progreso} />
                    <p className="text-xs text-muted-foreground text-center">{progreso}% completado</p>
                  </div>
                )}

                {!restaurando && (
                  <div className="bg-warning/10 p-3 rounded">
                    <p className="text-sm font-medium mb-1">Importante:</p>
                    <p className="text-sm">
                      La restauración sobrescribirá los archivos actuales con las versiones del respaldo.
                      Este proceso puede tardar varios minutos dependiendo del tamaño de los datos.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => iniciarRestauracion(backupActual.id)}
                    disabled={restaurando}
                    className="flex-1"
                  >
                    {restaurando ? "Restaurando..." : "Confirmar Restauración"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setDialogAbierto(false)}
                    disabled={restaurando}
                  >
                    Cancelar
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
