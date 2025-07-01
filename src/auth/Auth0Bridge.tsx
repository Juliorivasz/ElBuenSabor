// src/auth/Auth0Bridge.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { FC, JSX, useEffect, useRef } from "react";
import { useAuth0Store } from "../store/auth/useAuth0Store";
import { setAccessTokenSilently } from "../services/interceptors/axios.interceptors";
import { useNavigate, useLocation } from "react-router-dom";
import type { IUser } from "../store/auth/types/user";
import { fetchUserProfile } from "../services/clienteServicio"; // Asume que esto llama a tu /cliente/perfil endpoint

interface Auth0BridgeProps {
  children: JSX.Element;
}

export const Auth0Bridge: FC<Auth0BridgeProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading: auth0Loading, getAccessTokenSilently } = useAuth0();
  const { setUser, clearUser, setTokenReady, setIsProfileComplete, setProfileData } = useAuth0Store();
  const navigate = useNavigate();
  const location = useLocation();

  const profileCheckPerformed = useRef(false);

  useEffect(() => {
    const processAuthAndProfile = async () => {
      if (auth0Loading) {
        setTokenReady(false);
        return;
      }

      if (!isAuthenticated) {
        clearUser();
        setAccessTokenSilently(null);
        profileCheckPerformed.current = false;

        // Si el usuario no está logueado y está en una ruta que requiere autenticación, redirige a la raíz
        // Las redirecciones por no autenticado las gestiona PrivateRoute ahora.
        // Pero esta es una capa de seguridad temprana en el bridge.
        if (location.pathname !== "/" && !location.pathname.startsWith("/public")) {
          // Ajusta si tienes otras rutas públicas
          navigate("/", { replace: true });
        }
        setTokenReady(true); // Indica que hemos terminado de procesar (token no disponible, pero el bridge está listo)
        return;
      }

      // Si estamos autenticados y ya se realizó el chequeo del perfil, y no venimos de /redirectRol
      // Esto evita llamadas innecesarias a la API de perfil en cada re-render.
      if (profileCheckPerformed.current && location.pathname !== "/redirectRol") {
        setTokenReady(true); // Si ya se procesó, el token está listo
        return;
      }

      // Si estamos autenticados y tenemos datos de usuario (y no se ha procesado el perfil o venimos de /redirectRol)
      if (isAuthenticated && user) {
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: "openid profile email", // Asegúrate de pedir los scopes que necesita tu backend
            },
          });

          setAccessTokenSilently(getAccessTokenSilently); // Configura el interceptor de Axios

          // Crea el objeto IUser básico a partir de los datos de Auth0
          const userForZustand: IUser = {
            token: accessToken,
            roles: user["https://apiback/roles"] || [], // Roles iniciales del ID token de Auth0
            id: user.sub || "",
            email: user.email || "",
            name: user.name || "",
            picture: user.picture || "",
          };

          setUser(userForZustand);

          try {
            const profile = await fetchUserProfile();

            setProfileData({
              apellido: profile.apellido,
              telefono: profile.telefono ?? undefined,
              roles: profile.roles || userForZustand.roles,
              imagen: profile.imagen,
            });
            setIsProfileComplete(true);
          } catch (profileError: unknown) {
            // Si el perfil NO se encuentra en el backend (ej. 404), significa que está incompleto
            console.warn(
              "Perfil de usuario no encontrado en el backend o error al obtenerlo. Se asume perfil incompleto.",
              profileError,
            );
            setIsProfileComplete(false); // Marca el perfil como incompleto

            // Si no estamos ya en el formulario de completación, redirige
            if (location.pathname !== "/complete-profile") {
              navigate("/complete-profile", { replace: true });
            }
          } finally {
            profileCheckPerformed.current = true; // Marca que el chequeo del perfil se realizó
            setTokenReady(true); // Indica que todo el proceso inicial (Auth0 y perfil) ha terminado
          }
        } catch (tokenError) {
          console.error("Error al obtener el access token:", tokenError);
          clearUser(); // Limpia el estado del usuario si el token no se pudo obtener
          setAccessTokenSilently(null);
          profileCheckPerformed.current = false; // Reinicia la referencia en caso de error
          setTokenReady(true); // Indica que el bridge ha terminado (aunque con error)
          navigate("/", { replace: true }); // Redirige a la página de inicio/login
        }
      }
    };

    processAuthAndProfile();
    // Dependencias ajustadas: isProfileComplete ya no necesita estar aquí, ya que el bridge lo SETEA.
    // user y isAuthenticated son cruciales para iniciar el efecto.
  }, [
    isAuthenticated,
    auth0Loading, // Usar auth0Loading para la carga inicial del SDK
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
