import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
// import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Alertas from "./pages/Alertas";
import Historial from "./pages/Historial";
import Respaldos from "./pages/Respaldos";
import Politicas from "./pages/Politicas";
import Analisis from "./pages/Analisis";
import Reportes from "./pages/Reportes";
import DesktopSimulator from "./pages/DesktopSimulator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/respaldos" element={<Respaldos />} />
            <Route path="/politicas" element={<Politicas />} />
            <Route path="/analisis" element={<Analisis />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/simulacion" element={<DesktopSimulator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
