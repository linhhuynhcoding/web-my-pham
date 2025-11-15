// PrivateRoute.tsx
import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { decodeToken, getAccessTokenFromLocalStorage } from "@/libs/jwt";
import { JwtPayload } from "jsonwebtoken";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, setIsAdmin, setIsAuthenticated } = useAuth();

  if (!isAuthenticated) {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const jwtDecoded = decodeToken(accessToken!) as JwtPayload;
      console.log(jwtDecoded);

      if (!jwtDecoded) {
        return <Navigate to="/login" replace />;
      }

      setIsAuthenticated(true)
      if ((jwtDecoded?.["role"] as string).toLowerCase() === "admin") {
        setIsAdmin(true)
      }
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};
