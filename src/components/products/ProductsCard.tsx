import { FC, memo } from "react";
import type { ProductCardProps } from "./types/products";

export const ProductsCard: FC<ProductCardProps> = memo(({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-transparent rounded-xl p-4 cursor-pointer hover:shadow-md relative w-full max-w-sm mx-auto transform transition-transform duration-300 hover:scale-105">
      <div className="h-40 bg-gray-300 rounded-lg mb-3 relative overflow-hidden">
        <img
          src={product.getUrl() || "/placeholder.svg"}
          alt={product.getNombre()}
          className={`w-full h-full object-cover ${product.getPuedeElaborarse() ? "" : "grayscale-100"}`}
          loading="lazy"
          decoding="async"
        />
        <span className="absolute bottom-2 left-2 bg-white text-black text-xs px-2 py-1 rounded-md shadow">
          {product.getTiempoDeCocina()} min
        </span>
        {!product.getPuedeElaborarse() && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow">
            SIN STOCK
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-black uppercase mb-1">{product.getNombre()}</h3>
      <p className="text-black text-md font-extrabold">
        ${product.getPrecioVenta().toFixed(2)} –{" "}
        <span className="text-gray-700 italic">{product.getDescripcion()}</span>
      </p>
    </div>
  );
});

ProductsCard.displayName = "ProductsCard";
