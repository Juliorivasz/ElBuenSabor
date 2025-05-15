import { Login, Register, NotFound } from "../pages";
import { routeType } from "./types/routes";
import { Landing } from "../pages/client/Landing";
import { Catalog } from "../pages/client/catalog/Catalog";

export const publicRoutes: routeType[] = [
  {
    name: "Home",
    path: "/",
    element: Landing,
  },
  {
    name: "Login",
    path: "/login",
    element: Login,
  },
  {
    name: "Register",
    path: "/register",
    element: Register,
  },
  {
    name: "NotFound",
    path: "/notFound",
    element: NotFound,
  },
  {
    name: "Catalog",
    path: "/catalog",
    element: Catalog,
  },
];
