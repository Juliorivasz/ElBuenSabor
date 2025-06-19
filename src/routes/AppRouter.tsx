import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { LayoutClient } from "../layouts/client/LayoutClient";
import { LayoutAdmin } from "../layouts/admin/LayoutAdmin";
import { PrivateRoute } from "./PrivateRoute";
import { publicRoutes } from "./publicRoutes";
import { clientPrivateRoutes } from "./clientRoutes";
import { adminRoutes } from "./adminRoutes";
import { NotFound } from "../pages";
import { useAuth0Store } from "../store/auth/useAuth0Store";
import { RedirectByRole } from "./RedirectByRole";

export const AppRouter = () => {
  const { user } = useAuth0Store();

  console.log(user);
  return (
    <Suspense
      fallback={<div className="text-4xl flex items-center justify-center min-h-screen text-black">Cargando...</div>}>
      <Routes>
        {/* ruta de redireccion */}
        <Route
          path="/redirectRol"
          element={<RedirectByRole />}
        />
        {/* Rutas Públicas */}
        <Route element={<LayoutClient />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Route>

        {/* Rutas Privadas del Cliente */}
        <Route element={<LayoutClient />}>
          {clientPrivateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute requiredRole={["cliente"]}>
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
                <PrivateRoute requiredRole={route.allowedRoles}>
                  <route.element />
                </PrivateRoute>
              }
            />
          ))}
        </Route>

        {/* Ruta por defecto para páginas no encontradas */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Suspense>
  );
};
