import { Equipment, Alert, Incident, Backup, SecurityPolicy, PolicyConfiguration } from "@/types";

// Equipo seleccionado para el simulador de escritorio
export const SIMULATED_EQUIPMENT_ID = "EQ-006"; // POS-Tienda1 (cajero1)

export const mockEquipment: Equipment[] = [
  {
    id: "EQ-001",
    nombre: "PC-Contabilidad",
    usuario: "maria.f",
    OS: "Windows 10",
    ultimo_respaldo: "2025-11-10T02:14:00",
    estado_seguridad: "Seguro",
    version_agente: "1.2.3",
    estado_conexion_agente: "Conectado"
  },
  {
    id: "EQ-002",
    nombre: "SERV-FACT",
    usuario: "sistemas",
    OS: "Ubuntu 22.04",
    ultimo_respaldo: "2025-11-11T23:05:00",
    estado_seguridad: "Advertencia",
    version_agente: "1.2.1",
    estado_conexion_agente: "Desincronizado"
  },
  {
    id: "EQ-003",
    nombre: "PC-Ventas-1",
    usuario: "juan.p",
    OS: "Windows 11",
    ultimo_respaldo: "2025-11-09T12:00:00",
    estado_seguridad: "Amenaza",
    version_agente: "1.2.3",
    estado_conexion_agente: "Conectado"
  },
  {
    id: "EQ-004",
    nombre: "LAP-Admin",
    usuario: "roberto.g",
    OS: "macOS 13",
    ultimo_respaldo: "2025-11-08T04:30:00",
    estado_seguridad: "Desconectado",
    version_agente: "N/A",
    estado_conexion_agente: "Desconectado"
  },
  {
    id: "EQ-005",
    nombre: "PC-Soporte",
    usuario: "soporte",
    OS: "Windows 10",
    ultimo_respaldo: "2025-11-11T01:20:00",
    estado_seguridad: "Seguro",
    version_agente: "1.2.3",
    estado_conexion_agente: "Conectado"
  },
  {
    id: "EQ-006",
    nombre: "POS-Tienda1",
    usuario: "cajero1",
    OS: "Windows 10",
    ultimo_respaldo: "2025-11-12T06:10:00",
    estado_seguridad: "Advertencia",
    version_agente: "1.2.3",
    estado_conexion_agente: "Conectado"
  },
  {
    id: "EQ-007",
    nombre: "PORTATIL-MKT",
    usuario: "ana.v",
    OS: "Ubuntu 24.04",
    ultimo_respaldo: "2025-11-10T21:40:00",
    estado_seguridad: "Seguro",
    version_agente: "1.2.3",
    estado_conexion_agente: "Conectado"
  },
  {
    id: "EQ-008",
    nombre: "DB-Clientes",
    usuario: "dbadmin",
    OS: "CentOS 7",
    ultimo_respaldo: "2025-11-12T00:00:00",
    estado_seguridad: "Seguro",
    version_agente: "1.2.3",
    estado_conexion_agente: "Conectado"
  }
];

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    nivel: "Alta",
    fecha: "2025-11-12T09:23:00",
    equipo_id: "EQ-003",
    equipo_nombre: "PC-Ventas-1",
    descripcion: "Se detectó un cambio masivo en archivos en PC-Ventas-1. Más de 500 archivos fueron modificados en los últimos 10 minutos, lo que podría indicar actividad de ransomware.",
    recomendacion: "Aísle inmediatamente el equipo de la red y restaure la última copia de seguridad. No apague el equipo para preservar evidencia forense.",
    estado: "Activa"
  },
  {
    id: "ALT-002",
    nivel: "Media",
    fecha: "2025-11-12T08:45:00",
    equipo_id: "EQ-002",
    equipo_nombre: "SERV-FACT",
    descripcion: "El servidor de facturación está ejecutando una versión desactualizada del agente de seguridad. La versión actual tiene vulnerabilidades conocidas que han sido corregidas.",
    recomendacion: "Programe una actualización del agente durante el próximo mantenimiento. La actualización tomará aproximadamente 5 minutos y no requiere reinicio del servidor.",
    estado: "Activa"
  },
  {
    id: "ALT-003",
    nivel: "Baja",
    fecha: "2025-11-12T07:15:00",
    equipo_id: "EQ-006",
    equipo_nombre: "POS-Tienda1",
    descripcion: "Se detectó un intento de conexión desde un dispositivo USB no autorizado en el punto de venta. El acceso fue bloqueado automáticamente por las políticas de seguridad.",
    recomendacion: "Verifique con el usuario si intentó conectar un dispositivo legítimo. Si es necesario, puede agregar el dispositivo a la lista de autorizados en la sección de Políticas.",
    estado: "Activa"
  }
];

