import { useCartStore } from "../../store/cart/useCartStore"

export const CartSummary = () => {
  const { getTotalPrice, getTotalItems } = useCartStore()

  const subtotal = getTotalPrice()
  const deliveryFee = 500 // Esto podría venir del estado de delivery options
  const total = subtotal + deliveryFee

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Productos ({getTotalItems()})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Envío</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
