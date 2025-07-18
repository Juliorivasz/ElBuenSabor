import { useAuth0 } from "@auth0/auth0-react";
import { useAuth0Store } from "../store/auth/useAuth0Store";
import { isEmployee, isClient } from "../constants/roles";

export const useAuthValidation = () => {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { user, isTokenReady, isProfileComplete } = useAuth0Store();

  const userRoles = user?.roles || [];
  const isUserEmployee = isEmployee(userRoles);
  const isUserClient = isClient(userRoles);
  const hasNoRoles = userRoles.length === 0;

  // Estados de carga
  const isLoading = auth0Loading || !isTokenReady;

  // Estados de autenticación
  const isFullyAuthenticated = isAuthenticated && user && isTokenReady;

  // Estados específicos para clientes
  const needsProfileCompletion = isUserClient && !isProfileComplete;
  const isClientReady = isUserClient && isProfileComplete;

  // Estados específicos para empleados
  const isEmployeeReady = isUserEmployee;

  return {
    // Estados básicos
    isLoading,
    isAuthenticated,
    isFullyAuthenticated,

    // Información del usuario
    user,
    userRoles,

    // Tipos de usuario
    isUserEmployee,
    isUserClient,
    hasNoRoles,

    // Estados de cliente
    needsProfileCompletion,
    isClientReady,

    // Estados de empleado
    isEmployeeReady,

    // Estados de perfil
    isProfileComplete,
  };
};
