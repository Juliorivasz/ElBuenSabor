import { Link } from "react-router-dom"
import { PageHeader } from "../../../components/shared/PageHeader"

export const Failure = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Pago Rechazado" />

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pago Rechazado</h2>

        <p className="text-gray-600 mb-6">
          Lo sentimos, tu pago no pudo ser procesado. Esto puede deberse a un problema con tu método de pago o a una
          interrupción temporal del servicio.
        </p>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Sugerencias:</h3>
          <ul className="text-left text-gray-600 list-disc pl-5">
            <li>Verifica que los datos de tu tarjeta sean correctos</li>
            <li>Asegúrate de tener fondos suficientes</li>
            <li>Intenta con otro método de pago</li>
            <li>Si el problema persiste, contacta a tu banco</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/cart"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
          >
            Volver al Carrito
          </Link>

          <Link
            to="/catalog"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Failure
