import { useAuth0 } from "@auth0/auth0-react";
import { type FC, type JSX, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isEmployee } from "../constants/roles";
import { fetchUserProfile } from "../services/clienteServicio";
import { setAccessTokenSilently } from "../services/interceptors/axios.interceptors";
import type { IUser } from "../store/auth/types/user";
import { useAuth0Store } from "../store/auth/useAuth0Store";

interface Auth0BridgeProps {
  children: JSX.Element;
}

export const Auth0Bridge: FC<Auth0BridgeProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading: auth0Loading, getAccessTokenSilently } = useAuth0();
  const { setUser, clearUser, setTokenReady, setIsProfileComplete, setProfileData } = useAuth0Store();
  const navigate = useNavigate();
  const location = useLocation();

  const authProcessed = useRef(false);

  useEffect(() => {
    const processAuthentication = async () => {
      // Si está cargando, marcar token como no listo
      if (auth0Loading) {
        setTokenReady(false);
        return;
      }

      // Si no está autenticado, limpiar estado
      if (!isAuthenticated) {
        clearUser();
        setAccessTokenSilently(null);
        authProcessed.current = false;

        // Solo redirigir si no está en rutas públicas
        const publicPaths = [
          "/",
          "/about",
          "/contact",
          "/catalog",
          "/delivery",
          "/help",
          "/faq",
          "/terms",
          "/privacy",
          "/cookies",
        ];
        if (!publicPaths.includes(location.pathname)) {
          navigate("/", { replace: true });
        }

        setTokenReady(true);
        return;
      }

      // Si ya se procesó la autenticación y no estamos en redirectRol, marcar como listo
      if (authProcessed.current && location.pathname !== "/redirectRol") {
        setTokenReady(true);
        return;
      }

      // Procesar usuario autenticado
      if (isAuthenticated && user && !authProcessed.current) {
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: "openid profile email",
            },
          });

          setAccessTokenSilently(getAccessTokenSilently);

          const userForZustand: IUser = {
            token: accessToken,
            roles: user["https://apiback/roles"] || [],
            id: user.sub || "",
            email: user.email || "",
            name: user.name || "",
            picture: user.picture || "",
          };

          setUser(userForZustand);

          // Solo los clientes necesitan verificar/completar perfil
          const userRoles = userForZustand.roles;
          const isUserEmployee = isEmployee(userRoles);

          if (!isUserEmployee) {
            // Es cliente o no tiene roles - verificar perfil
            try {
              const profile = await fetchUserProfile();
              setProfileData({
                apellido: profile.apellido,
                telefono: profile.telefono ?? undefined,
                roles: profile.roles || userForZustand.roles,
                imagen: profile.imagen,
              });
              setIsProfileComplete(true);
            } catch (profileError) {
              console.warn("Perfil no encontrado - usuario necesita completar registro", profileError);
              setIsProfileComplete(false);
            }
          } else {
            // Es empleado/admin - no necesita completar perfil
            setIsProfileComplete(true);
          }

          authProcessed.current = true;
        } catch (tokenError) {
          console.error("Error al obtener el access token:", tokenError);
          clearUser();
          setAccessTokenSilently(null);
          authProcessed.current = false;
          navigate("/", { replace: true });
        } finally {
          setTokenReady(true);
        }
      }
    };

    processAuthentication();
  }, [
    isAuthenticated,
    auth0Loading,
    user,
    getAccessTokenSilently,
    setUser,
    clearUser,
    setTokenReady,
    setIsProfileComplete,
    setProfileData,
    navigate,
    location.pathname,
  ]);

  return <>{children}</>;
};

export { useAuth0Store };

