import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { LayoutClient } from "../layouts/client/LayoutClient";
import { LayoutAdmin } from "../layouts/admin/LayoutAdmin";
import { PrivateRoute } from "./PrivateRoute";
import { publicRoutes } from "./publicRoutes";
import { clientPrivateRoutes } from "./clientRoutes";
import { adminRoutes } from "./adminRoutes";
import { NotFound } from "../pages";
import { RedirectByRole } from "./RedirectByRole";
import { ProfileCompletionForm } from "../pages/client/profile/ProfileCompletionForm";

export const AppRouter = () => {
  return (
    <Suspense
      fallback={<div className="text-4xl flex items-center justify-center min-h-screen text-black">Cargando...</div>}>
      <Routes>
        {/* ruta de redireccion */}
        <Route
          path="/redirectRol"
          element={<RedirectByRole />}
        />

        {/* registro cliente */}
        <Route element={<LayoutClient />}>
          <Route
            path={"/complete-profile"}
            element={
              <PrivateRoute>
                <ProfileCompletionForm />
              </PrivateRoute>
            }
          />
        </Route>

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
