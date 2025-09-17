"use client"

import { Inventory2 as InsumoIcon } from "@mui/icons-material"
import { Download, Plus, RefreshCw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { InsumoDetailsModal } from "../../../components/insumos/InsumoDetailsModal"
import { InsumoForm } from "../../../components/insumos/InsumoForm"
import { InsumosFilters } from "../../../components/insumos/InsumosFilters"
import { InsumosTable } from "../../../components/insumos/InsumosTable"
import { RecargarStockModal } from "../../../components/insumos/RecargarStockModal"
import { PageHeader } from "../../../components/shared/PageHeader"
import type { InsumoAbmDto } from "../../../models/dto/InsumoAbmDto"
import type { ModificarInsumoDto } from "../../../models/dto/ModificarInsumoDto"
import type { NuevoInsumoDto } from "../../../models/dto/NuevoInsumoDto"
import { useInsumosStore } from "../../../store/insumos/useInsumosStore"
import { exportarDatosAExcel } from "../../../utils/exportUtils"
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
  } = useInsumosStore()

  const [selectedInsumo, setSelectedInsumo] = useState<InsumoAbmDto | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showRecargarStockModal, setShowRecargarStockModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [exportando, setExportando] = useState(false)

  useEffect(() => {
    fetchInsumos()
    fetchUnidadesDeMedida()
    fetchRubrosInsumo()
  }, [])

  const filteredInsumos = useMemo(() => {
    let filtered = [...insumos]

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (insumo) =>
          insumo.getNombre().toLowerCase().includes(searchLower) ||
          insumo.getNombreRubro().toLowerCase().includes(searchLower),
      )
    }

    if (filters.rubroFilter !== 0) {
      filtered = filtered.filter((insumo) => insumo.getIdRubro() === filters.rubroFilter)
    }

    if (filters.estadoFilter === "activos") {
      filtered = filtered.filter((insumo) => insumo.isDadoDeAlta())
    } else if (filters.estadoFilter === "inactivos") {
      filtered = filtered.filter((insumo) => !insumo.isDadoDeAlta())
    }

    return filtered
  }, [insumos, filters])

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

  const exportarInsumos = async () => {
    try {
      setExportando(true)

      const insumosAExportar = filteredInsumos.length < insumos.length ? filteredInsumos : insumos

      if (insumosAExportar.length === 0) {
        await NotificationService.warning("Sin datos", "No hay insumos para exportar")
        return
      }

      const nombreArchivo = exportarDatosAExcel(insumosAExportar, "Insumos")
      await NotificationService.success(
        "¡Exportación exitosa!",
        `El archivo ${nombreArchivo} se ha descargado correctamente.`,
      )
    } catch (error) {
      console.error("Error al exportar insumos:", error)
      await NotificationService.error("Error", "No se pudo exportar el archivo")
    } finally {
      setExportando(false)
    }
  }

  const handleToggleStatus = async (insumo: InsumoAbmDto) => {
    try {
      await toggleInsumoStatus(insumo.getIdArticuloInsumo())
      const action = insumo.isDadoDeAlta() ? "desactivado" : "activado"
      NotificationService.success(`Insumo ${action} correctamente`)
    } catch (error) {
      console.log(error)
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
      console.log(error)
      const action = isEditing ? "actualizar" : "crear"
      NotificationService.error(`Error al ${action} el insumo`)
    }
  }

  const handleRecargarStockSuccess = () => {
    setShowRecargarStockModal(false)
    fetchInsumos()
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader
          title="Gestión de Insumos"
          subtitle="Gestiona los Insumos de productos"
          showBackButton={true}
          backTo="/admin/dashboard"
          icon={<InsumoIcon className="text-black mr-3" fontSize="large" />}
          breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Insumos" }]}
        />
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div className="order-2 sm:order-1 flex space-x-3">
            <button
              onClick={handleRecargarStock}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar Stock
            </button>
            <button
              onClick={handleNewInsumo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Insumo
            </button>
          </div>

          <div className="order-1 sm:order-2">
            <button
              onClick={exportarInsumos}
              disabled={exportando || insumos.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exportando ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full mr-2" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar ({filteredInsumos.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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

      {showDetailsModal && selectedInsumo && <InsumoDetailsModal insumo={selectedInsumo} onClose={handleCloseModal} />}

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

      {showRecargarStockModal && (
        <RecargarStockModal onClose={handleCloseModal} onSuccess={handleRecargarStockSuccess} />
      )}
    </div>
  )
}
