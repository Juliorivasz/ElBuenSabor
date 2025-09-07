import { lazy } from "react";

export const clientPrivateRoutes = [
  {
    path: "/cart",
    element: lazy(() => import("../pages/client/cart/Cart").then((module) => ({ default: module.Cart }))),
  },
  {
    path: "/profile",
    element: lazy(() => import("../pages/client/profile/Profile").then((module) => ({ default: module.Profile }))),
  },
  {
    path: "/orders",
    element: lazy(() => import("../pages/client/orders/Orders").then((module) => ({ default: module.Orders }))),
  },
  {
    path: "/address",
    element: lazy(() => import("../pages/client/address/Address").then((module) => ({ default: module.Address }))),
  }
];
