import { Link, useLocation } from "react-router-dom";
import React from "react"; // Importar React explícitamente

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer className="bg-[#242424] py-4 text-center text-white font-bangers text-lg italic">
      <div className="flex flex-col items-center gap-4 mb-4 md:flex-row md:justify-center md:gap-8">
        <Link
          to={"/"}
          className="flex items-center gap-2 no-underline text-white">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="Logo.webp"
              alt="elBuenSabor"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl md:text-2xl">ElBuenSabor</span>
        </Link>

        {/* Sección de Enlaces de Navegación */}
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-8">
          {" "}
          {/* Contenedor para los enlaces */}
          <a
            href={isHomePage ? "#howFunction" : "/#howFunction"}
            className="no-underline text-white hover:text-gray-300 transition-colors duration-200">
            COMO FUNCIONA
          </a>
          <a
            href={isHomePage ? "#aboutUs" : "/#aboutUs"}
            className="no-underline text-white hover:text-gray-300 transition-colors duration-200">
            SOBRE NOSOTROS
          </a>
          <a
            href={isHomePage ? "#contact" : "/#contact"}
            className="no-underline text-white hover:text-gray-300 transition-colors duration-200">
            CONTACTANOS
          </a>
        </div>
      </div>
      <hr className="border-t-2 border-white opacity-50 mx-auto w-11/12 md:w-7xl" />
      <div className="mt-4 text-sm opacity-85">DERECHOS RESERVADOS - EL BUEN SABOR 2025</div>
    </footer>
  );
};
