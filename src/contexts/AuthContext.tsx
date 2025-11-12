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
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers[email as keyof typeof mockUsers];
    if (foundUser && password === "demo123") {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
