// Constantes para roles del sistema
export const ROLES = {
  CLIENTE: "cliente",
  ADMINISTRADOR: "administrador",
  COCINERO: "cocinero",
  REPARTIDOR: "repartidor",
  CAJERO: "cajero",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

// Roles que son empleados/admin
export const EMPLOYEE_ROLES: RoleType[] = [ROLES.ADMINISTRADOR, ROLES.COCINERO, ROLES.REPARTIDOR, ROLES.CAJERO];

// Utilidades para verificar roles
export const isEmployee = (roles: string[]): boolean => {
  return roles.some((role) => EMPLOYEE_ROLES.includes(role.toLowerCase() as RoleType));
};

export const isClient = (roles: string[]): boolean => {
  return roles.some((role) => role.toLowerCase() === ROLES.CLIENTE);
};

export const hasRole = (userRoles: string[], requiredRoles: string[]): boolean => {
  return requiredRoles.some((required) =>
    userRoles.some((userRole) => userRole.toLowerCase() === required.toLowerCase()),
  );
};

// Obtener la ruta de redirección según el rol principal
export const getRedirectPathByRole = (roles: string[]): string => {
  const lowerRoles = roles.map((r) => r.toLowerCase());

  if (lowerRoles.includes(ROLES.ADMINISTRADOR)) {
    return "/admin/dashboard";
  }
  if (lowerRoles.includes(ROLES.COCINERO)) {
    return "/admin/cocina";
  }
  if (lowerRoles.includes(ROLES.REPARTIDOR)) {
    return "/admin/repartidor";
  }
  if (lowerRoles.includes(ROLES.CAJERO)) {
    return "/empleado/caja";
  }
  if (lowerRoles.includes(ROLES.CLIENTE)) {
    return "/catalog";
  }

  return "/"; // Fallback
};
