import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface PolicyCheckResult {
    allowed: boolean;
    policyId: string;
    timestamp: string;
    error?: string;
}

/**
 * Verifica si una política de seguridad está habilitada en Firebase
 * @param policyId - ID de la política a verificar (ej: "POL-004")
 * @returns Resultado indicando si la acción está permitida
 */
export async function checkPolicy(policyId: string): Promise<PolicyCheckResult> {
    try {
        const policyRef = doc(db, "policies", policyId);
        const policySnap = await getDoc(policyRef);

        let isBlocked = false;

        if (policySnap.exists()) {
            const data = policySnap.data();
            // Si la política está habilitada (enabled: true), entonces bloquea
            isBlocked = data.habilitada === true;
        } else {
            // Si la política no existe, por defecto permitimos (fail-open para demo)
            // En producción, podrías querer fail-closed (bloquear por defecto)
            console.warn(`Política ${policyId} no encontrada en Firebase, permitiendo por defecto`);
            isBlocked = false;
        }

        return {
            allowed: !isBlocked,
            policyId,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error al verificar política:", error);

        // En caso de error, fail-open (permitir) para no bloquear la demostración
        // En producción considerar fail-closed (bloquear) por seguridad
        return {
            allowed: true,
            policyId,
            timestamp: new Date().toISOString(),
            error: "Error al conectar con Firebase, permitiendo por defecto"
        };
    }
}

/**
 * Actualiza el estado de una política de seguridad
 * @param policyId - ID de la política
 * @param enabled - Si la política debe estar habilitada
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
 * @param policyId - ID de la política
 */
export async function getPolicyState(policyId: string): Promise<boolean> {
    try {
        const policyRef = doc(db, "policies", policyId);
        const policySnap = await getDoc(policyRef);

        if (policySnap.exists()) {
            return policySnap.data().habilitada === true;
        }
        return false; // Default if not found
    } catch (error) {
        console.error("Error getting policy state:", error);
        return false;
    }
}
