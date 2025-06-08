import { useAuth0 } from "@auth0/auth0-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando autenticación...</div>
      </div>
    );
  }

  if (user?.role === "ADMIN" && requiredRole === "CLIENT") {
    return (
      <Navigate
        to="/catalog"
        replace
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Si se requiere un rol específico, verificarlo
  if (requiredRole) {
    const userRole = user?.["https://elbuensabor.com/roles"]?.[0] || user?.role;
    if (userRole !== requiredRole) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  }

  return <>{children}</>;
};
