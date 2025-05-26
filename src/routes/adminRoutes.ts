import { lazy } from "react";

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: lazy(() => import("../pages/admin/dashboard/Dashboard").then((module) => ({ default: module.Dashboard }))),
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/empleados",
    element: lazy(() => import("../pages/admin/employees/Employees").then((module) => ({ default: module.Employees }))),
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/cocina",
    element: lazy(() => import("../pages/admin/kitchen/Kitchen").then((module) => ({ default: module.Kitchen }))),
    allowedRoles: ["cocinero", "admin"],
  },
];
