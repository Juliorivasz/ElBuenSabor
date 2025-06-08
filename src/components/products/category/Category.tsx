//
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
            <div className="bg-gray-900 rounded-full ">
              <img
                src={"/icons/cubiertos.svg"}
                alt={"todos"}
                className={`bg-white w-20 h-20 object-cover p-2 rounded-full border-4 border-orange-500 ${
                  selected === "todos" ? "border-white" : "border-orange-500"
                }`}
              />
            </div>
            <span className="text-sm font-extrabold translate-y-full text-center max-w-[80px] opacity-0 overflow-hidden text-ellipsis break-words leading-tight max-h-0 group-hover:mt-2 group-hover:p-1 group-hover:opacity-100 group-hover:max-h-10 group-hover:-translate-y-1 transition-all duration-500 ease-in-out">
              {"todos"}
            </span>
          </button>
        </div>
        {categorias.map((categoria) => {
          const nombre = categoria.getNombre();
          const imagen = categoria.getImagenDto().getUrl() || "https://placehold.co/150";
          const id = categoria.getIdCategoria().toString();

          return (
            <div
              key={id}
              className="group">
              <button
                onClick={() => onSelect(id)}
                className={`flex flex-col items-center p-2 rounded-full shadow-md transition-all duration-500 cursor-pointer overflow-hidden ${
                  selected === id ? "bg-orange-500 text-white" : "bg-white text-black"
                }`}>
                <img
                  src={imagen}
                  alt={nombre}
                  className={`bg-white w-20 h-20 object-cover p-2 rounded-full border-4 border-orange-500 ${
                    selected === id ? "border-white" : "border-orange-500"
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
              const nombre = categoria.getNombre();
              const imagen = categoria.getImagenDto().getUrl() || "https://placehold.co/150";
              const id = categoria.getIdCategoria().toString();

              return (
                <div
                  key={id}
                  className="flex-shrink-0 group">
                  <button
                    onClick={() => onSelect(id)}
                    className={`flex flex-col items-center p-2 rounded-full shadow-md transition-all duration-500 cursor-pointer overflow-hidden min-w-[80px] ${
                      selected === id ? "bg-orange-500 text-white" : "bg-white text-black"
                    }`}>
                    <img
                      src={imagen}
                      alt={nombre}
                      className={`bg-white w-16 h-16 object-cover p-2 rounded-full border-4 border-orange-500 ${
                        selected === id ? "border-white" : "border-orange-500"
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
