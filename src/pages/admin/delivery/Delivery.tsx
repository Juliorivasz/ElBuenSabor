"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { PedidoRepartidorDTO } from "../../../models/dto/PedidoRepartidorDTO"
import { RepartidorServicio } from "../../../services/repartidorServicio"
import { DeliveryOrderCard } from "../../../components/delivery/DeliveryOrderCard"
import {
  RefreshOutlined,
  TwoWheeler as DeliveryIcon,
  CheckCircleOutlined,
  Search,
  FileDownloadOutlined,
} from "@mui/icons-material"
import Swal from "sweetalert2"
import { useWebSocket } from "../../../hooks/useWebSocket"
import type { IMessage } from "@stomp/stompjs"
import type { PedidoStatusUpdateDto } from "../../../models/dto/PedidoDTO"
import { EstadoPedido } from "../../../models/enum/EstadoPedido"
import { exportarPedidosRepartidorAExcel } from "../../../utils/exportUtils"

export const Delivery: React.FC = () => {
  const { isConnected, subscribe } = useWebSocket()
  const [pedidos, setPedidos] = useState<PedidoRepartidorDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("TODOS")
  const [tiempoFilter, setTiempoFilter] = useState<string>("TODOS")
  const repartidorServicio = RepartidorServicio.getInstance()

  const cargarPedidos = useCallback(async () => {
    try {
      const response = await repartidorServicio.obtenerPedidosRepartidor()
      setPedidos(response)
    } catch (error) {
      console.error("Error al cargar pedidos:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los pedidos",
        icon: "error",
      })
      setPedidos([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await cargarPedidos()
  }

  const handleExport = () => {
    try {
      const pedidosFiltrados = filtrarPedidos()
      exportarPedidosRepartidorAExcel(pedidosFiltrados)
      Swal.fire({
        title: "Exportación exitosa",
        text: "Los pedidos se han exportado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Error al exportar:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudo exportar los pedidos",
        icon: "error",
      })
    }
  }

  const filtrarPedidos = (): PedidoRepartidorDTO[] => {
    let pedidosFiltrados = [...pedidos]

    // Filter by search term (order ID)
    if (searchTerm.trim() !== "") {
      pedidosFiltrados = pedidosFiltrados.filter((pedido) => pedido.idPedido.toString().includes(searchTerm.trim()))
    }

    // Filter by status
    if (estadoFilter !== "TODOS") {
      pedidosFiltrados = pedidosFiltrados.filter((pedido) => pedido.estadoPedido === estadoFilter)
    }

    // Filter by delivery time
    if (tiempoFilter !== "TODOS") {
      const ahora = new Date()
      pedidosFiltrados = pedidosFiltrados.filter((pedido) => {
        const horaEntrega = new Date(pedido.horaEntrega)
        const diferenciaMinutos = (horaEntrega.getTime() - ahora.getTime()) / (1000 * 60)

        switch (tiempoFilter) {
          case "URGENTE": // Menos de 30 minutos
            return diferenciaMinutos <= 30
          case "PROXIMO": // Entre 30 y 60 minutos
            return diferenciaMinutos > 30 && diferenciaMinutos <= 60
          case "PROGRAMADO": // Más de 60 minutos
            return diferenciaMinutos > 60
          default:
            return true
        }
      })
    }

    return pedidosFiltrados
  }

  useEffect(() => {
    cargarPedidos()
  }, [cargarPedidos])

  // --- Integración WebSocket para el panel de Repartidor ---
  useEffect(() => {
    if (isConnected) {
      console.log("Repartidor: Suscribiéndose a /topic/delivery/orders")
      const unsubscribe = subscribe("/topic/delivery/orders", (message: IMessage) => {
        try {
          const update: PedidoStatusUpdateDto = JSON.parse(message.body)
          console.log("Repartidor: Recibido update por WebSocket:", update)

          setPedidos((prevPedidos) => {
            const existingPedidoIndex = prevPedidos.findIndex((p) => p.idPedido === update.idPedido)

            // Si el pedido ya existe, lo actualizamos
            if (existingPedidoIndex !== -1) {
              const updatedPedidos = [...prevPedidos]
              const pedidoToUpdate = { ...updatedPedidos[existingPedidoIndex] }

              pedidoToUpdate.estadoPedido = update.estadoPedido
              if (update.horaEntrega) {
                pedidoToUpdate.horaEntrega = update.horaEntrega
              }

              // Si el pedido ya no es relevante para el repartidor (ej. CANCELADO, RECHAZADO, ENTREGADO)
              // Nota: El repartidor solo ve LISTO y EN_CAMINO. Si pasa a ENTREGADO, se elimina de su vista.
              if (
                update.estadoPedido === EstadoPedido.ENTREGADO ||
                update.estadoPedido === EstadoPedido.RECHAZADO ||
                update.estadoPedido === EstadoPedido.CANCELADO
              ) {
                return updatedPedidos.filter((p) => p.idPedido !== update.idPedido) // Lo removemos
              }

              updatedPedidos[existingPedidoIndex] = pedidoToUpdate
              return updatedPedidos
            } else {
              // Si es un nuevo pedido y es relevante para el repartidor (LISTO)
              if (update.estadoPedido === EstadoPedido.LISTO) {
                console.log("Repartidor: Nuevo pedido LISTO recibido, recargando todos los pedidos.")
                cargarPedidos() // Forzar recarga completa
                return prevPedidos // No modificar el estado aquí
              }
              return prevPedidos
            }
          })
        } catch (error) {
          console.error("Repartidor: Error al parsear mensaje WebSocket:", error, message.body)
        }
      })

      return () => {
        console.log("Repartidor: Desuscribiéndose de /topic/delivery/orders")
        unsubscribe()
      }
    }
  }, [isConnected, subscribe, cargarPedidos])

  const pedidosFiltrados = filtrarPedidos()
  const pedidosListos = pedidosFiltrados?.filter((p) => p.estadoPedido === "LISTO")
  const pedidosEnCamino = pedidosFiltrados?.filter((p) => p.estadoPedido === "EN_CAMINO")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <DeliveryIcon className="text-black mr-3" fontSize="large" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel de Repartidor</h1>
              <p className="text-gray-600 mt-1">Gestiona tus entregas de manera eficiente</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
            >
              <FileDownloadOutlined fontSize="small" />
              Exportar
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50"
            >
              <RefreshOutlined className={`${refreshing ? "animate-spin" : ""}`} fontSize="small" />
              {refreshing ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-black">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por ID de Pedido</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ID de Pedido o Articulo..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Pedido</label>
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="LISTO">Listo para Retirar</option>
                <option value="EN_CAMINO">En Camino</option>
              </select>
            </div>

            {/* Time filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de Entrega</label>
              <select
                value={tiempoFilter}
                onChange={(e) => setTiempoFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TODOS">Todos los tiempos</option>
                <option value="URGENTE">Urgente ({"<"} 30 min)</option>
                <option value="PROXIMO">Próximo (30-60 min)</option>
                <option value="PROGRAMADO">Programado ({">"}60 min)</option>
              </select>
            </div>
          </div>

          {/* Clear filters button */}
          {(searchTerm !== "" || estadoFilter !== "TODOS" || tiempoFilter !== "TODOS") && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setEstadoFilter("TODOS")
                  setTiempoFilter("TODOS")
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Sección de pedidos listos */}
        <div className="mb-8">
          <div className="bg-green-100 rounded-lg shadow-sm border border-green-200 p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              <CheckCircleOutlined className="text-black mr-2" fontSize="small" />
              Pedidos Listos para Retirar
            </h2>
            {pedidosListos?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-700">No hay pedidos listos para retirar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosListos?.map((pedido) => (
                  <DeliveryOrderCard key={pedido.idPedido} pedido={pedido} onUpdate={cargarPedidos} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sección de pedidos en camino */}
        <div className="mb-8">
          <div className="bg-orange-100 rounded-lg shadow-sm border border-orange-200 p-6">
            <h2 className="text-xl font-bold text-orange-800 mb-4">
              <DeliveryIcon className="text-black mr-2" fontSize="small" />
              Pedidos En Camino
            </h2>
            {pedidosEnCamino?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-orange-700">No hay pedidos en camino</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosEnCamino?.map((pedido) => (
                  <DeliveryOrderCard key={pedido.idPedido} pedido={pedido} onUpdate={cargarPedidos} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
