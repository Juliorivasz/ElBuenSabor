import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import "./index.css";
import { Auth0ProviderApp } from "./auth/Auth0ProviderApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderApp>
        <AppRouter />
      </Auth0ProviderApp>
    </BrowserRouter>
  </React.StrictMode>,
);
