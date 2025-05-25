// src/components/navbar/NavLinks.tsx
import React from "react";

interface NavLinksProps {
  onLinkClick: () => void; // Función para cerrar el menú móvil
}

export const NavLinks: React.FC<NavLinksProps> = ({ onLinkClick }) => (
  <>
    <a
      href="#howFunction"
      className="text-white font-bangers text-xl no-underline italic py-2 md:py-0"
      onClick={onLinkClick}>
      COMO FUNCIONA
    </a>
    <a
      href="#aboutUs"
      className="text-white font-bangers text-xl no-underline italic py-2 md:py-0"
      onClick={onLinkClick}>
      SOBRE NOSOTROS
    </a>
    <a
      href="#contact"
      className="text-white font-bangers text-xl no-underline italic py-2 md:py-0"
      onClick={onLinkClick}>
      CONTACTANOS
    </a>
  </>
);
