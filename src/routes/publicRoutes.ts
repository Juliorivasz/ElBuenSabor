import { lazy } from "react";

export const publicRoutes = [
  {
    path: "/",
    element: lazy(() => import("../pages/client/Landing").then((module) => ({ default: module.Landing }))),
  },
  {
    path: "/about",
    element: lazy(() => import("../pages/client/AboutUs").then((module) => ({ default: module.AboutUs }))),
  },
  {
    path: "/contact",
    element: lazy(() => import("../pages/client/Contact").then((module) => ({ default: module.Contact }))),
  },
  {
    path: "/delivery",
    element: lazy(() => import("../pages/client/services/Delivery").then((module) => ({ default: module.Delivery }))),
  },
  {
    path: "/help",
    element: lazy(() => import("../pages/client/support/Help").then((module) => ({ default: module.Help }))),
  },
  {
    path: "/faq",
    element: lazy(() => import("../pages/client/support/FAQ").then((module) => ({ default: module.FAQ }))),
  },
  {
    path: "/terms",
    element: lazy(() => import("../pages/client/legal/Terms").then((module) => ({ default: module.Terms }))),
  },
  {
    path: "/privacy",
    element: lazy(() => import("../pages/client/legal/Privacy").then((module) => ({ default: module.Privacy }))),
  },
  {
    path: "/cookies",
    element: lazy(() => import("../pages/client/legal/Cookies").then((module) => ({ default: module.Cookies }))),
  },
  {
    path: "/notFound",
    element: lazy(() => import("../pages/NotFound").then((module) => ({ default: module.NotFound }))),
  },
  // Catálogo es público pero con funcionalidades limitadas para no autenticados
  {
    path: "/catalog",
    element: lazy(() => import("../pages/client/catalog/Catalog").then((module) => ({ default: module.Catalog }))),
  },
];
