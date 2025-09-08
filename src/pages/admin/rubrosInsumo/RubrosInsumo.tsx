"use client"

import { GetApp as ExcelIcon, Tapas as RubroIcon } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { RubrosFilters } from "../../../components/rubros/RubrosFilters"
import { RubroInsumoDetailsModal } from "../../../components/rubrosInsumo/RubroInsumoDetailsModal"
import { RubroInsumoForm } from "../../../components/rubrosInsumo/RubroInsumoForm"
import { RubrosInsumoTable } from "../../../components/rubrosInsumo/RubrosInsumoTable"
import { PageHeader } from "../../../components/shared/PageHeader"
import type { NuevoRubroInsumoDto } from "../../../models/dto/NuevoRubroInsumoDto"
import type { RubroInsumoAbmDto } from "../../../models/dto/RubroInsumoAbmDto"
import { rubroInsumoAbmServicio } from "../../../services/rubroInsumoAbmServicio"
import { useRubrosInsumoStore } from "../../../store/rubrosInsumo/useRubrosInsumoStore"
import { exportarRubrosAExcel } from "../../../utils/exportUtils"
import { NotificationService } from "../../../utils/notifications"

export const RubrosInsumo = () => {
  const {
    rubros,
    loading,
    error,
    filtroActual,
    busqueda,
    fetchRubros,
    altaBajaRubro,
    clearError,
    setFiltro,
    setBusqueda,
    setCurrentPage,
    setItemsPerPage,
    getRubrosPaginados,
    getEstadisticas,
    getPaginationInfo,
  } = useRubrosInsumoStore()

  const [selectedRubro, setSelectedRubro] = useState<RubroInsumoAbmDto | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingRubro, setEditingRubro] = useState<RubroInsumoAbmDto | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const estadisticas = getEstadisticas()
  const paginationInfo = getPaginationInfo()
  const rubrosPaginados = getRubrosPaginados()

  useEffect(() => {
    fetchRubros()
  }, [fetchRubros])

  useEffect(() => {
    if (error) {
      NotificationService.error(error)
      clearError()
    }
  }, [error, clearError])

  const getAllDescendants = (parentId: number, allRubros: RubroInsumoAbmDto[]): RubroInsumoAbmDto[] => {
    const directChildren = allRubros.filter((r) => r.getIdRubroPadre() === parentId)
    let allDescendants: RubroInsumoAbmDto[] = [...directChildren]

    for (const child of directChildren) {
      const childDescendants = getAllDescendants(child.getIdRubroInsumo(), allRubros)
      allDescendants = [...allDescendants, ...childDescendants]
    }

    return allDescendants
  }

  const handleViewDetails = (rubro: RubroInsumoAbmDto) => {
    setSelectedRubro(rubro)
    setShowDetailsModal(true)
  }

  const handleEdit = (rubro: RubroInsumoAbmDto) => {
    setEditingRubro(rubro)
    setShowFormModal(true)
  }

  const handleNuevoRubro = () => {
    setEditingRubro(null)
    setShowFormModal(true)
  }

  const handleToggleStatus = async (rubro: RubroInsumoAbmDto) => {
    try {
      const estadoActual = rubro.isDadoDeAlta()
      const nuevoEstado = !estadoActual

      const descendientes = getAllDescendants(rubro.getIdRubroInsumo(), rubros)

      await altaBajaRubro(rubro.getIdRubroInsumo())

      if (descendientes.length > 0) {
        for (const descendiente of descendientes) {
          if (descendiente.isDadoDeAlta() === estadoActual) {
            await altaBajaRubro(descendiente.getIdRubroInsumo())
          }
        }
      }

      const accion = estadoActual ? "desactivado" : "activado"
      const mensaje =
        descendientes.length > 0
          ? `Rubro ${accion} correctamente junto con ${descendientes.length} descendiente${
              descendientes.length !== 1 ? "s" : ""
            }`
          : `Rubro ${accion} correctamente`

      NotificationService.success(mensaje, "Estado actualizado")
    } catch (error) {
      NotificationService.error(error instanceof Error ? error.message : "Error al cambiar el estado del rubro")
    }
  }

  const handleFormSubmit = async (rubroData: NuevoRubroInsumoDto) => {
    setFormLoading(true)
    try {
      if (editingRubro) {
        await rubroInsumoAbmServicio.modificarRubro(editingRubro.getIdRubroInsumo(), rubroData)
        NotificationService.success("Rubro actualizado correctamente", "Actualización exitosa")
      } else {
        await rubroInsumoAbmServicio.crearRubro(rubroData)
        NotificationService.success("Rubro creado correctamente", "Creación exitosa")
      }

      await fetchRubros()

      setShowFormModal(false)
      setEditingRubro(null)
    } catch (error) {
      NotificationService.error(error instanceof Error ? error.message : "Error al guardar el rubro")
    } finally {
      setFormLoading(false)
    }
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedRubro(null)
  }

  const handleCloseFormModal = () => {
    setShowFormModal(false)
    setEditingRubro(null)
  }

  const handleExportarExcel = () => {
    try {
      const nombreArchivo = exportarRubrosAExcel(rubros)
      NotificationService.success(`Archivo ${nombreArchivo} descargado exitosamente`, "Exportación completada")
    } catch (error) {
      NotificationService.error(
        error instanceof Error ? error.message : "Error al exportar a Excel",
        "Error de exportación",
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Gestión de Rubros"
          subtitle="Gestiona los Rubros de productos"
          showBackButton={true}
          backTo="/admin/dashboard"
          icon={<RubroIcon className="text-black mr-3" fontSize="large" />}
          breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Rubros" }]}
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-6">
          <div className="order-2 sm:order-1">{/* Placeholder for future action buttons */}</div>

          <div className="order-1 sm:order-2">
            <button
              onClick={handleExportarExcel}
              disabled={loading || rubros.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ExcelIcon className="h-4 w-4 mr-2" />
              Exportar ({rubros.length})
            </button>
          </div>
        </div>

        <div className="mb-6">
          <RubrosFilters
            totalRubros={estadisticas.total}
            rubrosActivos={estadisticas.activos}
            rubrosInactivos={estadisticas.inactivos}
            rubrosPadre={estadisticas.padre}
            subrubros={estadisticas.subrubros}
            filtroActual={filtroActual}
            onFiltroChange={setFiltro}
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
          />
        </div>

        <RubrosInsumoTable
          rubros={rubrosPaginados}
          loading={loading}
          pagination={paginationInfo}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
          onNuevoRubro={handleNuevoRubro}
        />
      </div>

      {showDetailsModal && selectedRubro && (
        <RubroInsumoDetailsModal rubro={selectedRubro} rubros={rubros} onClose={handleCloseDetailsModal} />
      )}

      {showFormModal && (
        <RubroInsumoForm
          rubro={editingRubro ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          loading={formLoading}
        />
      )}
    </div>
  )
}
