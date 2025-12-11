import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Hardcoded password check as requested for the prototype
        if (password === "3Mp10.tst3") {
            await login(username || "admin"); // Default to 'admin' if no username provided
            toast({
                title: "Bienvenido",
                description: "Acceso autorizado al sistema de seguridad.",
            });
            navigate("/dashboard");
        } else {
            toast({
                title: "Acceso Denegado",
                description: "Credenciales incorrectas. Intente nuevamente.",
                variant: "destructive",
            });
            setPassword("");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-primary/20 shadow-2xl">
                <CardHeader className="space-y-1 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Secure Pyme</CardTitle>
                    <CardDescription>
                        Sistema de Gestión de Ciberseguridad
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                placeholder="ej. admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10"
                                />
                                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading || !password}>
                            {loading ? "Verificando..." : "Iniciar Sesión"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
