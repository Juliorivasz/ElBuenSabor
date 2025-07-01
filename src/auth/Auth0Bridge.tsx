import { useAuth0 } from "@auth0/auth0-react";
import { FC, JSX, useEffect, useRef } from "react";
import { useAuth0Store } from "../store/auth/useAuth0Store";
import { setAccessTokenSilently } from "../services/interceptors/axios.interceptors";
import { useNavigate, useLocation } from "react-router-dom";
import type { IUser } from "../store/auth/types/user";
import { fetchUserProfile } from "../services/clienteServicio";

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

        if (location.pathname !== "/" && !location.pathname.startsWith("/public")) {
          navigate("/", { replace: true });
        }
        setTokenReady(true);
        return;
      }

      if (profileCheckPerformed.current && location.pathname !== "/redirectRol") {
        setTokenReady(true);
        return;
      }

      if (isAuthenticated && user) {
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
            console.warn(
              "Perfil de usuario no encontrado en el backend o error al obtenerlo. Se asume perfil incompleto.",
              profileError,
            );
            setIsProfileComplete(false);

            if (location.pathname !== "/complete-profile") {
              navigate("/complete-profile", { replace: true });
            }
          } finally {
            profileCheckPerformed.current = true;
            setTokenReady(true);
          }
        } catch (tokenError) {
          console.error("Error al obtener el access token:", tokenError);
          clearUser();
          setAccessTokenSilently(null);
          profileCheckPerformed.current = false;
          setTokenReady(true);
          navigate("/", { replace: true });
        }
      }
    };

    processAuthAndProfile();
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
