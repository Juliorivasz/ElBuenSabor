import { lazy } from "react"

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
    path: "/admin/empleados/nuevo",
    element: lazy(() =>
      import("../pages/admin/employees/NuevoEmpleado").then((module) => ({ default: module.default })),
    ),
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/empleados/editar/:id",
    element: lazy(() =>
      import("../pages/admin/employees/EditarEmpleado").then((module) => ({ default: module.default })),
    ),
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/cocina",
    element: lazy(() => import("../pages/admin/kitchen/Kitchen").then((module) => ({ default: module.Kitchen }))),
    allowedRoles: ["cocinero", "admin"],
  },
  {
    path: "/abm",
    element: lazy(() => import("../pages/admin/abm/AbmGeneric").then((module) => ({ default: module.AbmGeneric }))),
  },
]
