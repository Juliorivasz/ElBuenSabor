import { lazy } from "react";

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: lazy(() => import("../pages/admin/dashboard/Dashboard").then((module) => ({ default: module.Dashboard }))),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/empleados",
    element: lazy(() => import("../pages/admin/employees/Employees").then((module) => ({ default: module.Employees }))),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/abm",
    element: lazy(() => import("../pages/admin/abm/AbmGeneric").then((module) => ({ default: module.AbmGeneric }))),
    allowedRoles: ["administrador"],
  },
  {
    path: "/empleado/cocina",
    element: lazy(() => import("../pages/admin/kitchen/Kitchen").then((module) => ({ default: module.Kitchen }))),
    allowedRoles: ["cocinero"],
  },
  {
    path: "empleado/delivery",
    element: lazy(() => import("../pages/admin/abm/AbmGeneric").then((module) => ({ default: module.AbmGeneric }))),
    allowedRoles: ["repartidor"],
  },
  {
    path: "empleado/caja",
    element: lazy(() => import("../pages/admin/abm/AbmGeneric").then((module) => ({ default: module.AbmGeneric }))),
    allowedRoles: ["cajero"],
  },
];
