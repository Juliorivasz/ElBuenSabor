import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer className="bg-[#242424] py-4 text-center text-white font-bangers text-lg italic">
      <div className="flex items-center justify-center gap-8 mb-4">
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
          <span className="text-2xl">ElBuenSabor</span>
        </Link>
        <a
          href={isHomePage ? "#howFunction" : "/#howFunction"}
          className="no-underline">
          COMO FUNCIONA
        </a>
        <a
          href={isHomePage ? "#aboutUs" : "/#aboutUs"}
          className="no-underline">
          SOBRE NOSOTROS
        </a>
        <a
          href={isHomePage ? "#contact" : "/#contact"}
          className="no-underline">
          CONTACTANOS
        </a>
      </div>
      <hr className="border-t-2 border-white opacity-50 m-auto w-7xl text-center" />
      <div className="mt-4 text-sm opacity-85">DERECHOS RESERVADOS - EL BUEN SABOR 2025</div>
    </footer>
  );
};
