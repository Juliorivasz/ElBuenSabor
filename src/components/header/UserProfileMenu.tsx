// src/components/navbar/UserProfileMenu.tsx
import React from "react";
import { Link } from "react-router-dom";
import { User } from "@auth0/auth0-react"; // Importa el tipo User de Auth0

interface UserProfileMenuProps {
  user: User | undefined;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onActionComplete: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  isMenuOpen,
  setIsMenuOpen,
  onLogout,
  onActionComplete,
}) => (
  <div className="relative">
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="text-white font-bangers text-lg italic flex items-center gap-2 cursor-pointer focus:outline-none">
      Hola, {user?.name || user?.nickname || "Usuario"}
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
        fill="currentColor"
        viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
    {isMenuOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => {
            setIsMenuOpen(false);
            onActionComplete();
          }}>
          Perfil
        </Link>
        <Link
          to="/address"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => {
            setIsMenuOpen(false);
            onActionComplete();
          }}>
          Direcciones
        </Link>
        <button
          onClick={() => {
            onLogout();
            onActionComplete();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
          Cerrar Sesión
        </button>
      </div>
    )}
  </div>
);
