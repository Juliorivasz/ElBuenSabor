"use client"

import { useState, useEffect, useCallback } from "react"
import {
  RefreshOutlined,
  RestaurantMenuOutlined,
  CheckCircleOutlined,
  FileDownloadOutlined,
  FilterListOutlined,
  SearchOutlined,
} from "@mui/icons-material"
import type { PedidoCocineroDTO } from "../../../models/dto/PedidoCocineroDTO"
import { EstadoPedido } from "../../../models/enum/EstadoPedido"
import { cocineroServicio } from "../../../services/cocineroServicio"
import { KitchenOrderCard } from "../../../components/kitchen/KitchenOrderCard"
import Swal from "sweetalert2"
import { useWebSocket } from "../../../hooks/useWebSocket"
import type { IMessage } from "@stomp/stompjs"
import type { PedidoStatusUpdateDto } from "../../../models/dto/PedidoDTO"
import { FixedChat } from "../../../components/chat/FixedChat"
import { exportarPedidosCocinaAExcel } from "../../../utils/exportUtils"

export const Kitchen = () => {
  const { isConnected, subscribe } = useWebSocket()
  const [pedidos, setPedidos] = useState<PedidoCocineroDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filtroTipoEnvio, setFiltroTipoEnvio] = useState<string>("TODOS")
  const [filtroHora, setFiltroHora] = useState<string>("TODOS")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const cargarPedidos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await cocineroServicio.obtenerPedidosCocinero()
      setPedidos(response)
    } catch (error) {
      console.error("Error al cargar pedidos:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los pedidos. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#ef4444",
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

  const handleExportar = () => {
    try {
      const pedidosFiltrados = aplicarFiltros()
      if (pedidosFiltrados.length === 0) {
        Swal.fire({
          title: "Sin datos",
          text: "No hay pedidos para exportar con los filtros aplicados.",
          icon: "info",
          confirmButtonColor: "#3b82f6",
        })
        return
      }

      const nombreArchivo = exportarPedidosCocinaAExcel(pedidosFiltrados)
      Swal.fire({
        title: "¡Exportado!",
        text: `Los pedidos se han exportado exitosamente como ${nombreArchivo}`,
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 3000,
      })
    } catch (error) {
      console.error("Error al exportar pedidos:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudieron exportar los pedidos. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const aplicarFiltros = () => {
    let pedidosFiltrados = [...pedidos]

    // Filtro por búsqueda (ID de pedido o detalles)
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase()
      pedidosFiltrados = pedidosFiltrados.filter((pedido) => {
        // Buscar por ID de pedido
        const matchId = pedido.idPedido.toString().includes(searchLower)

        // Buscar en los detalles del pedido (nombres de artículos)
        const matchDetalles = pedido.detalles?.some((detalle) =>
          detalle.nombreArticulo?.toLowerCase().includes(searchLower) || detalle.tituloPromocion?.toLowerCase().includes(searchLower),
        )

        return matchId || matchDetalles
      })
    }

    // Filtro por tipo de envío
    if (filtroTipoEnvio !== "TODOS") {
      if (filtroTipoEnvio === "DELIVERY") {
        pedidosFiltrados = pedidosFiltrados.filter(
          (pedido) =>
            pedido.tipoEnvio.toLowerCase().includes("delivery") || pedido.tipoEnvio.toLowerCase().includes("envio"),
        )
      } else if (filtroTipoEnvio === "RETIRO") {
        pedidosFiltrados = pedidosFiltrados.filter((pedido) => pedido.tipoEnvio === "RETIRO_EN_LOCAL")
      }
    }

    // Filtro por hora de entrega
    if (filtroHora !== "TODOS") {
      const ahora = new Date()
      pedidosFiltrados = pedidosFiltrados.filter((pedido) => {
        const horaEntrega = new Date(pedido.horaEntrega)
        const diferenciaMinutos = (horaEntrega.getTime() - ahora.getTime()) / (1000 * 60)

        if (filtroHora === "URGENTE") {
          return diferenciaMinutos <= 15
        } else if (filtroHora === "PROXIMO") {
          return diferenciaMinutos > 15 && diferenciaMinutos <= 30
        } else if (filtroHora === "NORMAL") {
          return diferenciaMinutos > 30
        }
        return true
      })
    }

    return pedidosFiltrados
  }

  const pedidosFiltrados = aplicarFiltros()

  useEffect(() => {
    cargarPedidos()
  }, [cargarPedidos])

  // --- Integración WebSocket para el panel de Cocina ---
  useEffect(() => {
    if (isConnected) {
      console.log("Cocina: Suscribiéndose a /topic/kitchen/orders")
      const unsubscribe = subscribe("/topic/kitchen/orders", (message: IMessage) => {
        try {
          const update: PedidoStatusUpdateDto = JSON.parse(message.body)
          console.log("Cocina: Recibido update por WebSocket:", update)

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

              // Si el pedido ya no es relevante para la cocina (ej. entregado, rechazado, cancelado)
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
              // Si es un nuevo pedido y es relevante para la cocina (EN_PREPARACION)
              // Aquí, como el PedidoStatusUpdateDto es ligero, no tenemos todos los detalles del pedido.
              // La forma más sencilla es forzar una recarga completa para obtener el pedido completo.
              if (update.estadoPedido === EstadoPedido.EN_PREPARACION) {
                console.log("Cocina: Nuevo pedido EN_PREPARACION recibido, recargando todos los pedidos.")
                cargarPedidos() // Forzar recarga completa
                return prevPedidos // No modificar el estado aquí, la recarga lo hará
              }
              // Si el pedido no existe y no es un nuevo EN_PREPARACION, no hacemos nada (podría ser un update de un pedido ya filtrado/paginado)
              return prevPedidos
            }
          })
        } catch (error) {
          console.error("Cocina: Error al parsear mensaje WebSocket:", error, message.body)
        }
      })

      return () => {
        console.log("Cocina: Desuscribiéndose de /topic/kitchen/orders")
        unsubscribe()
      }
    }
  }, [isConnected, subscribe, cargarPedidos])

  console.log(pedidos)

  const pedidosEnPreparacion = pedidosFiltrados?.filter((pedido) => pedido.estadoPedido === EstadoPedido.EN_PREPARACION)
  const pedidosListos = pedidosFiltrados?.filter((pedido) => pedido.estadoPedido === EstadoPedido.LISTO)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <RestaurantMenuOutlined className="text-black mr-3" fontSize="large" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel de Cocina</h1>
              <p className="text-gray-600 mt-1">Gestiona los pedidos en preparación y listos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
            >
              <FilterListOutlined fontSize="small" />
              Filtros
            </button>
            <button
              onClick={handleExportar}
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

        {mostrarFiltros && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-black">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda por ID o artículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Pedido</label>
                <div className="relative">
                  <SearchOutlined
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fontSize="small"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ID de pedido o artículo..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filtro por tipo de envío */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Envío</label>
                <select
                  value={filtroTipoEnvio}
                  onChange={(e) => setFiltroTipoEnvio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TODOS">Todos los tipos</option>
                  <option value="DELIVERY">Delivery</option>
                  <option value="RETIRO">Retiro en Local</option>
                </select>
              </div>

              {/* Filtro por hora de entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de Entrega</label>
                <select
                  value={filtroHora}
                  onChange={(e) => setFiltroHora(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TODOS">Todos los tiempos</option>
                  <option value="URGENTE">Urgente (&lt;=15 min)</option>
                  <option value="PROXIMO">Próximo (15-30 min)</option>
                  <option value="NORMAL">Normal (&gt;30 min)</option>
                </select>
              </div>
            </div>

            {/* Botón para limpiar filtros */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setFiltroTipoEnvio("TODOS")
                  setFiltroHora("TODOS")
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Sección de pedidos en preparación */}
        <div className="mb-8">
          <div className="bg-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">
              <RestaurantMenuOutlined className="text-black mr-2" fontSize="small" />
              Pedidos en Preparación ({pedidosEnPreparacion?.length || 0})
            </h2>
            {pedidosEnPreparacion?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-yellow-700">No hay pedidos en preparación en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosEnPreparacion?.map((pedido) => (
                  <KitchenOrderCard key={pedido.idPedido} pedido={pedido} onPedidoActualizado={cargarPedidos} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sección de pedidos listos */}
        <div>
          <div className="bg-green-100 rounded-lg shadow-sm border border-green-200 p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              <CheckCircleOutlined className="text-black mr-2" fontSize="small" />
              Pedidos Listos ({pedidosListos?.length || 0})
            </h2>
            {pedidosListos?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-700">No hay pedidos listos en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosListos?.map((pedido) => (
                  <KitchenOrderCard key={pedido.idPedido} pedido={pedido} onPedidoActualizado={cargarPedidos} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat fijo para cocinero */}
        <FixedChat userRole="Cocinero" />
      </div>
    </div>
  )
}
