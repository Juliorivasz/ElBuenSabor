import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { FC, JSX } from "react";
import { useNavigate } from "react-router";

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

  if (!(domain && clientId && callbackUrl)) {
    return null;
  }
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audienceAuth0,
        redirect_uri: callbackUrl,
      }}
      onRedirectCallback={onRedirectCallback}>
      {children}
    </Auth0Provider>
  );
};
