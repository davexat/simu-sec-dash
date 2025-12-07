import { useState } from "react";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
import styles from "@/styles/desktop.module.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gamepad2, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkPolicy } from "@/services/policyService";
import { cn } from "@/lib/utils";

export default function DesktopSimulator() {
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState<"none" | "blocked" | "success">("none");
    const { toast } = useToast();

    const handleInstallClick = async () => {
        setLoading(true);
        try {
            // Verificar la política POL-004 (Limitar instalaciones)
            const result = await checkPolicy("POL-004");

            // Simular un pequeño delay para realismo
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (result.allowed) {
                setModalState("success");
                toast({
                    title: "Instalación permitida",
                    description: "La política permite la instalación de software.",
                });
            } else {
                setModalState("blocked");
                toast({
                    title: "Instalación bloqueada",
                    description: "El agente de seguridad impidió la ejecución.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error checking policy", error);
            toast({
                title: "Error de conexión",
                description: "No se pudo contactar con el servidor de políticas.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setModalState("none");

    return (
        <div className="w-full h-screen overflow-hidden">

            <div className={styles.desktop}>
                {/* Desktop Icons */}
                <div className={styles.iconGrid}>
                    <button
                        className={styles.desktopIcon}
                        onClick={handleInstallClick}
                        disabled={loading}
                    >
                        <div className={styles.iconWrapper}>
                            {loading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                            ) : (
                                <Gamepad2 className="h-10 w-10 text-white" />
                            )}
                        </div>
                        <span className={styles.iconLabel}>Instalador_Juego.exe</span>
                    </button>
                </div>

                {/* Taskbar */}
                <div className={styles.taskbar}>
                    <div className={styles.startBtn}>
                        <div className={styles.windowsIcon}>
                            <div className={styles.windowsIconSquare}></div>
                            <div className={styles.windowsIconSquare}></div>
                            <div className={styles.windowsIconSquare}></div>
                            <div className={styles.windowsIconSquare}></div>
                        </div>
                    </div>
                    <div className={styles.clock}>
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                </div>

                {/* Modal de Amenaza Bloqueada */}
                <Dialog open={modalState === "blocked"} onOpenChange={closeModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-destructive">Amenaza Detectada</DialogTitle>
                            <DialogDescription>
                                Se ha bloqueado la ejecución de este programa
                            </DialogDescription>
                        </DialogHeader>
                        <div className={styles.modalContent}>
                            <ShieldAlert className="h-16 w-16 text-destructive" />
                            <div className={styles.modalText}>
                                <p className={cn(styles.modalTitle, "text-destructive")}>Acceso Denegado</p>
                                <p className={styles.modalDescription}>
                                    La política de seguridad de la organización impide la instalación de software no autorizado.
                                    Este incidente ha sido reportado al administrador.
                                </p>
                            </div>
                            <Button variant="destructive" className={styles.modalButton} onClick={closeModal}>
                                Entendido
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal de Instalación Permitida */}
                <Dialog open={modalState === "success"} onOpenChange={closeModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-green-600">Instalación Iniciada</DialogTitle>
                            <DialogDescription>
                                El software ha sido verificado y es seguro
                            </DialogDescription>
                        </DialogHeader>
                        <div className={styles.modalContent}>
                            <CheckCircle className="h-16 w-16 text-green-600" />
                            <div className={styles.modalText}>
                                <p className={cn(styles.modalTitle, "text-green-600")}>Verificado</p>
                                <p className={styles.modalDescription}>
                                    El instalador ha sido analizado y es seguro.
                                    La instalación continuará en breve.
                                </p>
                            </div>
                            <Button variant="default" className={styles.modalButton} onClick={closeModal}>
                                Aceptar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
