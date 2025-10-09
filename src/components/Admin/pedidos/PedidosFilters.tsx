"use client"

import type React from "react"
import { EstadoPedido } from "../../../models/enum/EstadoPedido"
import { Search } from "@mui/icons-material"

interface PedidosFiltersProps {
  estadoSeleccionado: string
  onEstadoChange: (estado: string) => void
  onRefresh: () => void
  refreshing?: boolean
  searchTerm: string
  onSearchChange: (search: string) => void
  tipoEnvioSeleccionado: string
  onTipoEnvioChange: (tipo: string) => void
}

export const PedidosFilters: React.FC<PedidosFiltersProps> = ({
  estadoSeleccionado,
  onEstadoChange,
  searchTerm,
  onSearchChange,
  tipoEnvioSeleccionado,
  onTipoEnvioChange,
}) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case EstadoPedido.LISTO:
        return "bg-green-200 text-green-800 border-green-300"
      case EstadoPedido.A_CONFIRMAR:
        return "bg-blue-200 text-blue-800 border-blue-300"
      case EstadoPedido.CANCELADO:
        return "bg-red-200 text-red-800 border-red-300"
      case EstadoPedido.RECHAZADO:
        return "bg-red-200 text-red-800 border-red-300"
      case EstadoPedido.EN_PREPARACION:
        return "bg-yellow-200 text-yellow-800 border-yellow-300"
      case EstadoPedido.EN_CAMINO:
        return "bg-orange-200 text-orange-800 border-orange-300"
      case EstadoPedido.ENTREGADO:
        return "bg-green-300 text-green-900 border-green-400"
      default:
        return "bg-gray-200 text-gray-800 border-gray-300"
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case EstadoPedido.LISTO:
        return "Listo"
      case EstadoPedido.A_CONFIRMAR:
        return "A Confirmar"
      case EstadoPedido.CANCELADO:
        return "Cancelado"
      case EstadoPedido.RECHAZADO:
        return "Rechazado"
      case EstadoPedido.EN_PREPARACION:
        return "En Preparación"
      case EstadoPedido.EN_CAMINO:
        return "En Camino"
      case EstadoPedido.ENTREGADO:
        return "Entregado"
      case "TODOS":
        return "Todos"
      default:
        return estado
    }
  }

  const estados = ["TODOS", ...Object.values(EstadoPedido)]
  const tiposEnvio = ["TODOS", "DELIVERY", "RETIRO"]

  const handleEstadoClick = (estado: string) => {
    onEstadoChange(estado)
  }

  const handleTipoEnvioClick = (tipo: string) => {
    onTipoEnvioChange(tipo)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 space-y-4 text-black">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Buscar Pedido</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente, fecha, hora, precio o artículo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Filtrar por Tipo de Envío</h3>
        <div className="flex flex-wrap gap-2">
          {tiposEnvio.map((tipo) => {
            const isSelected = tipoEnvioSeleccionado === tipo
            const baseClasses =
              "px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 cursor-pointer select-none"
            const selectedClasses = isSelected
              ? "bg-purple-200 text-purple-800 border-purple-300 transform -translate-y-1 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"

            return (
              <div
                key={tipo}
                onClick={() => handleTipoEnvioClick(tipo)}
                className={`${baseClasses} ${selectedClasses}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleTipoEnvioClick(tipo)
                  }
                }}
              >
                {tipo === "TODOS" ? "Todos" : tipo === "DELIVERY" ? "Delivery" : "Retiro en Local"}
              </div>
            )
          })}
        </div>
      </div>

      {/* Existing estado filter */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Filtrar por Estado</h3>
        <div className="flex flex-wrap gap-2">
          {estados.map((estado) => {
            const isSelected = estadoSeleccionado === estado
            const baseClasses =
              "px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 cursor-pointer select-none"
            const selectedClasses = isSelected
              ? `${getEstadoColor(estado)} transform -translate-y-1 shadow-md`
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"

            return (
              <div
                key={estado}
                onClick={() => handleEstadoClick(estado)}
                className={`${baseClasses} ${selectedClasses}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleEstadoClick(estado)
                  }
                }}
              >
                {getEstadoText(estado)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
