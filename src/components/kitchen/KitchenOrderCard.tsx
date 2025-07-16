"use client"

import type React from "react"
import { useState } from "react"
import {
  CheckCircleOutlined,
  DeliveryDiningOutlined,
  StorefrontOutlined,
  ReceiptOutlined,
  ScheduleOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material"
import type { PedidoCocineroDTO } from "../../models/dto/PedidoCocineroDTO"
import { EstadoPedido } from "../../models/enum/EstadoPedido"
import { cocineroServicio } from "../../services/cocineroServicio"
import Swal from "sweetalert2"

interface KitchenOrderCardProps {
  pedido: PedidoCocineroDTO
  onPedidoActualizado: () => void
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ pedido, onPedidoActualizado }) => {
  const [loading, setLoading] = useState(false)
  const [extendiendo, setExtendiendo] = useState(false)

  const calcularHoraEntrega = (horaEntrega: string, tipoEnvio: string) => {
    const fecha = new Date(horaEntrega)

    // Si es delivery, restar 15 minutos
    if (tipoEnvio.toLowerCase().includes("delivery") || tipoEnvio.toLowerCase().includes("envio")) {
      fecha.setMinutes(fecha.getMinutes() - 15)
    }

    return fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const getDeliveryIcon = (tipoEnvio: string) => {
    if (tipoEnvio.toLowerCase().includes("delivery") || tipoEnvio.toLowerCase().includes("envio")) {
      return <DeliveryDiningOutlined className="text-gray-800" />
    } else {
      return <StorefrontOutlined className="text-gray-800" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case EstadoPedido.EN_PREPARACION:
        return "bg-white-100 border-yellow-300"
      case EstadoPedido.LISTO:
        return "bg-white-100 border-green-300"
      default:
        return "bg-white-100 border-gray-300"
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case EstadoPedido.EN_PREPARACION:
        return "bg-yellow-100 text-yellow-800"
      case EstadoPedido.LISTO:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatHora = (fechaHora: string) => {
    const fecha = new Date(fechaHora)
    return fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const handleMarcarListo = async () => {
    const result = await Swal.fire({
      title: "¿Marcar como listo?",
      text: `¿Estás seguro de que el pedido #${pedido.idPedido} está listo?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, está listo",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setLoading(true)
      try {
        await cocineroServicio.marcarPedidoListo(pedido.idPedido)
        Swal.fire({
          title: "¡Pedido listo!",
          text: "El pedido ha sido marcado como listo.",
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        })
        onPedidoActualizado()
      } catch (error) {
        console.error("Error al marcar pedido como listo:", error)
        Swal.fire({
          title: "Error",
          text: "No se pudo marcar el pedido como listo. Intenta nuevamente.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleExtenderTiempo = async () => {
    const result = await Swal.fire({
      title: "¿Extender tiempo?",
      text: `¿Deseas extender el tiempo de entrega del pedido #${pedido.idPedido} en 5 minutos?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, extender",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setExtendiendo(true)
      try {
        await cocineroServicio.extenderHorarioEntrega(pedido.idPedido)
        Swal.fire({
          title: "¡Tiempo extendido!",
          text: "El horario de entrega ha sido extendido en 5 minutos.",
          icon: "success",
          confirmButtonColor: "#ef4444",
          timer: 2000,
          showConfirmButton: false,
        })
        onPedidoActualizado()
      } catch (error) {
        console.error("Error al extender horario:", error)
        Swal.fire({
          title: "Error",
          text: "No se pudo extender el horario. Intenta nuevamente.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      } finally {
        setExtendiendo(false)
      }
    }
  }

  const horaEntregaCalculada = calcularHoraEntrega(pedido.horaEntrega, pedido.tipoEnvio)

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-l-4 ${getEstadoColor(pedido.estadoPedido)} p-6 hover:shadow-md transition-shadow duration-200`}
    >
      {/* Header del pedido */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Pedido #{pedido.idPedido}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ScheduleOutlined fontSize="small" />
              <span className="font-medium">Entrega: {formatHora(pedido.horaEntrega)}</span>
            </div>
            <div className="flex items-center gap-1">{getDeliveryIcon(pedido.tipoEnvio)}</div>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(pedido.estadoPedido)}`}>
            {pedido.estadoPedido === EstadoPedido.EN_PREPARACION ? "En Preparación" : "Listo"}
          </span>
        </div>
      </div>

      {/* Detalles del pedido */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <ReceiptOutlined className="mr-2 text-gray-600" fontSize="small" />
          Productos
        </h4>
        <div className="space-y-2">
          {pedido.detalles.map((detalle, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">{detalle.cantidad}x</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 text-sm">{detalle.nombreArticulo}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {/* Botón extender tiempo - solo para pedidos en preparación */}
        {pedido.estadoPedido === EstadoPedido.EN_PREPARACION && (
          <button
            onClick={handleExtenderTiempo}
            disabled={extendiendo}
            className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <AccessTimeOutlined className="mr-1" fontSize="small" />
            {extendiendo ? "Extendiendo..." : "+5 min"}
          </button>
        )}

        {/* Botón marcar como listo - solo para pedidos en preparación */}
        {pedido.estadoPedido === EstadoPedido.EN_PREPARACION && (
          <button
            onClick={handleMarcarListo}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <CheckCircleOutlined className="mr-1" fontSize="small" />
            {loading ? "Marcando..." : "Marcar como Listo"}
          </button>
        )}
      </div>
    </div>
  )
}
