import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTutorial } from '@/contexts/TutorialContext';
import { useAuth } from '@/contexts/AuthContext';

const PAGE_NAME_MAP: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/equipos': 'equipos',
    '/alertas': 'alertas',
    '/historial': 'historial',
    '/respaldos': 'respaldos',
    '/politicas': 'politicas',
    '/analisis': 'analisis',
    '/reportes': 'reportes',
};

export function useTutorialAutoStart() {
    const location = useLocation();
    const { startTutorial, isActive, showWelcome, completedPages, wantsTutorial } = useTutorial();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Only start tutorial if user is authenticated
        if (!isAuthenticated) return;

        // Don't show tutorial on simulation page
        if (location.pathname === '/simulacion') return;

        // Don't auto-start if welcome dialog is showing (let user choose)
        if (showWelcome) return;

        // Only auto-start if user wants tutorials (accepted welcome dialog)
        if (!wantsTutorial) return;

        const pageName = PAGE_NAME_MAP[location.pathname];

        console.log('[AutoStart] Checking:', {
            pageName,
            isActive,
            isCompleted: pageName ? completedPages.has(pageName) : false,
            completedSet: Array.from(completedPages)
        });

        // Don't auto-start if already completed in this session
        if (pageName && completedPages.has(pageName)) {
            console.log('[AutoStart] Skipped - Already completed');
            return;
        }

        if (pageName && !isActive) {
            console.log('[AutoStart] Starting tutorial for', pageName);
            // Small delay to ensure page is fully rendered
            const timer = setTimeout(() => {
                startTutorial(pageName);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [location.pathname, startTutorial, isActive, isAuthenticated, showWelcome, wantsTutorial, completedPages]);
}
