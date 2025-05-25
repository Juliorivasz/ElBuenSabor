import React from "react";
import { Link } from "react-router-dom";

export const Logo: React.FC = () => (
  <Link
    to={"/"}
    className="z-20">
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
);
