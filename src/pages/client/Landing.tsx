import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Home } from "./Home";
import { HowFunction } from "./HowFunction";
import { AboutUs } from "./AboutUs";
import { Contact } from "./Contact";

export function Landing() {
  const location = useLocation();
  const topRef = useRef<HTMLDivElement>(null); //referencia al inicio

  useEffect(() => {
    const { hash } = location;

    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    } else if (location.pathname === "/") {
      // Desplazar al inicio al cargar la página principal sin hash
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <main
      className="bg-transparent text-black"
      ref={topRef}>
      {/* Asignamos la referencia al div principal */}
      <Home />
      <HowFunction />
      <AboutUs />
      <Contact />
    </main>
  );
}
