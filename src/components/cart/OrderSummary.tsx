import { useCartStore } from "../../store/cart/useCartStore";
import type { DeliveryType } from "./DeliverySelector";

interface OrderSummaryProps {
  deliveryType: DeliveryType;
  onConfirmOrder: () => void;
}

export const OrderSummary = ({ deliveryType, onConfirmOrder }: OrderSummaryProps) => {
  const { items, getTotalPrice, getTotalItems } = useCartStore();

  const subtotal = getTotalPrice();
  const deliveryCost = deliveryType === "delivery" ? 500 : 0;
  const total = subtotal + deliveryCost;
  const totalItems = getTotalItems();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h3>

      {/* Lista de productos con subtotales */}
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const itemSubtotal = item.articulo.getPrecioVenta() * item.quantity;
          return (
            <div
              key={item.articulo.getIdArticulo()}
              className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.articulo.getDescripcion()} x{item.quantity}
              </span>
              <span className="font-medium text-gray-900">${itemSubtotal.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      <hr className="border-gray-200 mb-4" />

      {/* Resumen de costos */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({totalItems} {totalItems === 1 ? "producto" : "productos"})
          </span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {/* Solo mostrar costo de envío si es delivery */}
        {deliveryType === "delivery" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Costo de envío</span>
            <span className="font-medium text-gray-900">${deliveryCost.toFixed(2)}</span>
          </div>
        )}

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-yellow-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Botón confirmar pedido */}
      <button
        onClick={onConfirmOrder}
        disabled={totalItems === 0}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-sm hover:shadow-md">
        Confirmar Pedido
      </button>
    </div>
  );
};
