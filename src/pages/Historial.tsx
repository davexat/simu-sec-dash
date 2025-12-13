import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIncidents } from "@/data/mockData";
import { Incident, IncidentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock, AlertCircle, ChevronDown } from "lucide-react";
import { useData } from "@/contexts/DataProvider";
import { Button } from "@/components/ui/button";

export default function Historial() {
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("30");
  const [visibleCount, setVisibleCount] = useState(5); // Pagination limit
  const { incidents: incidentes } = useData();

  const incidentesFiltrados = incidentes.filter(incidente => {
    const cumpleFiltroEstado = filtroEstado === "todos" || incidente.estado === filtroEstado;

    const fechaIncidente = new Date(incidente.fecha);
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - parseInt(filtroPeriodo));
    const cumpleFiltroPeriodo = fechaIncidente >= fechaLimite;

    return cumpleFiltroEstado && cumpleFiltroPeriodo;
  });

  const getStatusIcon = (estado: IncidentStatus) => {
    switch (estado) {
      case "Resuelto":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "Mitigado":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "En investigación":
        return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (estado: IncidentStatus) => {
    switch (estado) {
      case "Resuelto":
        return "bg-success/10 text-success";
      case "Mitigado":
        return "bg-warning/10 text-warning";
      case "En investigación":
        return "bg-primary/10 text-primary";
    }
  };

  const resueltos = mockIncidents.filter(i => i.estado === "Resuelto").length;
  const mitigados = mockIncidents.filter(i => i.estado === "Mitigado").length;
  const enInvestigacion = mockIncidents.filter(i => i.estado === "En investigación").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Historial de Incidentes</h1>
          <p className="text-muted-foreground">
            Registro completo de eventos de seguridad y acciones tomadas
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resueltos}</div>
              <p className="text-xs text-muted-foreground">Completamente solucionados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mitigados</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mitigados}</div>
              <p className="text-xs text-muted-foreground">Riesgo reducido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Investigación</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enInvestigacion}</div>
              <p className="text-xs text-muted-foreground">Análisis en curso</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre incidentes por estado y período de tiempo</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex-1">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado del incidente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Resuelto">Resuelto</SelectItem>
                  <SelectItem value="Mitigado">Mitigado</SelectItem>
                  <SelectItem value="En investigación">En investigación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 días</SelectItem>
                  <SelectItem value="30">Últimos 30 días</SelectItem>
                  <SelectItem value="90">Últimos 90 días</SelectItem>
                  <SelectItem value="365">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Incidentes ({incidentesFiltrados.length})</CardTitle>
            <CardDescription>Listado detallado de eventos de seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones Tomadas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidentesFiltrados.map((incidente) => (
                  <TableRow key={incidente.id}>
                    <TableCell className="font-mono text-xs">{incidente.id}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(incidente.fecha).toLocaleString('es-ES')}
                    </TableCell>
                    <TableCell className="font-medium">{incidente.equipo_nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{incidente.tipo}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs text-sm">{incidente.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(incidente.estado)}
                        <Badge className={getStatusColor(incidente.estado)}>
                          {incidente.estado}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ul className="text-xs space-y-1">
                        {incidente.acciones.map((accion, idx) => (
                          <li key={idx} className="text-muted-foreground">• {accion}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Línea de Tiempo</CardTitle>
            <CardDescription>Vista cronológica de los incidentes recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              {incidentesFiltrados.slice(0, visibleCount).map((incidente, index) => (
                <div key={incidente.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-2 bg-primary/10">
                      {getStatusIcon(incidente.estado)}
                    </div>
                    {index < visibleCount - 1 && index < incidentesFiltrados.length - 1 && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{incidente.equipo_nombre}</p>
                        <p className="text-sm text-muted-foreground">{incidente.tipo}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(incidente.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{incidente.descripcion}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(incidente.estado)}>
                        {incidente.estado}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {incidente.acciones.length} acción(es) tomada(s)
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {visibleCount < incidentesFiltrados.length && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => setVisibleCount(prev => prev + 5)}>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Cargar más antiguos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
