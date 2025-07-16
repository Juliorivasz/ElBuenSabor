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
    path: "/admin/articulo",
    element: lazy(() => import("../pages/admin/abm/AbmGeneric").then((module) => ({ default: module.AbmGeneric }))),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/empleados/nuevo",
    element: lazy(() =>
      import("../pages/admin/employees/NuevoEmpleado").then((module) => ({ default: module.NuevoEmpleado })),
    ),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/empleados/editar/:id",
    element: lazy(() =>
      import("../pages/admin/employees/EditarEmpleado").then((module) => ({ default: module.EditarEmpleado })),
    ),
    allowedRoles: ["administrador"],
  },
  {
    path: "/admin/cocina",
    element: lazy(() => import("../pages/admin/kitchen/Kitchen").then((module) => ({ default: module.Kitchen }))),
    allowedRoles: ["administrador", "cocinero"],
  },
  {
    path: "/admin/repartidor",
    element: lazy(() => import("../pages/admin/delivery/Delivery").then((module) => ({ default: module.Delivery }))),
    allowedRoles: ["repartidor", "administrador"],
  },
  {
    path: "empleado/caja",
    element: lazy(() => import("../pages/admin/pedidos/Pedidos").then((module) => ({ default: module.Pedidos }))),
    allowedRoles: ["cajero", "administrador"],
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
  },
  {
    path: "/admin/rubros",
    element: lazy(() => import("../pages/admin/rubros/Rubros").then((module) => ({ default: module.Rubros }))),
    allowedRoles: ["administrador", "cocinero"],
    title: "Gestión de Rubros",
  },
]