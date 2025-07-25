"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  CloseOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  ReceiptOutlined,
  LocalShippingOutlined,
  RestaurantOutlined,
  PaymentOutlined,
  EmailOutlined,
  CheckOutlined,
} from "@mui/icons-material"
import type { PedidoDTO } from "../../../models/dto/PedidoDTO"
import { EstadoPedido } from "../../../models/enum/EstadoPedido"
import { pedidoServicio } from "../../../services/pedidoServicio"
import Swal from "sweetalert2"

interface PedidoDetailModalProps {
  pedido: PedidoDTO | null
  isOpen: boolean
  onClose: () => void
  onPedidoActualizado: () => void
}

export const PedidoDetailModal: React.FC<PedidoDetailModalProps> = ({
  pedido,
  isOpen,
  onClose,
  onPedidoActualizado,
}) => {
  const [loading, setLoading] = useState(false)
  const [generatingInvoice, setGeneratingInvoice] = useState(false)

  if (!isOpen || !pedido) return null

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case EstadoPedido.LISTO:
        return "bg-green-100 text-green-800 border-green-200"
      case EstadoPedido.A_CONFIRMAR:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case EstadoPedido.CANCELADO:
        return "bg-red-100 text-red-800 border-red-200"
      case EstadoPedido.RECHAZADO:
        return "bg-purple-100 text-purple-800 border-purple-200"
      case EstadoPedido.EN_PREPARACION:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case EstadoPedido.EN_CAMINO:
        return "bg-orange-100 text-orange-800 border-orange-200"
      case EstadoPedido.ENTREGADO:
        return "bg-green-200 text-green-900 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const formatFechaHora = (fechaHora: string) => {
    const fecha = new Date(fechaHora)
    return fecha.toLocaleString("es-ES")
  }

  const calcularTotal = () => {
    return pedido.detalles.reduce((total, detalle) => total + detalle.subtotal, 0)
  }

  const handleConfirmarPedido = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar pedido?",
      text: `¿Estás seguro de que quieres confirmar el pedido #${pedido.idPedido}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setLoading(true)
      try {
        await pedidoServicio.confirmarPedido(pedido.idPedido)
        Swal.fire({
          title: "¡Pedido confirmado!",
          text: "El pedido ha sido confirmado exitosamente.",
          icon: "success",
          confirmButtonColor: "#10b981",
        })
        onClose()
        onPedidoActualizado()
      } catch (error) {
        console.error("Error al confirmar pedido:", error)
        Swal.fire({
          title: "Error",
          text: "Hubo un error al confirmar el pedido. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRechazarPedido = async () => {
    const result = await Swal.fire({
      title: "¿Rechazar pedido?",
      text: `¿Estás seguro de que quieres rechazar el pedido #${pedido.idPedido}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setLoading(true)
      try {
        await pedidoServicio.rechazarPedido(pedido.idPedido)
        Swal.fire({
          title: "¡Pedido rechazado!",
          text: "El pedido ha sido rechazado.",
          icon: "success",
          confirmButtonColor: "#ef4444",
        })
        onClose()
        onPedidoActualizado()
      } catch (error) {
        console.error("Error al rechazar pedido:", error)
        Swal.fire({
          title: "Error",
          text: "Hubo un error al rechazar el pedido. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleMarcarComoEntregado = async () => {
    const result = await Swal.fire({
      title: "¿Marcar como entregado?",
      text: `¿Estás seguro de que quieres marcar el pedido #${pedido.idPedido} como entregado?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, marcar como entregado",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setLoading(true)
      try {
        await pedidoServicio.marcarComoEntregado(pedido.idPedido)
        Swal.fire({
          title: "¡Pedido entregado!",
          text: "El pedido se marcó como Entregado con éxito.",
          icon: "success",
          confirmButtonColor: "#10b981",
        })
        onClose()
        onPedidoActualizado()
      } catch (error) {
        console.error("Error al marcar pedido como entregado:", error)
        Swal.fire({
          title: "Error",
          text: "Hubo un error al marcar el pedido como entregado. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleGenerarFactura = async () => {
    setGeneratingInvoice(true)
    try {
      // Mostrar indicador de carga
      Swal.fire({
        title: "Generando factura...",
        text: "Por favor espera mientras se genera la factura.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Realizar la petición para descargar la factura
      const response = await fetch(`http://localhost:8080/factura/descargar/${pedido.idPedido}`, {
        method: "GET",
        headers: {
          // Incluir headers de autenticación si son necesarios
          // 'Authorization': `Bearer ${token}`,
        },
      })

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error al descargar la factura: ${response.status} ${response.statusText}`)
      }

      // Obtener el blob de la respuesta
      const blob = await response.blob()

      // Obtener el nombre del archivo de las cabeceras de la respuesta o usar uno predeterminado
      const contentDisposition = response.headers.get("content-disposition")
      let filename = `factura-pedido-${pedido.idPedido}.pdf`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }

      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(blob)

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)

      // Simular un clic en el enlace para iniciar la descarga
      link.click()

      // Limpiar
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Mostrar mensaje de éxito
      Swal.fire({
        title: "¡Factura descargada!",
        text: "La factura se ha descargado correctamente.",
        icon: "success",
        confirmButtonColor: "#10b981",
      })
    } catch (error) {
      console.error("Error al generar factura:", error)
      Swal.fire({
        title: "Error",
        text: "Hubo un error al generar la factura. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setGeneratingInvoice(false)
    }
  }

  // Verificar si el pedido puede ser marcado como entregado
  const puedeMarcarComoEntregado = pedido.estadoPedido === EstadoPedido.LISTO && pedido.tipoEnvio === "RETIRO_EN_LOCAL"

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido #{pedido.idPedido}</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{formatFechaHora(pedido.fechaYHora)}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(pedido.estadoPedido)}`}
                >
                  {getEstadoText(pedido.estadoPedido)}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <CloseOutlined className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <EmailOutlined className="mr-2 text-orange-600" />
              Información del Cliente
            </h3>
            <p className="text-gray-700">{pedido.emailCliente}</p>
          </div>

          {/* Detalles del Pedido */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ReceiptOutlined className="mr-2 text-orange-600" />
              Productos Pedidos
            </h3>
            <div className="space-y-3">
              {pedido.detalles.map((detalle, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">{detalle.cantidad}x</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{detalle.nombreArticulo}</h4>
                      <p className="text-sm text-gray-600">${(detalle.subtotal / detalle.cantidad).toFixed(2)} c/u</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${detalle.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de Envío y Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                {pedido.tipoEnvio === "DELIVERY" ? (
                  <LocalShippingOutlined className="mr-2 text-orange-600" />
                ) : (
                  <RestaurantOutlined className="mr-2 text-orange-600" />
                )}
                Tipo de Envío
              </h3>
              <p className="text-gray-700">
                {pedido.tipoEnvio === "RETIRO_EN_LOCAL" ? "Retiro en Local" : pedido.tipoEnvio}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <PaymentOutlined className="mr-2 text-orange-600" />
                Método de Pago
              </h3>
              <p className="text-gray-700">{pedido.metodoDePago}</p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total del Pedido</span>
              <span className="text-2xl font-bold text-orange-600">${calcularTotal()}</span>
            </div>
          </div>
        </div>

        {/* Footer con botones de acción */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex flex-wrap gap-3 justify-end">
            {pedido.estadoPedido === EstadoPedido.A_CONFIRMAR && (
              <>
                <button
                  onClick={handleRechazarPedido}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <CancelOutlined className="mr-2" />
                  Rechazar
                </button>
                <button
                  onClick={handleConfirmarPedido}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <CheckCircleOutlined className="mr-2" />
                  Confirmar
                </button>
              </>
            )}

            {puedeMarcarComoEntregado && (
              <button
                onClick={handleMarcarComoEntregado}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <CheckOutlined className="mr-2" />
                Marcar como Entregado
              </button>
            )}

            {pedido.estadoPedido === EstadoPedido.ENTREGADO && (
              <button
                onClick={handleGenerarFactura}
                disabled={generatingInvoice}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <ReceiptOutlined className="mr-2" />
                Descargar Factura
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
