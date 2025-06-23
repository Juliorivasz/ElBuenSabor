"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { PageHeader } from "../../../components/shared/PageHeader"
import { PedidosFilters } from "../../../components/Admin/pedidos/PedidosFilters"
import { PedidosTable } from "../../../components/Admin/pedidos/PedidosTable"
import { PedidoDetailModal } from "../../../components/Admin/pedidos/PedidoDetailModal"
import { Pagination } from "../../../components/Admin/products/Pagination"
import type { PedidoDTO, PedidosPaginadosDTO } from "../../../models/dto/PedidoDTO"
import { pedidoServicio } from "../../../services/PedidoServicio"
import { EstadoPedido } from "../../../models/enum/EstadoPedido"

export const Pedidos: React.FC = () => {
  const [todosPedidos, setTodosPedidos] = useState<PedidoDTO[]>([])
  const [loading, setLoading] = useState(false)
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

    // Separar pedidos A_CONFIRMAR del resto
    const pedidosAConfirmar = pedidosFiltrados.filter((pedido) => pedido.estadoPedido === EstadoPedido.A_CONFIRMAR)
    const otrosPedidos = pedidosFiltrados.filter((pedido) => pedido.estadoPedido !== EstadoPedido.A_CONFIRMAR)

    // Ordenar ambos grupos por fecha y hora (más recientes primero)
    const ordenarPorFecha = (a: PedidoDTO, b: PedidoDTO) => {
      return new Date(b.fechaYHora).getTime() - new Date(a.fechaYHora).getTime()
    }

    pedidosAConfirmar.sort(ordenarPorFecha)
    otrosPedidos.sort(ordenarPorFecha)

    // Combinar: primero A_CONFIRMAR, luego el resto
    return [...pedidosAConfirmar, ...otrosPedidos]
  }, [todosPedidos, estadoSeleccionado])

  // Calcular paginación para los pedidos filtrados y ordenados
  const totalItems = pedidosFiltradosYOrdenados.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pedidosPaginados = pedidosFiltradosYOrdenados.slice(startIndex, endIndex)

  // Determinar si hay división entre A_CONFIRMAR y otros pedidos en la página actual
  const hayDivision = useMemo(() => {
    if (estadoSeleccionado !== "TODOS") return false

    const pedidosAConfirmarEnPagina = pedidosPaginados.filter((p) => p.estadoPedido === EstadoPedido.A_CONFIRMAR)
    const otrosPedidosEnPagina = pedidosPaginados.filter((p) => p.estadoPedido !== EstadoPedido.A_CONFIRMAR)

    return pedidosAConfirmarEnPagina.length > 0 && otrosPedidosEnPagina.length > 0
  }, [pedidosPaginados, estadoSeleccionado])

  const indiceDivision = useMemo(() => {
    if (!hayDivision) return -1

    const ultimoAConfirmar = pedidosPaginados.findLastIndex((p) => p.estadoPedido === EstadoPedido.A_CONFIRMAR)
    return ultimoAConfirmar
  }, [pedidosPaginados, hayDivision])

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
    }
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
        <PageHeader title="Gestión de Pedidos" subtitle="Administra y gestiona todos los pedidos del restaurante" />

        <PedidosFilters estadoSeleccionado={estadoSeleccionado} onEstadoChange={handleEstadoChange} />

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
              indiceDivision={indiceDivision}
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
