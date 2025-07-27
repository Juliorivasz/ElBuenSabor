import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import type { CartItem as CartItemType } from "../../store/cart/types/cart";
import { useCartStore } from "../../store/cart/useCartStore";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    removeItem(item.articulo.getIdArticulo());
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 transition-all duration-200 sm:rounded-xl sm:p-4 ${
        isRemoving ? "opacity-50 scale-95" : ""
      }`}>
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Imagen del producto - Mobile First */}
        <div className="flex-shrink-0">
          <img
            src={item.articulo.getUrl() || "/placeholder.svg?height=60&width=60"}
            alt={item.articulo.getDescripcion()}
            className="w-16 h-16 object-cover rounded-lg border border-yellow-500 sm:w-20 sm:h-20"
          />
        </div>

        {/* Información del producto - Mobile First */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate sm:text-base lg:text-lg">
            {item.articulo.getDescripcion()}
          </h3>
          <p className="text-base font-bold text-gray-900 sm:text-lg">${item.articulo.getPrecioVenta().toFixed(2)}</p>
        </div>

        {/* Controles de cantidad - Mobile First */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => decreaseQuantity(item.articulo.getIdArticulo())}
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors sm:w-10 sm:h-10">
              <RemoveIcon className="text-sm sm:text-base" />
            </button>

            <span className="w-8 text-center font-bold text-lg text-black sm:w-12 sm:text-xl">{item.quantity}</span>

            <button
              onClick={() => increaseQuantity(item.articulo.getIdArticulo())}
              className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-700 cursor-pointer flex items-center justify-center transition-colors sm:w-10 sm:h-10">
              <AddIcon className="text-sm sm:text-base" />
            </button>
          </div>

          {/* Botón eliminar - Mobile First */}
          <button
            onClick={handleRemove}
            className="w-8 h-8 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer sm:w-10 sm:h-10 sm:ml-2"
            title="Eliminar producto">
            <DeleteIcon className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};
