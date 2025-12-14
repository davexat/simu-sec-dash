import { useTutorial } from '@/contexts/TutorialContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GraduationCap, X } from 'lucide-react';

const WELCOME_KEY = 'securepyme_tutorial_welcome_shown';

export function TutorialWelcome() {
    const { showWelcome, setShowWelcome, startTutorial, setWantsTutorial } = useTutorial();
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Don't show on login or simulation pages
    const shouldShow = showWelcome && isAuthenticated &&
        location.pathname !== '/login' &&
        location.pathname !== '/simulacion';

    const handleStart = () => {
        setWantsTutorial(true);  // User wants tutorials on all pages
        setShowWelcome(false);
        startTutorial('dashboard');
    };

    const handleSkip = () => {
        setWantsTutorial(false);  // User doesn't want tutorials
        setShowWelcome(false);
    };

    return (
        <Dialog open={shouldShow} onOpenChange={setShowWelcome}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">¡Bienvenido a SecurePYME!</DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Sistema de Gestión de Seguridad
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        ¿Es tu primera vez usando SecurePYME?
                    </p>
                    <p className="text-sm">
                        Podemos mostrarte un tutorial interactivo que te guiará por las principales
                        funcionalidades del sistema. Solo tomará unos minutos.
                    </p>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium">El tutorial incluye:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Navegación por el dashboard</li>
                            <li>• Gestión de equipos y alertas</li>
                            <li>• Políticas de seguridad</li>
                            <li>• Análisis y reportes</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="w-full sm:w-auto"
                    >
                        <X className="h-4 w-4 mr-2" />
                        No, omitir
                    </Button>
                    <Button
                        onClick={handleStart}
                        className="w-full sm:w-auto"
                    >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Sí, mostrar tutorial
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
