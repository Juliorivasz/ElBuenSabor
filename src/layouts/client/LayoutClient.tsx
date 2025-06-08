import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useEffect } from "react";

export const LayoutClient = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  // Páginas donde debe aparecer el footer
  const pagesWithFooter = [
    "/", // Landing
    "/about", // Sobre Nosotros
    "/contact", // Contacto
    "/delivery", // Delivery
    "/help", // Soporte/Ayuda
    "/faq", // FAQ
    "/terms", // Términos
    "/privacy", // Privacidad
    "/cookies", // Cookies
  ];

  // Verificar si la página actual debe mostrar el footer
  const shouldShowFooter = pagesWithFooter.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};
