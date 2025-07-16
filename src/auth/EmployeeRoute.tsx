import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthValidation } from "../hooks/useAuthValidation";
import Swal from "sweetalert2";
import { hasRole } from "../constants/roles";

interface EmployeeRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const EmployeeRoute = ({ children, requiredRoles = [] }: EmployeeRouteProps) => {
  const { isLoading, isAuthenticated, isUserEmployee, isUserClient, userRoles, isEmployeeReady } = useAuthValidation();

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl text-black">Verificando permisos...</div>
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

  // Cliente intentando acceder a rutas de empleado - redirigir al catálogo
  if (isUserClient) {
    return (
      <Navigate
        to="/catalog"
        replace
      />
    );
  }

  // No es empleado - redirigir según corresponda
  if (!isUserEmployee) {
    return (
      <Navigate
        to="/redirectRol"
        replace
      />
    );
  }

  // Verificar roles específicos si se requieren
  if (requiredRoles.length > 0 && !hasRole(userRoles, requiredRoles)) {
    Swal.fire({
      icon: "error",
      title: "Acceso restringido",
      text: "No tienes permisos para acceder a esta página.",
      confirmButtonText: "Aceptar",
    });
    return (
      <Navigate
        to="/redirectRol"
        replace
      />
    );
  }

  // Empleado con permisos correctos - mostrar contenido
  if (isEmployeeReady) {
    return <>{children}</>;
  }

  // Fallback
  return (
    <Navigate
      to="/redirectRol"
      replace
    />
  );
};
