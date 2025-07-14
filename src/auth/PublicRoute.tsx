import type { ReactNode } from "react";
import { useAuthValidation } from "../hooks/useAuthValidation";

interface PublicRouteProps {
  children: ReactNode;
  redirectAuthenticatedUsers?: boolean;
}

export const PublicRoute = ({ children, redirectAuthenticatedUsers = false }: PublicRouteProps) => {
  const { isLoading, isAuthenticated } = useAuthValidation();

  // Mostrar loading si es necesario
  if (isLoading && redirectAuthenticatedUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl text-black">Cargando...</div>
      </div>
    );
  }

  // Si está configurado para redirigir usuarios autenticados y está autenticado
  if (redirectAuthenticatedUsers && isAuthenticated) {
    // Podrías redirigir aquí si es necesario, pero por ahora solo mostramos el contenido
    // return <Navigate to="/redirectRol" replace />;
  }

  return <>{children}</>;
};
