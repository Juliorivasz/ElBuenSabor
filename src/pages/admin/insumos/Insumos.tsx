"use client"

import { useEffect, useState, useMemo } from "react"
import { useInsumosStore } from "../../../store/insumos/useInsumosStore"
import { InsumosFilters } from "../../../components/insumos/InsumosFilters"
import { InsumosTable } from "../../../components/insumos/InsumosTable"
import { InsumoDetailsModal } from "../../../components/insumos/InsumoDetailsModal"
import { InsumoForm } from "../../../components/insumos/InsumoForm"
import { RecargarStockModal } from "../../../components/insumos/RecargarStockModal"
import type { InsumoAbmDto } from "../../../models/dto/InsumoAbmDto"
import type { NuevoInsumoDto } from "../../../models/dto/NuevoInsumoDto"
import type { ModificarInsumoDto } from "../../../models/dto/ModificarInsumoDto"
import { NotificationService } from "../../../utils/notifications"

export const Insumos = () => {
  const {
    insumos,
    unidadesDeMedida,
    rubrosInsumo,
    loading,
    error,
    pagination,
    filters,
    fetchInsumos,
    fetchUnidadesDeMedida,
    fetchRubrosInsumo,
    toggleInsumoStatus,
    createInsumo,
    updateInsumo,
    setPagination,
    setSearchTerm,
    setRubroFilter,
    setEstadoFilter,
    clearFilters,
  } = useInsumosStore()

  const [selectedInsumo, setSelectedInsumo] = useState<InsumoAbmDto | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showRecargarStockModal, setShowRecargarStockModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    fetchInsumos()
    fetchUnidadesDeMedida()
    fetchRubrosInsumo()
  }, [])

  // Filtrar insumos localmente
  const filteredInsumos = useMemo(() => {
    let filtered = [...insumos]

    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (insumo) =>
          insumo.getNombre().toLowerCase().includes(searchLower) ||
          insumo.getNombreRubro().toLowerCase().includes(searchLower),
      )
    }

    // Filtrar por rubro
    if (filters.rubroFilter !== 0) {
      filtered = filtered.filter((insumo) => insumo.getIdRubro() === filters.rubroFilter)
    }

    // Filtrar por estado
    if (filters.estadoFilter === "activos") {
      filtered = filtered.filter((insumo) => insumo.isDadoDeAlta())
    } else if (filters.estadoFilter === "inactivos") {
      filtered = filtered.filter((insumo) => !insumo.isDadoDeAlta())
    }

    return filtered
  }, [insumos, filters])

  // Calcular estadísticas para los filtros
  const stats = useMemo(() => {
    const total = filteredInsumos.length
    const activos = filteredInsumos.filter((insumo) => insumo.isDadoDeAlta()).length
    const inactivos = total - activos

    return { total, activos, inactivos }
  }, [filteredInsumos])

  const handlePageChange = (page: number) => {
    setPagination({ currentPage: page })
    fetchInsumos(page, pagination.itemsPerPage)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination({ currentPage: 1, itemsPerPage })
    fetchInsumos(1, itemsPerPage)
  }

  const handleViewDetails = (insumo: InsumoAbmDto) => {
    setSelectedInsumo(insumo)
    setShowDetailsModal(true)
  }

  const handleEdit = (insumo: InsumoAbmDto) => {
    setSelectedInsumo(insumo)
    setIsEditing(true)
    setShowFormModal(true)
  }

  const handleNewInsumo = () => {
    setSelectedInsumo(null)
    setIsEditing(false)
    setShowFormModal(true)
  }

  const handleRecargarStock = () => {
    setShowRecargarStockModal(true)
  }

  const handleToggleStatus = async (insumo: InsumoAbmDto) => {
    try {
      await toggleInsumoStatus(insumo.getIdArticuloInsumo())
      const action = insumo.isDadoDeAlta() ? "desactivado" : "activado"
      NotificationService.success(`Insumo ${action} correctamente`)
    } catch (error) {
      NotificationService.error("Error al cambiar el estado del insumo")
    }
  }

  const handleFormSubmit = async (insumoData: NuevoInsumoDto | ModificarInsumoDto) => {
    try {
      if (isEditing && selectedInsumo) {
        await updateInsumo(selectedInsumo.getIdArticuloInsumo(), insumoData as ModificarInsumoDto)
        NotificationService.success("Insumo actualizado correctamente")
      } else {
        await createInsumo(insumoData as NuevoInsumoDto)
        NotificationService.success("Insumo creado correctamente")
      }
      setShowFormModal(false)
      setSelectedInsumo(null)
    } catch (error) {
      const action = isEditing ? "actualizar" : "crear"
      NotificationService.error(`Error al ${action} el insumo`)
    }
  }

  const handleRecargarStockSuccess = () => {
    setShowRecargarStockModal(false)
    fetchInsumos() // Recargar la lista de insumos
    NotificationService.success("Stock recargado correctamente")
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setShowFormModal(false)
    setShowRecargarStockModal(false)
    setSelectedInsumo(null)
    setIsEditing(false)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar los datos</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Insumos</h1>
          <p className="text-gray-600">Administra el inventario de insumos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRecargarStock}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Recargar Stock
          </button>
          <button
            onClick={handleNewInsumo}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium"
          >
            Nuevo Insumo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <InsumosFilters
        totalInsumos={stats.total}
        insumosActivos={stats.activos}
        insumosInactivos={stats.inactivos}
        rubrosInsumo={rubrosInsumo}
        filtroActual={filters.estadoFilter}
        rubroSeleccionado={filters.rubroFilter}
        onFiltroChange={setEstadoFilter}
        onRubroChange={setRubroFilter}
        busqueda={filters.searchTerm}
        onBusquedaChange={setSearchTerm}
      />

      {/* Tabla */}
      <InsumosTable
        insumos={filteredInsumos}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        onToggleStatus={handleToggleStatus}
        onRefresh={() => fetchInsumos()}
      />

      {/* Modal de detalles */}
      {showDetailsModal && selectedInsumo && <InsumoDetailsModal insumo={selectedInsumo} onClose={handleCloseModal} />}

      {/* Modal de formulario */}
      {showFormModal && (
        <InsumoForm
          insumo={selectedInsumo || undefined}
          unidadesDeMedida={unidadesDeMedida}
          rubrosInsumo={rubrosInsumo}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={loading}
          isEditing={isEditing}
        />
      )}

      {/* Modal de recargar stock */}
      {showRecargarStockModal && (
        <RecargarStockModal onClose={handleCloseModal} onSuccess={handleRecargarStockSuccess} />
      )}
    </div>
  )
}
