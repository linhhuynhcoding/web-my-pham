// PrivateRoute.tsx
import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};
