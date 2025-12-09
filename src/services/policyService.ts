import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, writeBatch, collection, getDocs } from "firebase/firestore";
import { PolicyConfiguration } from "@/types";

export interface PolicyCheckResult {
    allowed: boolean;
    policyId: string;
    timestamp: string;
    error?: string;
}

/**
 * Verifica si una política de seguridad está habilitada para un equipo específico
 * LÓGICA:
 * 1. Si la política GLOBAL es TRUE (Habilitada/Bloqueo Activo) -> APLICA PARA TODOS (No hay excepciones)
 * 2. Si la política GLOBAL es FALSE (Deshabilitada/Bloqueo Inactivo) -> Verificar configuración específica del equipo
 */
export async function checkPolicy(policyId: string, equipmentId?: string): Promise<PolicyCheckResult> {
    try {
        // LÓGICA CORREGIDA: PRIORIDAD ESPECÍFICA > GLOBAL
        // 1. Verificar configuración específica del equipo PRIMERO
        if (equipmentId) {
            console.log(`[CHECK POLICY] Verificando equipo ${equipmentId}...`);
            try {
                const equipmentRef = doc(db, "policies", policyId, "equipments", equipmentId);
                const equipmentSnap = await getDoc(equipmentRef);

                if (equipmentSnap.exists()) {
                    const specificState = equipmentSnap.data().enabled === true;
                    console.log(`[CHECK POLICY] 🎯 Encontrada excepción para ${equipmentId}: ${specificState ? 'BLOQUEADO' : 'PERMITIDO'} (Ignorando Global)`);
                    return {
                        allowed: !specificState,
                        policyId,
                        timestamp: new Date().toISOString()
                    };
                } else {
                    console.log(`[CHECK POLICY] ⚠️ No hay configuración específica para ${equipmentId}. Buscando global...`);
                }
            } catch (error) {
                console.warn(`[CHECK POLICY] Error leyendo equipo ${equipmentId}, saltando a global`);
            }
        }

        // 2. Si no hay específica, usar Global
        const policyRef = doc(db, "policies", policyId);
        const policySnap = await getDoc(policyRef);

        let globalState = false;
        if (policySnap.exists()) {
            globalState = policySnap.data().habilitada === true;
            console.log(`[CHECK POLICY] 🌎 Usando estado Global: ${globalState ? 'ACTIVADA (BLOQUEO)' : 'DESACTIVADA'}`);
        } else {
            console.log(`[CHECK POLICY] Global no existe. Default: False`);
        }

        return {
            allowed: !globalState,
            policyId,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error al verificar política:", error);
        return {
            allowed: true, // Fail open if error
            policyId,
            timestamp: new Date().toISOString(),
            error: "Error al conectar con Firebase"
        };
    }
}

/**
 * Obtiene el estado de una política para un equipo específico
 * Considera la nueva lógica de prioridad de excepciones
 */
export async function getPolicyStateForEquipment(
    policyId: string,
    equipmentId: string
): Promise<boolean> {
    try {
        // LÓGICA CORREGIDA: PRIORIDAD ESPECÍFICA > GLOBAL
        // 1. Verificar configuración específica del equipo PRIMERO
        const equipmentRef = doc(db, "policies", policyId, "equipments", equipmentId);
        const equipmentSnap = await getDoc(equipmentRef);

        if (equipmentSnap.exists()) {
            return equipmentSnap.data().enabled === true;
        }

        // 2. Si no hay excepción, usar estado GLOBAL
        const policyRef = doc(db, "policies", policyId);
        const policySnap = await getDoc(policyRef);

        if (policySnap.exists()) {
            return policySnap.data().habilitada === true;
        }

        return false;

    } catch (error) {
        console.error("Error getting policy state for equipment:", error);
        // Fallback safe assumption: Check global only if specific fails hard
        return await getPolicyState(policyId);
    }
}

/**
 * Obtiene todas las configuraciones de políticas por equipo desde Firebase
 * Ahora usando subcolecciones: policies/{policyId}/equipments/{equipmentId}
 */
export async function getAllPolicyConfigurations(): Promise<PolicyConfiguration[]> {
    try {
        const configurations: PolicyConfiguration[] = [];

        // Obtener todas las políticas
        const policiesRef = collection(db, "policies");
        const policiesSnapshot = await getDocs(policiesRef);

        // Para cada política, obtener sus configuraciones por equipo
        for (const policyDoc of policiesSnapshot.docs) {
            const equipmentsRef = collection(db, "policies", policyDoc.id, "equipments");
            const equipmentsSnapshot = await getDocs(equipmentsRef);

            equipmentsSnapshot.forEach(equipDoc => {
                const data = equipDoc.data();
                configurations.push({
                    policyId: policyDoc.id,
                    equipmentId: equipDoc.id,
                    enabled: data.enabled
                });
            });
        }

        return configurations;
    } catch (error) {
        console.error("Error loading policy configurations:", error);
        return [];
    }
}

/**
 * Actualiza el estado de una política de seguridad
 */
export async function updatePolicy(policyId: string, enabled: boolean): Promise<void> {
    try {
        const policyRef = doc(db, "policies", policyId);
        await setDoc(policyRef, { habilitada: enabled }, { merge: true });
    } catch (error) {
        console.error("Error al actualizar política:", error);
        throw error;
    }
}

/**
 * Obtiene el estado actual (habilitada/deshabilitada) de una política
 */
export async function getPolicyState(policyId: string): Promise<boolean> {
    try {
        const policyRef = doc(db, "policies", policyId);
        const policySnap = await getDoc(policyRef);

        if (policySnap.exists()) {
            return policySnap.data().habilitada === true;
        }
        return false;
    } catch (error) {
        console.error("Error getting policy state:", error);
        return false;
    }
}

/**
 * Guarda múltiples cambios de políticas en batch
 * Ahora usando subcolecciones para las configuraciones por equipo
 */
export async function savePolicyChanges(
    globalChanges: { policyId: string; enabled: boolean }[],
    equipmentChanges: PolicyConfiguration[]
): Promise<void> {
    try {
        const batch = writeBatch(db);

        // Aplicar cambios globales
        globalChanges.forEach(change => {
            const policyRef = doc(db, "policies", change.policyId);
            batch.set(policyRef, { habilitada: change.enabled }, { merge: true });
        });

        // Aplicar cambios por equipo en subcolecciones
        equipmentChanges.forEach(config => {
            const equipmentRef = doc(db, "policies", config.policyId, "equipments", config.equipmentId);
            batch.set(equipmentRef, {
                enabled: config.enabled
            }, { merge: true });
        });

        await batch.commit();
        console.log("Cambios de políticas guardados exitosamente en Firebase");
    } catch (error) {
        console.error("Error al guardar cambios de políticas:", error);
        throw error;
    }
}
