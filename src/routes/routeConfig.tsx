import { lazy } from "react";

export const clientRoutes = [
  {
    path: "/",
    element: lazy(() => import("../pages/client/Landing").then((module) => ({ default: module.Landing }))),
  },
  {
    path: "/notFound",
    element: lazy(() => import("../pages/NotFound").then((module) => ({ default: module.NotFound }))),
  },
  {
    path: "/catalog",
    element: lazy(() => import("../pages/client/catalog/Catalog").then((module) => ({ default: module.Catalog }))),
  },
];

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: lazy(() => import("../pages/client/Landing").then((module) => ({ default: module.Landing }))),
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/empleados",
    element: lazy(() => import("../pages/client/Landing").then((module) => ({ default: module.Landing }))),
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/cocina",
    element: lazy(() => import("../pages/client/Landing").then((module) => ({ default: module.Landing }))),
    allowedRoles: ["cocinero", "admin"],
  },
];
