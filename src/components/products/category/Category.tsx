"use client";

import type React from "react";
import type { CategoryProps } from "../types/category";
import { HorizontalScroll } from "../categoryFilter/HorizontalScroll";

export const Category: React.FC<CategoryProps> = ({ categorias, selected, onSelect }) => {
  return (
    <div className="w-full">
      {/* Desktop - Layout original */}
      <div className="hidden lg:flex gap-4 flex-wrap min-h-[150px]">
        <div
          key={0}
          className="group">
          <button
            onClick={() => onSelect("todos")}
            className={`flex flex-col items-center p-2 rounded-full shadow-md transition-all duration-500 cursor-pointer overflow-hidden ${
              selected === "todos" ? "bg-orange-500 text-white" : "bg-white text-black"
            }`}>
            <img
              src={"/icons/cubiertos.svg"}
              alt={"todos"}
              className={`bg-white w-20 h-20 object-cover p-2 rounded-full border-4 border-orange-500 ${
                selected === "todos" ? "border-white" : "border-orange-500"
              }`}
            />
            <span className="text-sm font-extrabold translate-y-full text-center max-w-[80px] opacity-0 overflow-hidden text-ellipsis break-words leading-tight max-h-0 group-hover:mt-2 group-hover:p-1 group-hover:opacity-100 group-hover:max-h-10 group-hover:-translate-y-1 transition-all duration-500 ease-in-out">
              {"todos"}
            </span>
          </button>
        </div>
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
                  src={imagen || "/placeholder.svg"}
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

      {/* Mobile & Tablet - Horizontal Scroll como subcategorías */}
      <div className="lg:hidden">
        <HorizontalScroll>
          <div className="flex gap-3 px-4 py-2 min-h-[120px]">
            {/* Botón "todos" */}
            <div className="flex-shrink-0 group">
              <button
                onClick={() => onSelect("todos")}
                className={`flex flex-col items-center p-2 rounded-full shadow-md transition-all duration-500 cursor-pointer overflow-hidden min-w-[80px] ${
                  selected === "todos" ? "bg-orange-500 text-white" : "bg-white text-black"
                }`}>
                <img
                  src={"/icons/cubiertos.svg"}
                  alt={"todos"}
                  className={`bg-white w-16 h-16 object-cover p-2 rounded-full border-4 border-orange-500 ${
                    selected === "todos" ? "border-white" : "border-orange-500"
                  }`}
                />
                <span className="text-xs font-extrabold translate-y-full text-center max-w-[64px] opacity-0 overflow-hidden text-ellipsis break-words leading-tight max-h-0 group-hover:mt-1 group-hover:p-1 group-hover:opacity-100 group-hover:max-h-8 group-hover:-translate-y-1 transition-all duration-500 ease-in-out">
                  {"todos"}
                </span>
              </button>
            </div>

            {/* Categorías */}
            {categorias.map((categoria) => {
              const nombre = categoria.getcategoriaNombre();
              const imagen = categoria.getcategoriaImagen() || "https://via.placeholder.com/150";

              return (
                <div
                  key={categoria.getcategoriaId()}
                  className="flex-shrink-0 group">
                  <button
                    onClick={() => onSelect(nombre)}
                    className={`flex flex-col items-center p-2 rounded-full shadow-md transition-all duration-500 cursor-pointer overflow-hidden min-w-[80px] ${
                      selected === nombre ? "bg-orange-500 text-white" : "bg-white text-black"
                    }`}>
                    <img
                      src={imagen || "/placeholder.svg"}
                      alt={nombre}
                      className={`bg-white w-16 h-16 object-cover p-2 rounded-full border-4 border-orange-500 ${
                        selected === nombre ? "border-white" : "border-orange-500"
                      }`}
                    />
                    <span className="text-xs font-extrabold translate-y-full text-center max-w-[64px] opacity-0 overflow-hidden text-ellipsis break-words leading-tight max-h-0 group-hover:mt-1 group-hover:p-1 group-hover:opacity-100 group-hover:max-h-8 group-hover:-translate-y-1 transition-all duration-500 ease-in-out">
                      {nombre}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </HorizontalScroll>
      </div>
    </div>
  );
};
