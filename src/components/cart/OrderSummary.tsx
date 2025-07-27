"use client"

import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"
import { useCartStore } from "../../store/cart/useCartStore"
import type { DeliveryType } from "./DeliverySelector"
import { pedidoServicio } from "../../services/pedidoServicio"
import type { NuevoPedidoDto } from "../../models/dto/NuevoPedidoDto"

interface OrderSummaryProps {
  deliveryType: DeliveryType
  selectedAddressId?: number
  onConfirmOrder: () => void
}

export const OrderSummary = ({ deliveryType, selectedAddressId, onConfirmOrder }: OrderSummaryProps) => {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null)

  const subtotal = getTotalPrice()
  const deliveryCost = deliveryType === "delivery" ? 500 : 0
  const total = subtotal + deliveryCost
  const totalItems = getTotalItems()

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validar que hay productos en el carrito
      if (totalItems === 0) {
        setError("No hay productos en el carrito")
        return
      }

      // Validar dirección si es delivery
      if (deliveryType === "delivery" && !selectedAddressId) {
        setError("Debe seleccionar una dirección para el envío")
        return
      }

      // Obtener token de Auth0
      await getAccessTokenSilently()

      // Preparar el DTO del pedido
      const nuevoPedido: NuevoPedidoDto = {
        tipoEnvio: deliveryType === "delivery" ? "DELIVERY" : "TAKEAWAY",
        metodoDePago: "MERCADO_PAGO", // Por defecto MercadoPago, se puede hacer configurable
        detalles: items.map((item) => ({
          idArticulo: item.articulo.getIdArticulo(),
          cantidad: item.quantity,
        })),
      }

      // Agregar dirección solo si es delivery
      if (deliveryType === "delivery" && selectedAddressId) {
        nuevoPedido.idDireccion = selectedAddressId
      }

      // Crear el pedido en el backend
      const pedidoResponse = await pedidoServicio.crearPedido(nuevoPedido)

      // Limpiar el carrito
      clearCart()

      // Guardar el ID del pedido creado
      setCreatedOrderId(pedidoResponse.idPedido)
      setIsOrderConfirmed(true)

      // Llamar al callback del componente padre
      onConfirmOrder()
    } catch (error) {
      console.error("Error al confirmar pedido:", error)
      setError("Error al confirmar el pedido. Por favor, intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentRedirect = () => {
    if (createdOrderId) {
      // Redirigir según el método de pago
      // Por ahora solo MercadoPago, pero se puede extender
      navigate(`/pago/${createdOrderId}`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h3>

      {/* Lista de productos con subtotales */}
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const itemSubtotal = item.articulo.getPrecioVenta() * item.quantity
          return (
            <div key={item.articulo.getIdArticulo()} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.articulo.getDescripcion()} x{item.quantity}
              </span>
              <span className="font-medium text-gray-900">${itemSubtotal.toFixed(2)}</span>
            </div>
          )
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

      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Botones condicionales */}
      {!isOrderConfirmed ? (
        <button
          onClick={handleConfirmOrder}
          disabled={totalItems === 0 || isLoading || (deliveryType === "delivery" && !selectedAddressId)}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-sm hover:shadow-md"
        >
          {isLoading ? "Confirmando..." : "Confirmar Pedido"}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="text-center text-green-600 font-medium">¡Pedido confirmado! Pedido #{createdOrderId}</div>
          <div className="text-center text-sm text-gray-600 mb-3">Procede con el pago para completar tu orden:</div>
          <button
            onClick={handlePaymentRedirect}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-sm hover:shadow-md"
          >
            Proceder al Pago
          </button>
        </div>
      )}
    </div>
  )
}
