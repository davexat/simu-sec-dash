import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, Equipment } from "@/types";
import { mockAlerts, mockEquipment, SIMULATED_EQUIPMENT_ID } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
    alerts: Alert[];
    equipment: Equipment[];
    resolvedAlerts: Alert[];
    addSimulatedAlert: (type: string, description: string, level: "Alta" | "Media" | "Baja") => Promise<void>;
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

    // Combinar alertas activas (estáticas no resueltas + dinámicas activas)
    const activeAlerts = [
        ...staticAlerts.filter(a => !resolvedStaticIds.includes(a.id)),
        ...dynamicAlerts
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

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
                return {
                    id: docSnap.id,
                    nivel: data.level as "Alta" | "Media" | "Baja",
                    fecha: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
                    equipo_id: data.equipmentId,
                    equipo_nombre: data.equipmentName,
                    descripcion: data.description,
                    recomendacion: data.recommendation,
                    estado: "Activa"
                };
            });
            setDynamicAlerts(alerts);
        });

        return () => unsubscribe();
    }, [user]);

    // Agregar alerta dinámica (desde simulador)
    const addSimulatedAlert = async (type: string, description: string, level: "Alta" | "Media" | "Baja") => {
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
                recommendation: "Verificar actividad en el equipo simulado."
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
    const equipmentWithStatus = mockEquipment.map(eq => ({
        ...eq,
        estado_seguridad: getEquipmentStatus(eq.id)
    }));

    return (
        <DataContext.Provider value={{
            alerts: activeAlerts,
            equipment: equipmentWithStatus,
            resolvedAlerts,
            addSimulatedAlert,
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
