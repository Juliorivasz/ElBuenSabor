import { lazy } from "react"
import type { routeType } from "./types/routes"

const Success = lazy(() => import("../pages/client/pago/Success"))
const Pending = lazy(() => import("../pages/client/pago/Pending"))
const Failure = lazy(() => import("../pages/client/pago/Failure"))

export const pagoRoutes: routeType[] = [
  {
    name: "Pago Exitoso",
    path: "/pago/success",
    element: Success,
  },
  {
    name: "Pago Pendiente",
    path: "/pago/pending",
    element: Pending,
  },
  {
    name: "Pago Fallido",
    path: "/pago/failure",
    element: Failure,
  },
]
