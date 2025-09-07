import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthValidation } from "../hooks/useAuthValidation";

interface ClientRouteProps {
  children: ReactNode;
}

export const ClientRoute = ({ children }: ClientRouteProps) => {
  const location = useLocation();
  const { isLoading, isAuthenticated, isUserEmployee, hasNoRoles, needsProfileCompletion, isClientReady } =
    useAuthValidation();

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl text-black">Cargando...</div>
      </div>
    );
  }

  // No autenticado - redirigir al home
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Empleado/Admin intentando acceder a rutas de cliente - redirigir a su área
  if (isUserEmployee) {
    return (
      <Navigate
        to="/redirectRol"
        replace
      />
    );
  }

  // Usuario sin roles o cliente que necesita completar perfil
  if (hasNoRoles || needsProfileCompletion) {
    if (location.pathname !== "/complete-profile") {
      return (
        <Navigate
          to="/complete-profile"
          replace
        />
      );
    }
  }

  // Cliente con perfil completo en complete-profile - redirigir al catálogo
  if (isClientReady && location.pathname === "/complete-profile") {
    return (
      <Navigate
        to="/catalog"
        replace
      />
    );
  }

  // Cliente listo - mostrar contenido
  if (isClientReady || location.pathname === "/complete-profile") {
    return <>{children}</>;
  }

  // Fallback - redirigir al home
  return (
    <Navigate
      to="/"
      replace
    />
  );
};
