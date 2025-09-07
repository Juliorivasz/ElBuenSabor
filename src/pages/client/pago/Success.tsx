"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore } from "../../../store/cart/useCartStore"
import { PageHeader } from "../../../components/shared/PageHeader"

export const Success = () => {
  const { clearCart } = useCartStore()
  const navigate = useNavigate()

  // Vaciar el carrito al cargar la página
  useEffect(() => {
    clearCart()

    // Redireccionar automáticamente después de 5 segundos
    const redirectTimer = setTimeout(() => {
      navigate("/catalog")
    }, 5000)

    return () => clearTimeout(redirectTimer)
  }, [clearCart, navigate])

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="¡Pago Exitoso!" />

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Gracias por tu compra!</h2>

        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado exitosamente. Pronto recibirás un correo electrónico con los detalles de tu pedido.
        </p>

        <p className="text-sm text-gray-500 mb-8">Serás redirigido automáticamente al catálogo en 5 segundos...</p>

        <Link
          to="/catalog"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
        >
          Volver al Catálogo
        </Link>
      </div>
    </div>
  )
}

export default Success
