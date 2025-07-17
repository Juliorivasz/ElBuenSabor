"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircleOutlined, LocalShippingOutlined, ScheduleOutlined, LocationOnOutlined } from "@mui/icons-material"
import type { PedidoRepartidorDTO } from "../../models/dto/PedidoRepartidorDTO"
import { RepartidorServicio } from "../../services/repartidorServicio"
import Swal from "sweetalert2"

interface DeliveryOrderCardProps {
  pedido: PedidoRepartidorDTO
  onUpdate: () => void
}

export const DeliveryOrderCard: React.FC<DeliveryOrderCardProps> = ({ pedido, onUpdate }) => {
  const [loading, setLoading] = useState(false)
  const repartidorServicio = RepartidorServicio.getInstance()

  const formatearHora = (fechaHora: string): string => {
    const fecha = new Date(fechaHora)
    return fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatearDireccion = (): string => {
    if (!pedido.direccion) {
      return "Dirección no disponible"
    }

    const { calle, numero, piso, dpto } = pedido.direccion

    const calleStr = calle?.trim() || ""
    const numeroStr = numero?.trim() || ""

    let direccion = ""
    if (calleStr && numeroStr) {
      direccion = `${calleStr} ${numeroStr}`
    } else if (calleStr) {
      direccion = calleStr
    } else if (numeroStr) {
      direccion = `Nº ${numeroStr}`
    }

    if (piso && piso.trim() !== "" && piso.toLowerCase() !== "null") {
      direccion += `, Piso ${piso.trim()}`
    }

    if (dpto && dpto.trim() !== "" && dpto.toLowerCase() !== "null") {
      direccion += `, Dpto ${dpto.trim()}`
    }

    return direccion || "Dirección incompleta"
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "LISTO":
        return "bg-green-100 border-green-300"
      case "EN_CAMINO":
        return "bg-orange-100 border-orange-300"
      case "ENTREGADO":
        return "bg-green-100 border-green-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "LISTO":
        return "bg-green-100 text-green-800"
      case "EN_CAMINO":
        return "bg-orange-100 text-orange-800"      
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case "LISTO":
        return "Listo para Retirar"
      case "EN_CAMINO":
        return "En Camino"
      case "ENTREGADO":
        return "Entregado"
      default:
        return estado
    }
  }

  const handleMarcarEnCamino = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar retiro?",
      text: "¿Confirmas que has retirado este pedido del local?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, retirado",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setLoading(true)
      try {
        await repartidorServicio.marcarEnCamino(pedido.idPedido)
        Swal.fire({
          title: "¡Pedido retirado!",
          text: "El pedido ha sido marcado como en camino",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        onUpdate()
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo marcar el pedido como retirado",
          icon: "error",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleMarcarEntregado = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar entrega?",
      text: "¿Confirmas que has entregado este pedido al cliente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, entregado",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setLoading(true)
      try {
        await repartidorServicio.marcarEntregado(pedido.idPedido)
        Swal.fire({
          title: "¡Pedido entregado!",
          text: "El pedido ha sido marcado como entregado",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        onUpdate()
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo marcar el pedido como entregado",
          icon: "error",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-l-4 ${getEstadoColor(pedido.estadoPedido)} p-6 hover:shadow-md transition-shadow duration-200`}
    >
      {/* Header del pedido */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Pedido #{pedido.idPedido}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <ScheduleOutlined fontSize="small" />
            <span className="font-medium">Entrega: {formatearHora(pedido.horaEntrega)}</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(pedido.estadoPedido)}`}>
            {getEstadoText(pedido.estadoPedido)}
          </span>
        </div>
      </div>

      {/* Información de dirección */}
      <div className="mb-4">
        <div className="flex items-start gap-2 mb-2">
          <LocationOnOutlined className="text-gray-600 mt-0.5" fontSize="small" />
          <div>
            <p className="text-gray-800 font-medium text-sm">{formatearDireccion()}</p>
            {pedido.direccion?.nombreDepartamento && (
              <p className="text-gray-600 text-xs mt-1">{pedido.direccion.nombreDepartamento}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {pedido.estadoPedido === "LISTO" && (
          <button
            onClick={handleMarcarEnCamino}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <LocalShippingOutlined fontSize="small" />
            {loading ? "Marcando..." : "Pedido Retirado"}
          </button>
        )}

        {pedido.estadoPedido === "EN_CAMINO" && (
          <button
            onClick={handleMarcarEntregado}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-orange-400 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <CheckCircleOutlined fontSize="small" />
            {loading ? "Marcando..." : "Pedido Entregado"}
          </button>
        )}
      </div>
    </div>
  )
}
