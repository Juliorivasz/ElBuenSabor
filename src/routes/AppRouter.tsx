import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { LayoutClient } from "../layouts/client/LayoutClient";

export const AppRouter = () => {
  return (
    <Routes>
      {/* rutas publicas */}
      <Route element={<LayoutClient />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Route>
    </Routes>
  );
};
