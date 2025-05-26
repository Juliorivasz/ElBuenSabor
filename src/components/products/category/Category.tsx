import React from "react";
import { CategoryProps } from "../types/category";

export const Category: React.FC<CategoryProps> = ({ categorias, selected, onSelect }) => {
  return (
    <div className="flex gap-4 flex-wrap min-h-[150px]">
      {categorias.map((categoria) => {
        const nombre = categoria.getcategoriaNombre();
        const imagen = categoria.getcategoriaImagen() || "https://via.placeholder.com/150";

        return (
          <div
            key={categoria.getcategoriaId()}
            className="group">
            <button
              onClick={() => onSelect(nombre)}
              className={`flex flex-col items-center p-2 rounded-full shadow-md transition-all duration-500 cursor-pointer overflow-hidden ${
                selected === nombre ? "bg-orange-500 text-white" : "bg-white text-black"
              }`}>
              <img
                src={imagen}
                alt={nombre}
                className={`bg-white w-20 h-20 object-cover p-2 rounded-full border-4 border-orange-500 ${
                  selected === nombre ? "border-white" : "border-orange-500"
                }`}
              />
              <span className="text-sm font-extrabold translate-y-full text-center max-w-[80px] opacity-0 overflow-hidden text-ellipsis break-words leading-tight max-h-0 group-hover:mt-2 group-hover:p-1 group-hover:opacity-100 group-hover:max-h-10 group-hover:-translate-y-1 transition-all duration-500 ease-in-out">
                {nombre}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
