// routes/index.tsx
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { clientRoutes, adminRoutes } from "./routeConfig";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Rutas Cliente */}
        <Route element={<ClientLayout />}>
          {clientRoutes.map(({ path, element: Element }) => (
            <Route
              key={path}
              path={path}
              element={<Element />}
            />
          ))}
        </Route>

        {/* Rutas Admin protegidas */}
        <Route element={<AdminLayout />}>
          {adminRoutes.map(({ path, element: Element, allowedRoles }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute
                  element={<Element />}
                  allowedRoles={allowedRoles}
                />
              }
            />
          ))}
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Suspense>
  );
}
