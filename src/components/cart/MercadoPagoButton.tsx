"use client";

import { useState } from "react";
import { useCartStore } from "../../store/cart/useCartStore";
import { pagoServicio, type ItemDTO } from "../../services/pagoServicio";

interface MercadoPagoButtonProps {
  costoEnvio: number;
}

export const MercadoPagoButton = ({ costoEnvio }: MercadoPagoButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items } = useCartStore();

  const handleMercadoPagoCheckout = async () => {
    if (items.length === 0) {
      setError("No hay productos en el carrito");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convertir los items del carrito al formato esperado por el backend
      const mercadoPagoItems: ItemDTO[] = items.map((item) => ({
        title: item.articulo.getDescripcion(),
        quantity: item.quantity,
        unitPrice: item.articulo.getPrecioVenta() * (1 - (item.promocionalDiscount ?? 0)),
      }));

      // Llamar al servicio para crear la preferencia de pago
      const response = await pagoServicio.crearPreferencia(mercadoPagoItems, costoEnvio);

      // Redirigir al usuario al checkout de Mercado Pago
      window.location.href = response.init_point;
    } catch (err) {
      setError("Error al procesar el pago. Por favor, intente nuevamente.");
      console.error("Error en checkout de Mercado Pago:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
      )}

      <button
        onClick={handleMercadoPagoCheckout}
        disabled={isLoading || items.length === 0}
        className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3 disabled:bg-gray-300 disabled:cursor-not-allowed">
        {/* Ícono simple de tarjeta de crédito */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>

        {isLoading ? "Procesando..." : "Pagar con Mercado Pago"}
      </button>
    </div>
  );
};
