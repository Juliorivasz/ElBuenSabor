import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, animate } from "framer-motion";

export const NotFound = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const notFoundText = "404";
  const pageNotFoundText = "Página no encontrada";
  const notFoundRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (mainContentRef.current && buttonRef.current && notFoundRef.current) {
      animate(mainContentRef.current, { opacity: 1, y: 0 }, { duration: 0.6, ease: "easeOut" });
      animate(buttonRef.current, { opacity: 1, y: 0 }, { duration: 0.6, delay: 0.3, ease: "easeOut" });

      // Animación de "caída" y rebote del "404"
      animate(
        notFoundRef.current,
        {
          y: [-100, 0, -20, 0],
          opacity: [0, 1, 1, 1],
          scale: [0.8, 1.1, 0.9, 1],
        },
        {
          duration: 1.2,
          ease: [0.17, 0.67, 0.83, 0.67], // Un easing con un ligero rebote
        },
      );
    }
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[90vh] bg-orange-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      <motion.div
        ref={mainContentRef}
        className="flex flex-col items-center opacity-0 translate-y-10">
        <motion.h1
          ref={notFoundRef}
          className="text-orange-600 font-extrabold text-9xl sm:text-[12rem] opacity-0 scale-90">
          {notFoundText}
        </motion.h1>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 text-center mb-4">{pageNotFoundText}</h1>
        <motion.button
          ref={buttonRef}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-md opacity-0">
          <Link
            to="/"
            className="text-white no-underline">
            Volver al Inicio
          </Link>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
