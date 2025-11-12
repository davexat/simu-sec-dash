export type SecurityStatus = "Seguro" | "Advertencia" | "Amenaza" | "Desconectado";
export type AgentConnectionStatus = "Conectado" | "Desconectado" | "En sincronización";
export type AlertLevel = "Baja" | "Media" | "Alta";
export type IncidentStatus = "Resuelto" | "Mitigado" | "En investigación";
export type UserRole = "Administrador" | "Operativo";
export type Plan = "Básico" | "Estándar" | "Ejecutivo";

export interface Equipment {
  id: string;
  nombre: string;
  usuario: string;
  OS: string;
  ultimo_respaldo: string;
  estado_seguridad: SecurityStatus;
  version_agente: string;
  estado_conexion_agente: AgentConnectionStatus;
  ubicacion: string;
  plan: Plan;
}

export interface Alert {
  id: string;
  nivel: AlertLevel;
  fecha: string;
  equipo_id: string;
  equipo_nombre: string;
  descripcion: string;
  recomendacion: string;
  estado: "Activa" | "Resuelta";
}

export interface Incident {
  id: string;
  fecha: string;
  equipo_id: string;
  equipo_nombre: string;
  tipo: string;
  descripcion: string;
  acciones: string[];
  estado: IncidentStatus;
}

export interface Backup {
  id: string;
  equipo_id: string;
  equipo_nombre: string;
  fecha: string;
  tamaño: string;
  integridad: "Verificado" | "Pendiente" | "Error";
}

export interface SecurityPolicy {
  id: string;
  nombre: string;
  descripcion: string;
  habilitada: boolean;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
}
