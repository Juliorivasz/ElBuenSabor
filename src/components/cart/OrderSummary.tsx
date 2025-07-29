"use client";

import { useState } from "react";
import { useCartStore } from "../../store/cart/useCartStore";
import type { DeliveryType } from "./DeliverySelector";
import type { PaymentMethod } from "./PaymentMethodSelector";
import type { Direccion } from "../../models/Direccion";
import { MercadoPagoButton } from "./MercadoPagoButton";
import { pedidoServicio, type NuevoPedidoRequest } from "../../services/pedidoServicio";
import { TipoEnvio } from "../../models/enum/TipoEnvio";
import { MetodoDePago } from "../../models/enum/MetodoDePago";

interface OrderSummaryProps {
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  selectedAddress?: Direccion;
  onConfirmOrder: () => void;
}

export const OrderSummary = ({ deliveryType, paymentMethod, selectedAddress, onConfirmOrder }: OrderSummaryProps) => {
  const { items, getTotalPrice, getTotalItems, clearCart, isPromocionalDiscount } = useCartStore();
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryCost = deliveryType === "delivery" ? 2000 : 0;
  const total = subtotal + deliveryCost;
  const totalItems = getTotalItems();

  // Validar si se puede confirmar el pedido
  const canConfirmOrder = () => {
    if (totalItems === 0) return false;
    if (deliveryType === "delivery" && !selectedAddress) return false;
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!canConfirmOrder() || isProcessing) return;

    // Si es Mercado Pago, solo confirmar y mostrar botón de pago
    if (paymentMethod === "mercado_pago") {
      try {
        const nuevoPedido: NuevoPedidoRequest = {
          tipoEnvio: deliveryType === "delivery" ? TipoEnvio.DELIVERY : TipoEnvio.RETIRO_EN_LOCAL,
          metodoDePago: MetodoDePago.MERCADO_PAGO,
          idDireccion: deliveryType === "delivery" && selectedAddress ? selectedAddress.idDireccion : null,
          detalles: items.map((item) => ({
            idArticulo: item.articulo.getIdArticulo(),
            cantidad: item.quantity,
          })),
        };

        await pedidoServicio.crearNuevoPedido(nuevoPedido);

        // Limpiar carrito y confirmar pedido
        onConfirmOrder();
        setIsOrderConfirmed(true);
      } catch (error) {
        console.error("Error al crear el pedido:", error);
        alert("Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Si es efectivo, crear el pedido
    setIsProcessing(true);

    try {
      const nuevoPedido: NuevoPedidoRequest = {
        tipoEnvio: deliveryType === "delivery" ? TipoEnvio.DELIVERY : TipoEnvio.RETIRO_EN_LOCAL,
        metodoDePago: MetodoDePago.EFECTIVO,
        idDireccion: deliveryType === "delivery" && selectedAddress ? selectedAddress.idDireccion : null,
        detalles: items.map((item) => ({
          idArticulo: item.articulo.getIdArticulo(),
          cantidad: item.quantity,
        })),
      };

      await pedidoServicio.crearNuevoPedido(nuevoPedido);

      // Limpiar carrito y confirmar pedido
      clearCart();
      onConfirmOrder();
      setIsOrderConfirmed(true);

      alert("¡Pedido creado exitosamente! Gracias por tu compra.");
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      alert("Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h3>

      {/* Lista de productos con subtotales */}
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const itemSubtotal = item.articulo.getPrecioVenta() * item.quantity * (1 - (item.promocionalDiscount ?? 0));
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

      {isPromocionalDiscount() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-800 text-sm font-medium">¡Descuento aplicado!</p>
        </div>
      )}

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

      {/* Mensaje de validación para delivery sin dirección */}
      {deliveryType === "delivery" && !selectedAddress && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">Debes seleccionar una dirección de entrega para continuar</p>
        </div>
      )}

      {/* Botones condicionales */}
      {!isOrderConfirmed ? (
        <button
          onClick={handleConfirmOrder}
          disabled={!canConfirmOrder() || isProcessing}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-sm hover:shadow-md">
          {isProcessing ? "Procesando..." : "Confirmar Pedido"}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="text-center text-green-600 font-medium">
            {paymentMethod === "efectivo"
              ? "¡Pedido confirmado! Pagarás al recibir tu pedido."
              : "¡Pedido confirmado! Procede con el pago:"}
          </div>
          {paymentMethod === "mercado_pago" && <MercadoPagoButton costoEnvio={deliveryCost} />}
        </div>
      )}
    </div>
  );
};
