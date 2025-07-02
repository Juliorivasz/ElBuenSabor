import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { FC, JSX } from "react";
import { useNavigate } from "react-router";
import { Auth0Bridge } from "./Auth0Bridge";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audienceAuth0 = import.meta.env.VITE_AUTH0_AUDIENCE;
const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL;

type Props = {
  children: JSX.Element;
};

export const Auth0ProviderApp: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || "/");
  };

  if (!(domain && clientId && callbackUrl && audienceAuth0)) {
    console.error(
      "Las variables de entorno de Auth0 no están configuradas completamente. Revisa VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE y VITE_AUTH0_CALLBACK_URL.",
    );
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        Error de configuración: Variables de entorno de Auth0 faltantes o incompletas.
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audienceAuth0,
        redirect_uri: callbackUrl,
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}>
      <Auth0Bridge>{children}</Auth0Bridge>
    </Auth0Provider>
  );
};
