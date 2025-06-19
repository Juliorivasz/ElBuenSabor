import { Link } from "react-router-dom"
import { PageHeader } from "../../../components/shared/PageHeader"

export const Pending = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Pago Pendiente" />

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu pago está pendiente</h2>

        <p className="text-gray-600 mb-6">
          Hemos recibido tu solicitud de pago, pero aún está en proceso de verificación. Te notificaremos cuando se
          confirme el pago.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Puedes verificar el estado de tu pedido en la sección "Mis Pedidos" de tu perfil.
        </p>

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

export default Pending
