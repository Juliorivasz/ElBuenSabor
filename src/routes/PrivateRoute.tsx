import { useAuth0 } from "@auth0/auth0-react";
import { type ReactNode } from "react";
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

  if (auth0Loading || !isTokenReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl text-black">Verificando autenticación...</div>
      </div>
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

  // 3. Redirigir al formulario de perfil si el perfil NO está completo
  // y NO estamos ya en la página del formulario de perfil.
  // Esta es la regla principal para forzar la completación del perfil.
  if (!isProfileComplete && location.pathname !== "/complete-profile") {
    console.log("Perfil incompleto, redirigiendo a /complete-profile");
    return (
      <Navigate
        to="/complete-profile"
        replace
      />
    );
  }

  // 4. Si el perfil *está* completo y estamos intentando acceder a /complete-profile,
  // redirigir a una página de inicio para clientes (ej. /catalog).
  // Esto evita que un usuario con perfil completo se quede atascado en el formulario.
  if (isProfileComplete && location.pathname === "/complete-profile") {
    console.log("Perfil completo, redirigiendo desde /complete-profile a /catalog");
    return (
      <Navigate
        to="/redirectRol"
        replace
      />
    );
  }

  // 5. Verificar roles (solo si se requieren roles y el perfil YA está completo)
  // Utilizamos los roles del store de Zustand (storeUser) que Auth0Bridge ya debería haber establecido.
  if (requiredRole && requiredRole.length > 0) {
    const userRoles = storeUser?.roles;

    if (!userRoles || !requiredRole.some((required) => userRoles.includes(required.toUpperCase()))) {
      console.warn(
        `Acceso denegado: Usuario no tiene el rol requerido para ${
          location.pathname
        }. Roles requeridos: ${requiredRole.join(", ")}, Roles de usuario: ${userRoles?.join(", ") || "ninguno"}.`,
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

  return <>{children}</>;
};
