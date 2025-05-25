import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AppRouter } from "./routes/AppRouter";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-ebs2025.us.auth0.com"
        clientId="eNDLYs2xPXqt6WoWgJQZ6UbmkUtVYYdr"
        authorizationParams={{
          redirect_uri: `${window.location.origin}/catalog`,
        }}>
        <AppRouter />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
);