export const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    fecha: "2025-12-10T14:30:00",
    equipo_id: "EQ-003",
    equipo_nombre: "PC-Ventas-1",
    tipo: "Malware detectado",
    descripcion: "Troyano bancario detectado en proceso sospechoso",
    acciones: ["Proceso terminado", "Archivo en cuarentena", "Análisis completo ejecutado"],
    estado: "Resuelto"
  },
  {
    id: "INC-002",
    fecha: "2025-12-08T10:15:00",
    equipo_id: "EQ-004",
    equipo_nombre: "LAP-Admin",
    descripcion: "Pérdida de conexión prolongada del agente",
    tipo: "Conectividad",
    acciones: ["Notificación enviada", "Reinicio remoto solicitado"],
    estado: "En investigación"
  },
  {
    id: "INC-003",
    fecha: "2025-12-05T16:45:00",
    equipo_id: "EQ-002",
    equipo_nombre: "SERV-FACT",
    tipo: "Acceso no autorizado",
    descripcion: "Intento de acceso SSH desde IP no reconocida",
    acciones: ["IP bloqueada", "Contraseñas actualizadas", "Autenticación de dos factores habilitada"],
    estado: "Resuelto"
  },
  {
    id: "INC-004",
    fecha: "2025-11-28T09:20:00",
    equipo_id: "EQ-006",
    equipo_nombre: "POS-Tienda1",
    tipo: "Software no autorizado",
    descripcion: "Instalación de aplicación no aprobada detectada",
    acciones: ["Software desinstalado", "Política reforzada"],
    estado: "Mitigado"
  },
  {
    id: "INC-005",
    fecha: "2025-11-22T13:50:00",
    equipo_id: "EQ-001",
    equipo_nombre: "PC-Contabilidad",
    tipo: "Phishing",
    descripcion: "Usuario reportó email sospechoso con adjunto malicioso",
    acciones: ["Email bloqueado", "Capacitación al usuario", "Análisis del adjunto completado"],
    estado: "Resuelto"
  }
];

export const mockBackups: Backup[] = [
  { id: "BKP-001", equipo_id: "EQ-001", equipo_nombre: "PC-Contabilidad", fecha: "2025-11-10T02:14:00", tamaño: "45 GB", integridad: "Verificado" },
  { id: "BKP-002", equipo_id: "EQ-002", equipo_nombre: "SERV-FACT", fecha: "2025-11-11T23:05:00", tamaño: "128 GB", integridad: "Verificado" },
  { id: "BKP-003", equipo_id: "EQ-003", equipo_nombre: "PC-Ventas-1", fecha: "2025-11-09T12:00:00", tamaño: "32 GB", integridad: "Verificado" },
  { id: "BKP-004", equipo_id: "EQ-004", equipo_nombre: "LAP-Admin", fecha: "2025-11-08T04:30:00", tamaño: "78 GB", integridad: "Pendiente" },
  { id: "BKP-005", equipo_id: "EQ-005", equipo_nombre: "PC-Soporte", fecha: "2025-11-11T01:20:00", tamaño: "52 GB", integridad: "Verificado" },
  { id: "BKP-006", equipo_id: "EQ-006", equipo_nombre: "POS-Tienda1", fecha: "2025-11-12T06:10:00", tamaño: "15 GB", integridad: "Verificado" },
  { id: "BKP-007", equipo_id: "EQ-007", equipo_nombre: "PORTATIL-MKT", fecha: "2025-11-10T21:40:00", tamaño: "64 GB", integridad: "Verificado" },
  { id: "BKP-008", equipo_id: "EQ-008", equipo_nombre: "DB-Clientes", fecha: "2025-11-12T00:00:00", tamaño: "256 GB", integridad: "Verificado" }
];

export const mockPolicies: SecurityPolicy[] = [
  {
    id: "POL-001",
    nombre: "Bloquear dispositivos USB",
    descripcion: "Impide la conexión de dispositivos USB no autorizados para prevenir fugas de información y malware.",
    habilitada: true
  },
  {
    id: "POL-002",
    nombre: "Detectar programas desconocidos",
    descripcion: "Alerta cuando se ejecutan aplicaciones que no están en la lista de software aprobado por la empresa.",
    habilitada: true
  },
  {
    id: "POL-003",
    nombre: "Restringir conexiones externas",
    descripcion: "Bloquea conexiones salientes a direcciones IP o dominios no confiables identificados en listas de amenazas.",
    habilitada: false
  },
  {
    id: "POL-004",
    nombre: "Limitar instalaciones",
    descripcion: "Requiere aprobación del administrador antes de instalar nuevo software en los equipos protegidos.",
    habilitada: true
  },
  {
    id: "POL-005",
    nombre: "Análisis automático programado",
    descripcion: "Ejecuta escaneos completos de seguridad semanalmente durante horarios de baja actividad.",
    habilitada: true
  },
  {
    id: "POL-006",
    nombre: "Control de acceso remoto",
    descripcion: "Supervisa y registra todos los accesos remotos a los sistemas, requiriendo autenticación de dos factores.",
    habilitada: false
  }
];

// Configuraciones específicas por equipo (excepciones al comportamiento global)
export const mockPolicyConfigurations: PolicyConfiguration[] = [
  {
    policyId: "POL-004", // Limitar instalaciones
    equipmentId: "EQ-002", // SERV-FACT
    enabled: true
  },
  {
    policyId: "POL-004", // Limitar instalaciones
    equipmentId: "EQ-008", // DB-Clientes
    enabled: true
  },
  {
    policyId: "POL-003", // Restringir conexiones externas
    equipmentId: "EQ-008", // DB-Clientes
    enabled: true // Activada solo para DB aunque esté desactivada globalmente
  }
];

