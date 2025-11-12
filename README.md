# SecurePYME - Panel de Ciberseguridad

Prototipo funcional de panel de control de ciberseguridad diseñado para PYMEs. Simulación completa con datos ficticios para pruebas con usuarios y evaluaciones de UX/UI.

## 🎯 Objetivo

Este es un prototipo de alta fidelidad que simula una aplicación de ciberseguridad completamente funcional. Todos los datos son ficticios, las acciones son simuladas, y no se ejecutan procesos reales. El objetivo es validar la experiencia de usuario, navegación, claridad de alertas y utilidad de las funciones.

## 🔐 Credenciales de Acceso

### Administrador (Vista Completa)
- **Email:** admin@empresa.com
- **Contraseña:** demo123
- Acceso a todas las funciones

### Operativo (Vista Limitada)
- **Email:** operativo@empresa.com
- **Contraseña:** demo123
- Acceso restringido a funciones operativas

## ✨ Características Principales

### 1. Dashboard Principal
- Estado general de equipos (Seguros / En Riesgo / Amenazados)
- Métricas en tiempo real
- Tabla de equipos con filtros
- Vista rápida de alertas activas

### 2. Gestión de Equipos
- Listado detallado de 8 equipos simulados
- Estados de conexión de agentes (Conectado / Desconectado / En sincronización)
- Filtros por estado de seguridad y ubicación
- Acciones simuladas: análisis forzado, descarga de respaldos, sincronización

### 3. Sistema de Alertas
- 3 niveles de alerta: Baja, Media, Alta
- Descripciones detalladas con recomendaciones
- Acciones: Marcar como resuelta, Ver detalles, Solicitar ayuda
- Centro de notificaciones

### 4. Historial de Incidentes
- Registro de últimos 30/90 días
- Estados: Resuelto, Mitigado, En investigación
- Filtros por estado y período
- Vista de línea de tiempo

### 5. Copias de Seguridad
- Respaldos automáticos con timestamps
- Verificación de integridad simulada
- Flujo de restauración con barra de progreso
- Configuración de políticas de respaldo

### 6. Políticas de Seguridad
- 6 políticas configurables
- Switches para habilitar/deshabilitar
- Historial de cambios
- Solo accesible para administradores

### 7. Análisis de Conectividad
- Monitoreo de conexiones activas
- Detección de destinos sospechosos
- Análisis de picos de tráfico
- Recomendaciones automáticas

### 8. Reportes Ejecutivos
- Resumen mensual de seguridad
- Nivel de riesgo general
- Equipos críticos
- Métricas de rendimiento
- Descarga de reportes PDF (simulado)

### 9. Planes y Precios
- 3 planes: Básico, Estándar, Ejecutivo
- Tabla comparativa de características
- Simulación de actualización de plan

### 10. Control de Acceso por Roles
- Rol Administrador: acceso completo
- Rol Operativo: acceso limitado
- Mensajes claros cuando se intenta acceso no autorizado

## 🎨 Diseño

- **Colores:** Paleta profesional de ciberseguridad
  - Azul primario (#3b82f6) para elementos principales
  - Verde (#16a34a) para estados seguros
  - Amarillo/Naranja (#f59e0b) para advertencias
  - Rojo (#dc2626) para amenazas
- **Tipografía:** Clara y legible, sin jerga técnica
- **Iconografía:** Lucide React para consistencia
- **Responsive:** Adaptado a desktop y mobile

## 🛠️ Stack Tecnológico

- **React** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Shadcn UI** componentes base
- **React Router** navegación
- **Context API** gestión de estado de autenticación

## 📊 Datos de Ejemplo

El prototipo incluye:
- 8 equipos con diferentes estados
- 3 alertas activas de distintos niveles
- 5 incidentes históricos
- 8 respaldos automáticos
- 6 políticas de seguridad
- 3 planes de servicio

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📱 Navegación

1. Inicie sesión con una de las credenciales proporcionadas
2. Explore el dashboard principal
3. Use el menú lateral para navegar entre secciones
4. Interactúe con alertas, equipos y políticas
5. Todos los cambios son simulados y no persisten

## 🎭 Simulaciones Implementadas

- Estados de conexión de agentes con animaciones
- Procesos de análisis con barras de progreso
- Restauración de respaldos con feedback visual
- Aplicación de políticas con confirmación
- Descarga de reportes
- Actualización de planes
- Solicitud de ayuda técnica

## 📝 Notas para Evaluadores

- Todas las acciones muestran feedback inmediato (toasts, modales)
- Los datos no persisten entre recargas
- Las animaciones y transiciones simulan procesos reales
- El lenguaje es accesible y no técnico
- Los colores siguen convenciones estándar de seguridad

## 🔒 Seguridad en el Prototipo

Este es un prototipo de demostración. En producción:
- Usar autenticación real (no localStorage)
- Implementar backend con API segura
- Validar todas las entradas de usuario
- Usar HTTPS en todas las comunicaciones
- Implementar autorización a nivel de servidor

## 📧 Contacto

Para preguntas sobre el prototipo o evaluación, contacte al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025  
**Estado:** Prototipo Funcional para Evaluación
