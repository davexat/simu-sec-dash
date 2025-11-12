import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Shield, Zap, Crown } from "lucide-react";

const planes = [
  {
    id: "basico",
    nombre: "Plan Básico",
    icono: Shield,
    precio: "$19",
    periodo: "por equipo/mes",
    descripcion: "Protección esencial para pequeñas empresas",
    caracteristicas: [
      "Análisis de seguridad automático",
      "Respaldos diarios",
      "Alertas de amenazas",
      "Actualizaciones automáticas",
      "Soporte por correo electrónico",
      "Hasta 5 equipos"
    ],
    popular: false
  },
  {
    id: "estandar",
    nombre: "Plan Estándar",
    icono: Zap,
    precio: "$35",
    periodo: "por equipo/mes",
    descripcion: "Protección avanzada con monitoreo continuo",
    caracteristicas: [
      "Todo lo del Plan Básico",
      "Monitoreo de conectividad 24/7",
      "Políticas de seguridad personalizadas",
      "Análisis de tráfico de red",
      "Reportes mensuales",
      "Soporte prioritario por chat",
      "Hasta 20 equipos"
    ],
    popular: true
  },
  {
    id: "ejecutivo",
    nombre: "Plan Ejecutivo",
    icono: Crown,
    precio: "$59",
    periodo: "por equipo/mes",
    descripcion: "Máxima protección con respuesta inmediata",
    caracteristicas: [
      "Todo lo del Plan Estándar",
      "Respuesta a incidentes 24/7",
      "Análisis forense de amenazas",
      "Gestor de cuenta dedicado",
      "Capacitación mensual del equipo",
      "Auditorías de seguridad trimestrales",
      "Equipos ilimitados"
    ],
    popular: false
  }
];

export default function Planes() {
  const { toast } = useToast();

  const actualizarPlan = (nombrePlan: string) => {
    toast({
      title: "Solicitud enviada",
      description: `Un asesor se pondrá en contacto para actualizar al ${nombrePlan}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Planes y Precios</h1>
          <p className="text-muted-foreground">
            Elija el plan que mejor se adapte a las necesidades de su empresa
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {planes.map((plan) => {
            const Icon = plan.icono;
            return (
              <Card 
                key={plan.id}
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Más Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        plan.popular ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-center">{plan.nombre}</CardTitle>
                  <CardDescription className="text-center">
                    {plan.descripcion}
                  </CardDescription>
                  <div className="text-center pt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.precio}</span>
                      <span className="text-sm text-muted-foreground">{plan.periodo}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => actualizarPlan(plan.nombre)}
                  >
                    {plan.popular ? "Actualizar Plan" : "Seleccionar Plan"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comparación de Planes</CardTitle>
            <CardDescription>
              Vea las diferencias entre cada plan en detalle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Característica</th>
                    <th className="text-center p-4 font-medium">Básico</th>
                    <th className="text-center p-4 font-medium">Estándar</th>
                    <th className="text-center p-4 font-medium">Ejecutivo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Análisis de seguridad</td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Respaldos automáticos</td>
                    <td className="text-center p-4">Diarios</td>
                    <td className="text-center p-4">Cada 6 horas</td>
                    <td className="text-center p-4">Cada hora</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Monitoreo 24/7</td>
                    <td className="text-center p-4 text-muted-foreground">—</td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Análisis de tráfico</td>
                    <td className="text-center p-4 text-muted-foreground">—</td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Respuesta a incidentes</td>
                    <td className="text-center p-4 text-muted-foreground">—</td>
                    <td className="text-center p-4 text-muted-foreground">—</td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Gestor dedicado</td>
                    <td className="text-center p-4 text-muted-foreground">—</td>
                    <td className="text-center p-4 text-muted-foreground">—</td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-success mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">Equipos incluidos</td>
                    <td className="text-center p-4">Hasta 5</td>
                    <td className="text-center p-4">Hasta 20</td>
                    <td className="text-center p-4">Ilimitados</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>¿Necesita ayuda para elegir?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Nuestro equipo puede ayudarle a determinar qué plan es el más adecuado 
                para su empresa según el tamaño, industria y necesidades específicas.
              </p>
              <Button variant="outline">Contactar con un Asesor</Button>
            </CardContent>
          </Card>

          <Card className="bg-success/5">
            <CardHeader>
              <CardTitle>Descuentos por volumen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Ofrecemos descuentos especiales para empresas con más de 20 equipos.
                Contacte con ventas para obtener una cotización personalizada.
              </p>
              <Button variant="outline">Solicitar Cotización</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
