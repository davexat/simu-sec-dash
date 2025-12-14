import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, Equipment, Incident, Backup } from "@/types";
import { mockAlerts, mockEquipment, mockIncidents, mockBackups, SIMULATED_EQUIPMENT_ID } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { getPolicyState } from "@/services/policyService";

interface DataContextType {
    alerts: Alert[];
    equipment: Equipment[];
    resolvedAlerts: Alert[];
    incidents: Incident[]; // New
    backups: Backup[]; // New
    isolatedEquipment: string[]; // New
    addSimulatedAlert: (type: string, description: string, level: "Alta" | "Media" | "Baja", recommendation?: string) => Promise<void>;
    addIncident: (incident: Incident) => void; // New
    addBackup: (backup: Backup) => void; // New
    isolateEquipment: (equipmentId: string) => void; // New
    isEquipmentIsolated: (equipmentId: string) => boolean; // New
    syncEquipment: (equipmentId: string) => Promise<void>; // New
    calculateRiskLevel: () => { level: 'BAJO' | 'MEDIO' | 'ALTO'; percentage: number; color: string }; // New
    canResolveAlert: (alert: Alert) => boolean; // New
    checkPolicyEnabled: (policyId: string) => boolean; // New
    resolveAlert: (id: string, falsePositive?: boolean) => Promise<void>;
    requestHelp: (alert: Alert) => void;
    getEquipmentStatus: (id: string) => "Seguro" | "Advertencia" | "Amenaza" | "Desconectado";
}


