import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Cargando sesión...</h1>
        <p>Verificando su autenticación.</p>
      </div>
    );
  }

  // Si el usuario está autenticado, renderizamos el contenido de las rutas anidadas.
  // Outlet es crucial para que las rutas hijas se muestren dentro de este layout/wrapper.
  if (isAuthenticated) {
    return <Outlet />;
  }

  return null;
};
