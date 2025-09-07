import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export const EmptyCart = () => {
  const navigate = useNavigate();

  const handleExploreCatalog = () => {
    navigate("/catalog");
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full p-8 mb-6">
        <ShoppingCartIcon className="w-16 h-16 text-gray-900" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
      <p className="text-gray-900 text-center mb-8 max-w-md">
        ¡Descubre nuestros deliciosos platos y comienza a armar tu pedido!
      </p>

      <button
        onClick={handleExploreCatalog}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow-md cursor-pointer">
        Explorar Menú
      </button>
    </div>
  );
};
