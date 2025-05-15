import { Home, HowFunction, AboutUs, Contact } from "../pages/Client";
import { Login, Register, NotFound } from "../pages";
import { routeType } from "./types/routes";
import Landing from "../pages/Client/Landing";

export const publicRoutes: routeType[] = [
  {
    name: "Home",
    path: "/",
    element: Landing,
  },
  {
    name: "HowFunction",
    path: "/howFunction",
    element: HowFunction,
  },
  {
    name: "AboutUs",
    path: "/aboutUs",
    element: AboutUs,
  },
  {
    name: "Contact",
    path: "/contact",
    element: Contact,
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
];
