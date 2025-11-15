// authContext.tsx
import { createContext, useContext, ReactNode, useState } from "react";
import { fa } from "zod/v4/locales";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, setIsAdmin, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
