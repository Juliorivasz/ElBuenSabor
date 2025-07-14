import { useAuth0 } from "@auth0/auth0-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth0Store } from "../store/auth/useAuth0Store";
import Swal from "sweetalert2";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const location = useLocation();

  const { isTokenReady, isProfileComplete, user: storeUser } = useAuth0Store();

  // 1. Mostrar loading mientras Auth0 y el token no estén listos
  if (auth0Loading || !isTokenReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl text-black">Verificando autenticación...</div>
      </div>
    );
  }

  // 2. Si no está autenticado, redirigir al home
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // 3. Verificar si es administrador o empleado
  const userRoles = storeUser?.roles || [];
  const isAdminOrEmployee = userRoles.some((role) =>
    ["administrador", "cocinero", "repartidor", "cajero"].includes(role.toLowerCase()),
  );

  // 4. Solo CLIENTES necesitan completar perfil
  // Administradores y empleados NO pasan por complete-profile
  if (!isAdminOrEmployee && !isProfileComplete && location.pathname !== "/complete-profile") {
    console.log("Cliente con perfil incompleto, redirigiendo a /complete-profile");
    return (
      <Navigate
        to="/complete-profile"
        replace
      />
    );
  }

  // 5. Si es cliente con perfil completo y está en complete-profile, redirigir
  if (!isAdminOrEmployee && isProfileComplete && location.pathname === "/complete-profile") {
    console.log("Cliente con perfil completo, redirigiendo desde /complete-profile a /catalog");
    return (
      <Navigate
        to="/catalog"
        replace
      />
    );
  }

  // 6. Si es admin/empleado y está en complete-profile, redirigir a su área
  if (isAdminOrEmployee && location.pathname === "/complete-profile") {
    console.log("Admin/empleado en complete-profile, redirigiendo a su área");
    return (
      <Navigate
        to="/redirectRol"
        replace
      />
    );
  }

  // 7. Verificar roles específicos (solo si se requieren)
  if (requiredRole && requiredRole.length > 0) {
    const hasRequiredRole = requiredRole.some((required) =>
      userRoles.some((userRole) => userRole.toLowerCase() === required.toLowerCase()),
    );

    if (!hasRequiredRole) {
      console.warn(
        `Acceso denegado: Usuario no tiene el rol requerido para ${location.pathname}. 
        Roles requeridos: ${requiredRole.join(", ")}, 
        Roles de usuario: ${userRoles.join(", ") || "ninguno"}.`,
      );

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
  }

  // 8. Si todo está bien, renderizar el componente
  return <>{children}</>;
};
