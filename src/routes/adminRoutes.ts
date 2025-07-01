import { lazy } from "react"

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
    path: "/admin/articulo",
    element: lazy(() => import("../pages/admin/abm/AbmGeneric").then((module) => ({ default: module.AbmGeneric }))),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/empleados/nuevo",
    element: lazy(() =>
      import("../pages/admin/employees/NuevoEmpleado").then((module) => ({ default: module.default })),
    ),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/empleados/editar/:id",
    element: lazy(() =>
      import("../pages/admin/employees/EditarEmpleado").then((module) => ({ default: module.default })),
    ),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/cocina",
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
  {
    path: "/admin/categorias",
    element: lazy(() => import("../pages/admin/categorias/Categorias").then((m) => ({ default: m.Categorias }))),
    title: "Gestión de Categorías",
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/pedidos",
    element: lazy(() => import("../pages/admin/pedidos/Pedidos").then((module) => ({ default: module.Pedidos }))),
    allowedRoles: ["administrador"],
  }

]
