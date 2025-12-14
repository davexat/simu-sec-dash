import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useTutorial } from "@/contexts/TutorialContext";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { startTutorial } = useTutorial();
  const location = useLocation();

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

  const handleRestartTutorial = () => {
    const pageName = PAGE_NAME_MAP[location.pathname];
    if (pageName) {
      startTutorial(pageName);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar data-tutorial="navigation" />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Conexión cifrada</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Protección activa</span>
            </div>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRestartTutorial}
                className="gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Tutorial
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
