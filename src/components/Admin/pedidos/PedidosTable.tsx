"use client"

import React from "react"

import { Visibility, DeliveryDining, Store } from "@mui/icons-material"
import type { PedidoDTO } from "../../../models/dto/PedidoDTO"
import { EstadoPedido } from "../../../models/enum/EstadoPedido"

interface PedidosTableProps {
  pedidos: PedidoDTO[]
  onVerDetalles: (pedido: PedidoDTO) => void
  indiceDivision?: number
}

export const PedidosTable: React.FC<PedidosTableProps> = ({ pedidos, onVerDetalles, indiceDivision = -1 }) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case EstadoPedido.LISTO:
        return "bg-green-100 border-green-300"
      case EstadoPedido.A_CONFIRMAR:
        return "bg-blue-100 border-blue-300"
      case EstadoPedido.CANCELADO:
        return "bg-red-100 border-red-300"
      case EstadoPedido.RECHAZADO:
        return "bg-purple-100 border-purple-300"
      case EstadoPedido.EN_PREPARACION:
        return "bg-yellow-100 border-yellow-300"
      case EstadoPedido.EN_CAMINO:
        return "bg-orange-100 border-orange-300"
      case EstadoPedido.ENTREGADO:
        return "bg-green-200 border-green-400"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case EstadoPedido.LISTO:
        return "bg-green-100 text-green-800"
      case EstadoPedido.A_CONFIRMAR:
        return "bg-blue-100 text-blue-800"
      case EstadoPedido.CANCELADO:
        return "bg-red-100 text-red-800"
      case EstadoPedido.RECHAZADO:
        return "bg-purple-100 text-purple-800"
      case EstadoPedido.EN_PREPARACION:
        return "bg-yellow-100 text-yellow-800"
      case EstadoPedido.EN_CAMINO:
        return "bg-orange-100 text-orange-800"
      case EstadoPedido.ENTREGADO:
        return "bg-green-200 text-green-900"
      default:
        return "bg-gray-100 text-gray-800"
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
      default:
        return estado
    }
  }

  const formatFecha = (fechaHora: string) => {
    const fecha = new Date(fechaHora)
    return fecha.toLocaleDateString("es-ES")
  }

  const formatHora = (fechaHora: string) => {
    const fecha = new Date(fechaHora)
    return fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const calcularTotal = (detalles: any[]) => {
    return detalles.reduce((total, detalle) => total + detalle.subtotal, 0)
  }

  const getDeliveryIcon = (tipoEnvio: string) => {
    if (tipoEnvio.toLowerCase().includes("delivery") || tipoEnvio.toLowerCase().includes("envio")) {
      return <DeliveryDining className="text-gray-800" />
    } else {
      return <Store className="text-gray-800" />
    }
  }

  if (pedidos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-lg">No se encontraron pedidos</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo Envío
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pedidos.map((pedido, index) => (
              <React.Fragment key={pedido.idPedido}>
                <tr
                  className={`${getEstadoColor(pedido.estadoPedido)} border-l-4 hover:bg-opacity-80 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pedido.idPedido}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFecha(pedido.fechaYHora)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatHora(pedido.fechaYHora)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadgeColor(pedido.estadoPedido)}`}
                    >
                      {getEstadoText(pedido.estadoPedido)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {getDeliveryIcon(pedido.tipoEnvio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${calcularTotal(pedido.detalles)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pedido.emailCliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onVerDetalles(pedido)}
                      className="text-gray-800 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                      title="Ver detalles"
                    >
                      <Visibility />
                    </button>
                  </td>
                </tr>
                {/* Línea divisoria después del último pedido A_CONFIRMAR */}
                {index === indiceDivision && (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <div className="border-t-4 border-black"></div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
