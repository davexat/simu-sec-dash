import { useState } from "react";
import styles from "@/styles/desktop.module.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Loader2, ShieldAlert, CheckCircle, User, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkPolicy } from "@/services/policyService";
import { cn } from "@/lib/utils";
import { SIMULATED_EQUIPMENT_ID, mockEquipment } from "@/data/mockData";
import { useData } from "@/contexts/DataProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function DesktopSimulator() {
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState<"none" | "blocked" | "success">("none");
    const { toast } = useToast();
    const { addSimulatedAlert } = useData();
    const { user, login } = useAuth();

    // Login State
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    // Obtener el equipo simulado
    const simulatedEquipment = mockEquipment.find(e => e.id === SIMULATED_EQUIPMENT_ID);

    const handleSimulatorLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginUsername.trim()) {
            toast({
                title: "Error",
                description: "Debe ingresar un nombre de usuario",
                variant: "destructive"
            });
            return;
        }
        setLoginLoading(true);
        // Reuse the same hardcoded password
        if (loginPassword === "3Mp10.tst3") {
            await login(loginUsername.trim()); // Login with custom username
            setLoginUsername("");
            setLoginPassword("");
        } else {
            toast({
                title: "Error de acceso",
                description: "Contraseña incorrecta",
                variant: "destructive"
            });
        }
        setLoginLoading(false);
    };

    const handleInstallClick = async () => {
        setLoading(true);
        try {
            // Verificar la política POL-004 (Limitar instalaciones) para este equipo específico
            const result = await checkPolicy("POL-004", SIMULATED_EQUIPMENT_ID);

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
                // Trigger the alert in the system
                await addSimulatedAlert(
                    "install_blocked",
                    "Intento de instalación de software no autorizado bloqueado por política.",
                    "Media"
                );

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

    if (!user) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-50 blur-sm"></div>
                <div className="z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-xl text-white text-center shadow-2xl border border-white/10">
                    <div className="mb-6 flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                            <User className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{simulatedEquipment?.usuario || "Usuario"}</h2>
                    <p className="text-white/60 mb-8">Esta sesión está bloqueada</p>

                    <form onSubmit={handleSimulatorLogin} className="space-y-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Nombre de usuario"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 pl-4 pr-10"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                            />
                            <User className="absolute right-3 top-3 h-5 w-5 text-white/40" />
                        </div>
                        <div className="relative">
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 pl-4 pr-10"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                            <Lock className="absolute right-3 top-3 h-5 w-5 text-white/40" />
                        </div>
                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium" disabled={loginLoading}>
                            {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Iniciar Sesión"}
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

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
                    {/* Fake files for realism */}
                    <div className={styles.desktopIcon}>
                        <div className={styles.iconWrapper}>
                            <div className="h-10 w-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">DOC</div>
                        </div>
                        <span className={styles.iconLabel}>Reporte.docx</span>
                    </div>
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
                    <div className={styles.userInfo}>
                        <User className="h-4 w-4" />
                        <span>{user?.nombre || simulatedEquipment?.usuario}</span>
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
