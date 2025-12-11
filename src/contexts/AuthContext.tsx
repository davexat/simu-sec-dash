import React, { createContext, useContext, useState } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string): Promise<boolean> => {
    // Simulating login - just creating a user simulated object
    // Authorization is checked in the Login component (password check)
    const newUser: User = {
      id: username, // Using username as ID for isolation
      nombre: username,
      email: `${username}@empresa.com`,
      rol: "Administrador" as UserRole
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    window.location.href = "/"; // Force full reload/redirect
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