const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { toast } = useToast();

    // Alertas estáticas (se resetean al recargar)
    const [staticAlerts, setStaticAlerts] = useState<Alert[]>(mockAlerts);

    // Alertas dinámicas (desde Firebase)
    const [dynamicAlerts, setDynamicAlerts] = useState<Alert[]>([]);

    // Alertas resueltas (se resetean al recargar)
    const [resolvedAlerts, setResolvedAlerts] = useState<Alert[]>([]);

    // IDs de alertas estáticas resueltas
    const [resolvedStaticIds, setResolvedStaticIds] = useState<string[]>([]);

    // Historial de Incidentes y Respaldos
    const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
    const [backups, setBackups] = useState<Backup[]>(mockBackups);
    const [isolatedEquipment, setIsolatedEquipment] = useState<string[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
    const [policyStates, setPolicyStates] = useState<Record<string, boolean>>({});

    // Load policy states
    useEffect(() => {
        const loadPolicyStates = async () => {
            const pol003State = await getPolicyState('POL-003');
            setPolicyStates({ 'POL-003': pol003State });
        };
        loadPolicyStates();

        // Poll every 2 seconds to check for policy changes
        const interval = setInterval(loadPolicyStates, 2000);
        return () => clearInterval(interval);
    }, []);

    // Helper functions - must be defined before activeAlerts
    const checkPolicyEnabled = (policyId: string): boolean => {
        return policyStates[policyId] || false;
    };

    const createPrerequisitesForAlert = (type: string, equipmentId: string) => {
        const prerequisites = [];

        if (type === 'data_exfiltration') {
            prerequisites.push({
                id: 'activate-pol-003',
                description: 'Activar política POL-003 (Restricción de conexiones externas)',
                type: 'policy' as const,
                targetId: 'POL-003',
                checkCompleted: () => checkPolicyEnabled('POL-003')
            });
            prerequisites.push({
                id: 'isolate-equipment',
                description: `Aislar equipo ${equipmentId}`,
                type: 'isolation' as const,
                targetId: equipmentId,
                checkCompleted: () => isolatedEquipment.includes(equipmentId)
            });
        } else if (type === 'agent_outdated') {
            prerequisites.push({
                id: 'sync-agent',
                description: 'Sincronizar agente a versión 1.2.3',
                type: 'sync' as const,
                targetId: equipmentId,
                checkCompleted: () => {
                    const eq = equipment.find(e => e.id === equipmentId);
                    return eq?.version_agente === '1.2.3' && eq?.estado_conexion_agente === 'Conectado';
                }
            });
        }

        return prerequisites;
    };

    // Combinar alertas activas (estáticas no resueltas + dinámicas activas)
    // Recalcular prerequisites dinámicamente para que se actualicen con el estado
    const activeAlerts = [
        ...staticAlerts.filter(a => !resolvedStaticIds.includes(a.id)),
        ...dynamicAlerts
    ].map(alert => {
        // Solo agregar prerequisites si hay un tipo definido
        if (alert.type && (alert.type === 'data_exfiltration' || alert.type === 'agent_outdated')) {
            return {
                ...alert,
                prerequisites: createPrerequisitesForAlert(alert.type, alert.equipo_id)
            };
        }
        return alert;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    // Listener de Firebase para alertas del usuario actual
    useEffect(() => {
        if (!user) {
            setDynamicAlerts([]);
            return;
        }

        const q = query(
            collection(db, "alerts"),
            where("userId", "==", user.id),
            where("status", "==", "active")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alerts: Alert[] = snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                const alertType = data.type || '';
                return {
                    id: docSnap.id,
                    nivel: data.level as "Alta" | "Media" | "Baja",
                    fecha: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
                    equipo_id: data.equipmentId,
                    equipo_nombre: data.equipmentName,
                    descripcion: data.description,
                    recomendacion: data.recommendation,
                    estado: "Activa",
                    type: alertType
                };
            });
            setDynamicAlerts(alerts);
        });

        return () => unsubscribe();
    }, [user]);

    // Agregar alerta dinámica (desde simulador)
    const addSimulatedAlert = async (type: string, description: string, level: "Alta" | "Media" | "Baja", recommendation?: string) => {
        if (!user) {
            toast({
                title: "Error",
                description: "Debe iniciar sesión para generar alertas",
                variant: "destructive"
            });
            return;
        }

        try {
            await addDoc(collection(db, "alerts"), {
                userId: user.id,
                type,
                level,
                description,
                equipmentId: SIMULATED_EQUIPMENT_ID,
                equipmentName: "POS-Tienda1",
                timestamp: new Date(),
                status: "active",
                recommendation: recommendation || "Verificar actividad en el equipo simulado."
            });

            toast({
                title: "Incidente Registrado",
                description: "Se ha enviado una alerta al panel de administración.",
                variant: "destructive"
            });
        } catch (error) {
            console.error("Error adding alert:", error);
            toast({
                title: "Error",
                description: "No se pudo registrar la alerta en la base de datos.",
                variant: "destructive"
            });
        }
    };

    // Resolver alerta
    const resolveAlert = async (id: string, falsePositive: boolean = false) => {
        // Buscar si es dinámica o estática
        const dynamicAlert = dynamicAlerts.find(a => a.id === id);
        const staticAlert = staticAlerts.find(a => a.id === id);

        if (dynamicAlert) {
            // Es una alerta dinámica de Firebase
            try {
                const alertRef = doc(db, "alerts", id);
                await updateDoc(alertRef, {
                    status: falsePositive ? "false_positive" : "resolved"
                });

                // Agregar a resueltas
                setResolvedAlerts(prev => [...prev, {
                    ...dynamicAlert,
                    estado: falsePositive ? "Falso Positivo" : "Resuelta"
                }]);

                // Crear Incidente de resolución
                const incident: Incident = {
                    id: `INC-${Math.floor(100 + Math.random() * 900)}`, // Standard short format
                    fecha: new Date().toISOString(),
                    equipo_id: dynamicAlert.equipo_id,
                    equipo_nombre: dynamicAlert.equipo_nombre,
                    tipo: dynamicAlert.nivel === "Alta" ? "Amenaza Crítica" : "Alerta de Seguridad",
                    descripcion: dynamicAlert.descripcion,
                    acciones: ["Marcada como resuelta", falsePositive ? "Falso positivo confirmado" : "Mitigación aplicada"],
                    estado: "Resuelto"
                };
                addIncident(incident);

                toast({
                    title: falsePositive ? "Marcado como Falso Positivo" : "Alerta Resuelta",
                    description: "Estado actualizado en base de datos."
                });
            } catch (error) {
                console.error("Error resolving alert:", error);
                toast({
                    title: "Error",
                    description: "No se pudo actualizar la alerta.",
                    variant: "destructive"
                });
            }
        } else if (staticAlert) {
            // Es una alerta estática
            setResolvedStaticIds(prev => [...prev, id]);
            setResolvedAlerts(prev => [...prev, {
                ...staticAlert,
                estado: falsePositive ? "Falso Positivo" : "Resuelta"
            }]);

            // Crear Incidente de resolución
            const incident: Incident = {
                id: `INC-${Math.floor(100 + Math.random() * 900)}`, // Standard short format
                fecha: new Date().toISOString(),
                equipo_id: staticAlert.equipo_id,
                equipo_nombre: staticAlert.equipo_nombre,
                tipo: staticAlert.nivel === "Alta" ? "Amenaza Crítica" : "Alerta de Seguridad",
                descripcion: staticAlert.descripcion,
                acciones: ["Marcada como resuelta", falsePositive ? "Falso positivo confirmado" : "Mitigación aplicada"],
                estado: "Resuelto"
            };
            addIncident(incident);

            toast({
                title: "Alerta Resuelta",
                description: "La alerta ha sido archivada (se restaurará al recargar)."
            });
        }
    };

    // Solicitar ayuda
    const requestHelp = (alert: Alert) => {
        toast({
            title: "Ayuda Solicitada",
            description: `Técnico notificado para alerta ${alert.id}.`
        });
    };

    // Calcular estado de equipo basado en alertas activas
    const getEquipmentStatus = (equipmentId: string): "Seguro" | "Advertencia" | "Amenaza" | "Desconectado" => {
        const original = mockEquipment.find(e => e.id === equipmentId);
        if (original?.estado_seguridad === "Desconectado") return "Desconectado";

        const equipmentAlerts = activeAlerts.filter(a => a.equipo_id === equipmentId);

        if (equipmentAlerts.some(a => a.nivel === "Alta")) return "Amenaza";
        if (equipmentAlerts.some(a => a.nivel === "Media")) return "Advertencia";
        if (equipmentAlerts.length === 0) return "Seguro";

        return "Seguro";
    };

    // Equipos con estado dinámico
    const equipmentWithStatus = equipment.map(eq => ({
        ...eq,
        estado_seguridad: getEquipmentStatus(eq.id)
    }));

    const addIncident = (incident: Incident) => {
        setIncidents(prev => [incident, ...prev]);
        toast({
            title: "Incidente Registrado",
            description: `Nuevo incidente: ${incident.tipo}`,
        });
    };

    const addBackup = (backup: Backup) => {
        setBackups(prev => [backup, ...prev]);
        // Also add logic to add an incident or log entry if desired, 
        // but user asked for "backups registered in history".
        // So we can auto-add a history entry when a backup is done.
        const backupIncident: Incident = {
            id: `INC-BKP-${Math.floor(100 + Math.random() * 900)}`,
            fecha: new Date().toISOString(),
            equipo_id: backup.equipo_id,
            equipo_nombre: backup.equipo_nombre,
            tipo: "Respaldo Realizado",
            descripcion: `Respaldo manual completado. Tamaño: ${backup.tamaño}`,
            acciones: ["Respaldo guardado", "Verificación integridad"],
            estado: "Resuelto"
        };
        addIncident(backupIncident);
    };

    const isolateEquipment = (equipmentId: string) => {
        if (!isolatedEquipment.includes(equipmentId)) {
            setIsolatedEquipment(prev => [...prev, equipmentId]);
            toast({
                title: "Equipo Aislado",
                description: "El equipo ha sido aislado de la red exitosamente.",
            });
        }
    };

    const isEquipmentIsolated = (equipmentId: string): boolean => {
        return isolatedEquipment.includes(equipmentId);
    };

    // Check if alert can be resolved (all prerequisites met)
    const canResolveAlert = (alert: Alert): boolean => {
        if (!alert.prerequisites || alert.prerequisites.length === 0) {
            return true; // No prerequisites, can resolve
        }
        return alert.prerequisites.every(p => p.checkCompleted());
    };

    const syncEquipment = async (equipmentId: string) => {
        const eq = equipment.find(e => e.id === equipmentId);
        if (!eq) return;

        // Update equipment state
        setEquipment(prev => prev.map(e =>
            e.id === equipmentId
                ? { ...e, version_agente: "1.2.3", estado_conexion_agente: "Conectado" as const }
                : e
        ));

        // Create incident
        const syncIncident: Incident = {
            id: `INC-SYNC-${Math.floor(100 + Math.random() * 900)}`,
            fecha: new Date().toISOString(),
            equipo_id: equipmentId,
            equipo_nombre: eq.nombre,
            tipo: "Sincronización de Agente",
            descripcion: `Agente sincronizado exitosamente. Versión actualizada a 1.2.3.`,
            acciones: ["Sincronización completada", "Versión actualizada"],
            estado: "Resuelto"
        };
        addIncident(syncIncident);

        toast({
            title: "Sincronización Completada",
            description: `${eq.nombre} sincronizado exitosamente a v1.2.3`,
        });
    };

    const calculateRiskLevel = (): { level: 'BAJO' | 'MEDIO' | 'ALTO'; percentage: number; color: string } => {
        const highAlerts = activeAlerts.filter(a => a.nivel === 'Alta').length;
        const mediumAlerts = activeAlerts.filter(a => a.nivel === 'Media').length;
        const isolatedCount = isolatedEquipment.length;
        const unresolvedIncidents = incidents.filter(i => i.estado !== 'Resuelto').length;

        let riskScore = 0;
        riskScore += highAlerts * 30;
        riskScore += mediumAlerts * 15;
        riskScore += isolatedCount * 20;
        riskScore += unresolvedIncidents * 10;

        const percentage = Math.min(100, riskScore);

        if (percentage >= 70) return { level: 'ALTO', percentage, color: 'destructive' };
        if (percentage >= 40) return { level: 'MEDIO', percentage, color: 'warning' };
        return { level: 'BAJO', percentage, color: 'success' };
    };

    return (
        <DataContext.Provider value={{
            alerts: activeAlerts,
            equipment: equipmentWithStatus,
            resolvedAlerts,
            incidents,
            backups,
            isolatedEquipment,
            addSimulatedAlert,
            addIncident,
            addBackup,
            isolateEquipment,
            isEquipmentIsolated,
            syncEquipment,
            calculateRiskLevel,
            canResolveAlert,
            checkPolicyEnabled,
            resolveAlert,
            requestHelp,
            getEquipmentStatus
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within DataProvider");
    return context;
};
