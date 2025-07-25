"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { PedidosFilters } from "../../../components/Admin/pedidos/PedidosFilters"
import { PedidosTable } from "../../../components/Admin/pedidos/PedidosTable"
import { PedidoDetailModal } from "../../../components/Admin/pedidos/PedidoDetailModal"
import { Pagination } from "../../../components/Admin/products/Pagination"
import type { PedidoDTO, PedidosPaginadosDTO } from "../../../models/dto/PedidoDTO"
import { pedidoServicio } from "../../../services/pedidoServicio"
import { EstadoPedido } from "../../../models/enum/EstadoPedido"
import { Assignment, Refresh } from "@mui/icons-material"

export const Pedidos: React.FC = () => {
  const [todosPedidos, setTodosPedidos] = useState<PedidoDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("TODOS")
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoDTO | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filtrar y ordenar pedidos
  const pedidosFiltradosYOrdenados = useMemo(() => {
    let pedidosFiltrados = todosPedidos

    // Filtrar por estado si no es "TODOS"
    if (estadoSeleccionado !== "TODOS") {
      pedidosFiltrados = todosPedidos.filter((pedido) => pedido.estadoPedido === estadoSeleccionado)
    }

    // Separar pedidos en tres grupos
    const pedidosAConfirmar = pedidosFiltrados.filter((pedido) => pedido.estadoPedido === EstadoPedido.A_CONFIRMAR)
    const pedidosActivos = pedidosFiltrados.filter(
      (pedido) =>
        pedido.estadoPedido === EstadoPedido.EN_PREPARACION ||
        pedido.estadoPedido === EstadoPedido.LISTO ||
        pedido.estadoPedido === EstadoPedido.EN_CAMINO,
    )
    const pedidosFinalizados = pedidosFiltrados.filter(
      (pedido) =>
        pedido.estadoPedido === EstadoPedido.ENTREGADO ||
        pedido.estadoPedido === EstadoPedido.RECHAZADO ||
        pedido.estadoPedido === EstadoPedido.CANCELADO,
    )

    // Ordenar cada grupo por fecha y hora (más recientes primero)
    const ordenarPorFecha = (a: PedidoDTO, b: PedidoDTO) => {
      return new Date(b.fechaYHora).getTime() - new Date(a.fechaYHora).getTime()
    }

    pedidosAConfirmar.sort(ordenarPorFecha)
    pedidosActivos.sort(ordenarPorFecha)
    pedidosFinalizados.sort(ordenarPorFecha)

    // Combinar: primero A_CONFIRMAR, luego activos, luego finalizados
    return [...pedidosAConfirmar, ...pedidosActivos, ...pedidosFinalizados]
  }, [todosPedidos, estadoSeleccionado])

  // Calcular paginación para los pedidos filtrados y ordenados
  const totalItems = pedidosFiltradosYOrdenados.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pedidosPaginados = pedidosFiltradosYOrdenados.slice(startIndex, endIndex)

  // Determinar si hay divisiones entre los grupos en la página actual
  const { hayPrimeraDivision, haySegundaDivision, indicePrimeraDivision, indiceSegundaDivision } = useMemo(() => {
    if (estadoSeleccionado !== "TODOS")
      return {
        hayPrimeraDivision: false,
        haySegundaDivision: false,
        indicePrimeraDivision: -1,
        indiceSegundaDivision: -1,
      }

    const pedidosAConfirmarEnPagina = pedidosPaginados.filter((p) => p.estadoPedido === EstadoPedido.A_CONFIRMAR)
    const pedidosActivosEnPagina = pedidosPaginados.filter(
      (p) =>
        p.estadoPedido === EstadoPedido.EN_PREPARACION ||
        p.estadoPedido === EstadoPedido.LISTO ||
        p.estadoPedido === EstadoPedido.EN_CAMINO,
    )
    const pedidosFinalizadosEnPagina = pedidosPaginados.filter(
      (p) =>
        p.estadoPedido === EstadoPedido.ENTREGADO ||
        p.estadoPedido === EstadoPedido.RECHAZADO ||
        p.estadoPedido === EstadoPedido.CANCELADO,
    )

    const hayPrimeraDivision =
      pedidosAConfirmarEnPagina.length > 0 &&
      (pedidosActivosEnPagina.length > 0 || pedidosFinalizadosEnPagina.length > 0)
    const haySegundaDivision = pedidosActivosEnPagina.length > 0 && pedidosFinalizadosEnPagina.length > 0

    let indicePrimeraDivision = -1
    let indiceSegundaDivision = -1

    if (hayPrimeraDivision) {
      indicePrimeraDivision = pedidosPaginados.findLastIndex((p) => p.estadoPedido === EstadoPedido.A_CONFIRMAR)
    }

    if (haySegundaDivision) {
      indiceSegundaDivision = pedidosPaginados.findLastIndex(
        (p) =>
          p.estadoPedido === EstadoPedido.EN_PREPARACION ||
          p.estadoPedido === EstadoPedido.LISTO ||
          p.estadoPedido === EstadoPedido.EN_CAMINO,
      )
    }

    return { hayPrimeraDivision, haySegundaDivision, indicePrimeraDivision, indiceSegundaDivision }
  }, [pedidosPaginados, estadoSeleccionado])

  const cargarTodosPedidos = async () => {
    setLoading(true)
    try {
      // Obtener todos los pedidos sin filtro
      const response: PedidosPaginadosDTO = await pedidoServicio.obtenerPedidosPaginados(
        0, // Primera página
        1000, // Número grande para obtener todos los pedidos
        "TODOS",
      )

      setTodosPedidos(response.content)
    } catch (error) {
      console.error("Error al cargar pedidos:", error)
      setTodosPedidos([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await cargarTodosPedidos()
  }

  useEffect(() => {
    cargarTodosPedidos()
  }, [])

  const handleEstadoChange = (estado: string) => {
    setEstadoSeleccionado(estado)
    setCurrentPage(1) // Resetear a la primera página cuando cambia el filtro
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Resetear a la primera página
  }

  const handleVerDetalles = (pedido: PedidoDTO) => {
    setPedidoSeleccionado(pedido)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setPedidoSeleccionado(null)
  }

  const handlePedidoActualizado = () => {
    cargarTodosPedidos() // Recargar todos los pedidos después de actualizar uno
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Assignment className="text-black mr-3" fontSize="large" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel de Cajero</h1>
              <p className="text-gray-600 mt-1">Gestiona los pedidos en preparación y listos</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50"
          >
            <Refresh className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <PedidosFilters
          estadoSeleccionado={estadoSeleccionado}
          onEstadoChange={handleEstadoChange}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando pedidos...</p>
          </div>
        ) : (
          <>
            <PedidosTable
              pedidos={pedidosPaginados}
              onVerDetalles={handleVerDetalles}
              indicePrimeraDivision={indicePrimeraDivision}
              indiceSegundaDivision={indiceSegundaDivision}
            />

            {totalItems > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[10, 15, 20]}
              />
            )}

            {totalItems === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">
                  {estadoSeleccionado === "TODOS"
                    ? "No hay pedidos disponibles"
                    : `No hay pedidos con estado "${estadoSeleccionado}"`}
                </p>
              </div>
            )}
          </>
        )}

        <PedidoDetailModal
          pedido={pedidoSeleccionado}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onPedidoActualizado={handlePedidoActualizado}
        />
      </div>
    </div>
  )
}
