import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Logo } from "../components/header/Logo";
import { ShoppingCartButton } from "../components/header/ShoppingCartButton";
import { NavLinks } from "../components/header/NavLinks";
import { UserProfileMenu } from "../components/header/UserProfileMenu";
import { AuthButtons } from "../components/header/AuthButtons";

export const NavBar: React.FC = () => {
  const location = useLocation();
  const { isLoading, isAuthenticated, user, logout } = useAuth0();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rutasOcultar = ["/register", "/login", "/catalog"];
  const mostrarEnlacesSeccion = !rutasOcultar.includes(location.pathname);

  // Función para cerrar ambos menús (perfil y móvil) después de una acción
  const handleMenuActionComplete = () => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (isLoading) {
    return (
      <nav className="navbar-dark flex items-center justify-between py-2 px-5 w-full box-border">
        <div>Cargando...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#242424] flex items-center justify-between py-3 px-5 w-full box-border relative">
      <Logo />

      {/* Botón de Menú Hamburguesa y Carrito en móvil (Derecha) */}
      <div className="flex items-center gap-20 md:hidden z-20">
        <ShoppingCartButton /> {/* Carrito visible en móvil */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Contenedor del Menú Principal (Oculto en móvil, se muestra con 'isMobileMenuOpen') */}
      <div
        className={`
          absolute top-full left-0 w-full bg-gray-800 p-5
          flex-col items-center gap-4 transition-all duration-300 ease-in-out z-10
          md:relative md:top-auto md:left-auto md:w-auto md:bg-transparent md:p-0
          md:flex md:flex-row md:justify-center md:gap-8 md:flex-grow
          ${isMobileMenuOpen ? "flex" : "hidden"}
        `}>
        {/* Sección Central: Enlaces de Navegación (visible en escritorio, en menú móvil) */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8 md:flex-grow md:justify-center">
          {mostrarEnlacesSeccion && <NavLinks onLinkClick={handleMenuActionComplete} />}
        </div>

        {/* Sección Derecha: Botones / Perfil de Usuario y Carrito en escritorio (visible en escritorio, en menú móvil) */}
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <ShoppingCartButton isHiddenOnMobile={true} /> {/* Carrito visible solo en escritorio */}
          {isAuthenticated ? (
            <UserProfileMenu
              user={user}
              isMenuOpen={isProfileMenuOpen}
              setIsMenuOpen={setIsProfileMenuOpen}
              onLogout={handleLogout}
              onActionComplete={handleMenuActionComplete}
            />
          ) : (
            <AuthButtons onAuthAction={handleMenuActionComplete} />
          )}
        </div>
      </div>
    </nav>
  );
};
