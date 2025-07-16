"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValidation } from "../hooks/useAuthValidation";
import { getRedirectPathByRole } from "../constants/roles";

export const RedirectByRole = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, userRoles, hasNoRoles, needsProfileCompletion } = useAuthValidation();

  useEffect(() => {
    // Esperar a que termine de cargar
    if (isLoading) return;

    // Si no está autenticado, redirigir al home
    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    // Si no tiene roles o necesita completar perfil, redirigir a complete-profile
    if (hasNoRoles || needsProfileCompletion) {
      navigate("/complete-profile", { replace: true });
      return;
    }

    // Redirigir según el rol
    const redirectPath = getRedirectPathByRole(userRoles);
    navigate(redirectPath, { replace: true });
  }, [navigate, isLoading, isAuthenticated, userRoles, hasNoRoles, needsProfileCompletion]);

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
