"use client"

import type React from "react"
import type { InsumoAbmDto } from "../../models/dto/InsumoAbmDto"

interface InsumoDetailsModalProps {
  insumo: InsumoAbmDto
  onClose: () => void
}

export const InsumoDetailsModal: React.FC<InsumoDetailsModalProps> = ({ insumo, onClose }) => {
  if (!insumo) {
    return null
  }

  const stockPercentage = insumo.getStockPercentage()

  // Determinar el color de la barra según el porcentaje
  const getBarColor = (percentage: number) => {
    if (percentage <= 25) return "bg-red-500"
    if (percentage <= 50) return "bg-orange-500"
    if (percentage <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStockStatus = () => {
    const percentage = insumo.getStockPercentage()
    if (percentage <= 25) {
      return { text: "Crítico", color: "text-red-600 bg-red-50" }
    }
    if (percentage <= 50) {
      return { text: "Bajo", color: "text-orange-600 bg-orange-50" }
    }
    if (percentage <= 75) {
      return { text: "Normal", color: "text-yellow-600 bg-yellow-50" }
    }
    return { text: "Óptimo", color: "text-green-600 bg-green-50" }
  }

  const stockStatus = getStockStatus()

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{insumo.getNombre()}</h3>
            <p className="text-sm text-gray-500 mt-1">Insumo • ID: {insumo.getIdArticuloInsumo()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Rubro</span>
                <p className="text-gray-900 mt-1">{insumo.getNombreRubro()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Unidad de Medida</span>
                <p className="text-gray-900 mt-1">{insumo.getUnidadDeMedida()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Costo</span>
                <p className="text-2xl font-bold text-green-600 mt-1">${insumo.getCosto().toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Estado</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      insumo.isDadoDeAlta() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${insumo.isDadoDeAlta() ? "bg-green-400" : "bg-red-400"}`}
                    />
                    {insumo.isDadoDeAlta() ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Estado del Stock</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}
                  >
                    {stockStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información de stock */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Stock</h4>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Stock Mínimo</p>
                <p className="text-lg font-semibold text-gray-900">{insumo.getStockMinimo()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Stock Actual</p>
                <p className="text-lg font-semibold text-gray-900">{insumo.getStockActual()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Stock Máximo</p>
                <p className="text-lg font-semibold text-gray-900">{insumo.getStockMaximo()}</p>
              </div>
            </div>

            {/* Barra de progreso del stock */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Nivel de Stock</span>
                <span>{stockPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-300 ${getBarColor(stockPercentage)}`}
                  style={{ width: `${Math.max(5, stockPercentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mínimo</span>
                <span>Máximo</span>
              </div>
            </div>

            {/* Indicadores visuales */}
            <div className="mt-4 flex justify-center space-x-6 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span className="text-gray-700">0-25% (Crítico)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                <span className="text-gray-700">26-50% (Bajo)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span className="text-gray-700">51-75% (Normal)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-700">76-100% (Óptimo)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
