"use client"
import { AttachMoney, CreditCard } from "@mui/icons-material"

export type PaymentMethod = "efectivo" | "mercado_pago"

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
}

export const PaymentMethodSelector = ({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Método de Pago</h3>

      {/* Opciones de pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Efectivo */}
        <button
          onClick={() => onMethodChange("efectivo")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedMethod === "efectivo"
              ? "border-yellow-500 bg-yellow-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedMethod === "efectivo" ? "bg-yellow-100" : "bg-gray-100"}`}>
              <AttachMoney
                className={`w-6 h-6 ${selectedMethod === "efectivo" ? "text-yellow-600" : "text-gray-500"}`}
              />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Efectivo</p>
              <p className="text-sm text-gray-600">Pago al recibir</p>
            </div>
          </div>
        </button>

        {/* Mercado Pago */}
        <button
          onClick={() => onMethodChange("mercado_pago")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedMethod === "mercado_pago"
              ? "border-yellow-500 bg-yellow-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedMethod === "mercado_pago" ? "bg-yellow-100" : "bg-gray-100"}`}>
              <CreditCard
                className={`w-6 h-6 ${selectedMethod === "mercado_pago" ? "text-yellow-600" : "text-gray-500"}`}
              />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Mercado Pago</p>
              <p className="text-sm text-gray-600">Pago online</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
