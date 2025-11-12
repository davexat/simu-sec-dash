import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Equipos from "./pages/Equipos";
import Alertas from "./pages/Alertas";
import Historial from "./pages/Historial";
import Respaldos from "./pages/Respaldos";
import Politicas from "./pages/Politicas";
import Analisis from "./pages/Analisis";
import Reportes from "./pages/Reportes";
import Planes from "./pages/Planes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/equipos" element={<ProtectedRoute><Equipos /></ProtectedRoute>} />
            <Route path="/alertas" element={<ProtectedRoute><Alertas /></ProtectedRoute>} />
            <Route path="/historial" element={<ProtectedRoute><Historial /></ProtectedRoute>} />
            <Route path="/respaldos" element={<ProtectedRoute><Respaldos /></ProtectedRoute>} />
            <Route path="/politicas" element={<ProtectedRoute><Politicas /></ProtectedRoute>} />
            <Route path="/analisis" element={<ProtectedRoute><Analisis /></ProtectedRoute>} />
            <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
            <Route path="/planes" element={<ProtectedRoute><Planes /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
