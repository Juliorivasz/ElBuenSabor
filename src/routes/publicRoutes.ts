import { lazy } from "react";

export const publicRoutes = [
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
