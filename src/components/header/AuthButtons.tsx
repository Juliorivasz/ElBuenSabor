// src/components/navbar/AuthButtons.tsx
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface AuthButtonsProps {
  onAuthAction: () => void; // Función para cerrar el menú móvil
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ onAuthAction }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <button
        onClick={() => {
          loginWithRedirect({ authorizationParams: { screen_hint: "signup" }, appState: { returnTo: "/catalog" } });
          onAuthAction();
        }}
        className="bg-white hover:bg-gray-200 text-red-500 font-bold py-2 px-4 w-full  rounded-full cursor-pointer transition-colors duration-300 ease-in-out">
        REGISTRATE
      </button>
      <button
        onClick={() => {
          loginWithRedirect({ appState: { returnTo: "/catalog" } });
          onAuthAction();
        }}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 w-full rounded-full cursor-pointer transition-colors duration-300 ease-in-out">
        INGRESAR
      </button>
    </>
  );
};
