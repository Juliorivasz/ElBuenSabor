"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth0Store } from "../store/auth/useAuth0Store";

export const RedirectByRole = () => {
  const navigate = useNavigate();
  const { isLoading: auth0Loading, isAuthenticated } = useAuth0();
  const { user, isTokenReady, isProfileComplete } = useAuth0Store();

  useEffect(() => {
    // Esperar a que Auth0 termine de cargar y el token esté listo
    if (auth0Loading || !isTokenReady) return;

    // Si no está autenticado, redirigir al home
    if (!isAuthenticated || !user) {
      navigate("/", { replace: true });
      return;
    }

    const userRoles = user.roles || [];
    console.log("RedirectByRole - Roles del usuario:", userRoles);

    // Verificar si es administrador o empleado
    const isAdminOrEmployee = userRoles.some((role) =>
      ["administrador", "cocinero", "repartidor", "cajero"].includes(role.toLowerCase()),
    );

    // Si es administrador o empleado, NO necesita completar perfil
    if (isAdminOrEmployee) {
      console.log("Usuario es admin/empleado, redirigiendo directamente");

      // Redirigir directamente según el rol
      if (userRoles.some((role) => role.toLowerCase() === "administrador")) {
        navigate("/admin/dashboard", { replace: true });
      } else if (userRoles.some((role) => role.toLowerCase() === "cocinero")) {
        navigate("/admin/cocina", { replace: true });
      } else if (userRoles.some((role) => role.toLowerCase() === "repartidor")) {
        navigate("/admin/repartidor", { replace: true });
      } else if (userRoles.some((role) => role.toLowerCase() === "cajero")) {
        navigate("/empleado/caja", { replace: true });
      }
      return;
    }

    // Solo para CLIENTES: verificar si el perfil está completo
    if (userRoles.some((role) => role.toLowerCase() === "cliente")) {
      console.log("Usuario es cliente, verificando perfil completo:", isProfileComplete);

      if (!isProfileComplete) {
        navigate("/complete-profile", { replace: true });
        return;
      }
      navigate("/catalog", { replace: true });
      return;
    }

    // Si no tiene roles específicos, redirigir al home
    console.log("Usuario sin roles específicos, redirigiendo al home");
    navigate("/", { replace: true });
  }, [navigate, user, isTokenReady, isProfileComplete, auth0Loading, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Redirigiendo...</p>
        <p className="text-gray-500 text-sm mt-2">Verificando permisos...</p>
      </div>
    </div>
  );
};
