import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = {
  "admin@empresa.com": { id: "1", nombre: "Administrador Sistema", email: "admin@empresa.com", rol: "Administrador" as UserRole },
  "operativo@empresa.com": { id: "2", nombre: "Usuario Operativo", email: "operativo@empresa.com", rol: "Operativo" as UserRole }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auto-login as Admin
    setUser(mockUsers["admin@empresa.com"]);
  }, []);

  const login = async (): Promise<boolean> => {
    return true;
  };

  const logout = () => {
    // No-op or reload to reset state if needed, but effectively we stay logged in
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
