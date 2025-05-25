import { Route, Routes } from "react-router-dom";
// import { publicRoutes } from "./publicRoutes";
import { LayoutClient } from "../layouts/client/LayoutClient";
import { clientRoutes } from "./routeConfig";

export const AppRouter = () => {
  return (
    <Routes>
      {/* rutas publicas */}
      <Route element={<LayoutClient />}>
        {clientRoutes.map((route) => (
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
