import { Route, Routes } from "react-router-dom"
import { Suspense } from "react"
import { LayoutClient } from "../layouts/client/LayoutClient"
import { LayoutAdmin } from "../layouts/admin/LayoutAdmin"
import { PrivateRoute } from "./PrivateRoute"
import { publicRoutes } from "./publicRoutes"
import { clientPrivateRoutes } from "./clientRoutes"
import { adminRoutes } from "./adminRoutes"
import { pagoRoutes } from "./pagoRoutes"
import { NotFound } from "../pages"

export const AppRouter = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <Routes>
        {/* Rutas Públicas */}
        <Route element={<LayoutClient />}>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}

          {/* Rutas de Pago */}
          {pagoRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}
        </Route>

        {/* Rutas Privadas del Cliente */}
        <Route element={<LayoutClient />}>
          {clientPrivateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.element />
                </PrivateRoute>
              }
            />
          ))}
        </Route>

        {/* Rutas del Admin */}
        <Route element={<LayoutAdmin />}>
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.element />
                </PrivateRoute>
              }
            />
          ))}
        </Route>

        {/* Ruta por defecto para páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
