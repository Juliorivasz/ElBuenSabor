"use client";

import type React from "react";

import type { CategoryProps } from "../types/category";
import { HorizontalScroll } from "../categoryFilter/HorizontalScroll";

export const Category: React.FC<CategoryProps> = ({ categorias, selected, onSelect }) => {
  return (
    <div className="w-full">
      {/* Desktop - Layout original */}
      <div className="hidden lg:flex gap-4 flex-wrap min-h-[120px]">
        <div
          key={0}
          className="group">
          <button
            onClick={() => onSelect("todos")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-300 cursor-pointer min-w-[100px] min-h-[80px] ${
              selected === "todos"
                ? "bg-orange-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-orange-50 hover:shadow-lg hover:scale-105"
            }`}>
            <span className="text-sm font-bold text-center max-w-[80px] overflow-hidden text-ellipsis break-words leading-tight">
              Todos
            </span>
          </button>
        </div>

        {categorias.map((categoria) => {
          const nombre = categoria.getNombre();
          const id = categoria.getIdCategoria().toString();

          return (
            <div
              key={id}
              className="group">
              <button
                onClick={() => onSelect(id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-300 cursor-pointer min-w-[100px] min-h-[80px] ${
                  selected === id
                    ? "bg-orange-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:shadow-lg hover:scale-105"
                }`}>
                <span className="text-sm font-bold text-center max-w-[80px] overflow-hidden text-ellipsis break-words leading-tight">
                  {nombre}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile & Tablet - Horizontal Scroll */}
      <div className="lg:hidden">
        <HorizontalScroll>
          <div className="flex gap-3 px-4 py-2 min-h-[80px]">
            {/* Botón "todos" */}
            <div className="flex-shrink-0">
              <button
                onClick={() => onSelect("todos")}
                className={`flex items-center justify-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer min-w-[80px] ${
                  selected === "todos"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-orange-50"
                }`}>
                <span className="text-xs font-bold text-center max-w-[64px] overflow-hidden text-ellipsis break-words leading-tight">
                  Todos
                </span>
              </button>
            </div>

            {/* Categorías */}
            {categorias.map((categoria) => {
              const nombre = categoria.getNombre();
              const id = categoria.getIdCategoria().toString();

              return (
                <div
                  key={id}
                  className="flex-shrink-0">
                  <button
                    onClick={() => onSelect(id)}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg shadow-md transition-all duration-300 cursor-pointer min-w-[80px] ${
                      selected === id
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-orange-50"
                    }`}>
                    <span className="text-xs font-bold text-center max-w-[64px] overflow-hidden text-ellipsis break-words leading-tight">
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
