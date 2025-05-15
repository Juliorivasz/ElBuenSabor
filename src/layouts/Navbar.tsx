import type React from "react";
import { Link, useLocation } from "react-router-dom";

export const NavBar: React.FC = () => {
  const location = useLocation();

  // Array de rutas en las que quieres ocultar los enlaces de sección
  const rutasOcultar = ["/register", "/login", "/catalog"];

  // Comprueba si la ruta actual está en el array de rutas a ocultar
  const mostrarEnlacesSeccion = !rutasOcultar.includes(location.pathname);

  return (
    <nav className="navbar-dark flex items-center justify-between py-2 px-5 w-full box-border">
      {/* Logo section */}
      <Link to={"/"}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden">
            <img
              src="/Logo.webp"
              alt="ElBuenSabor"
            />
          </div>
          <span className="text-white font-bangers text-2xl italic">Inicio</span>
        </div>
      </Link>

      {/* Navigation links - centered */}
      <div className="flex justify-center gap-8">
        {mostrarEnlacesSeccion && (
          <>
            <a
              href="#howFunction"
              className="text-white font-bangers text-xl no-underline italic">
              COMO FUNCIONA
            </a>
            <a
              href="#aboutUs"
              className="text-white font-bangers text-xl no-underline italic">
              SOBRE NOSOTROS
            </a>
            <a
              href="#contact"
              className="text-white font-bangers text-xl no-underline italic">
              CONTACTANOS
            </a>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/register"
          className="register-btn">
          REGISTRATE
        </Link>
        <Link
          to="/login"
          className="bg-red-600 text-white rounded-full px-5 py-1 font-bangers text-lg no-underline italic">
          INGRESAR
        </Link>
      </div>
    </nav>
  );
};
