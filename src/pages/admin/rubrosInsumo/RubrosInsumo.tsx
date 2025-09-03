"use client"

import { Category } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { RubrosFilters } from "../../../components/rubros/RubrosFilters";
import { RubroInsumoDetailsModal } from "../../../components/rubrosInsumo/RubroInsumoDetailsModal";
import { RubroInsumoForm } from "../../../components/rubrosInsumo/RubroInsumoForm";
import { RubrosInsumoTable } from "../../../components/rubrosInsumo/RubrosInsumoTable";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { NuevoRubroInsumoDto } from "../../../models/dto/NuevoRubroInsumoDto";
import { RubroInsumoAbmDto } from "../../../models/dto/RubroInsumoAbmDto";
import { rubroInsumoAbmServicio } from "../../../services/rubroInsumoAbmServicio";
import { useRubrosInsumoStore } from "../../../store/rubrosInsumo/useRubrosInsumoStore";
import { NotificationService } from "../../../utils/notifications";

type FiltroTipo = "todas" | "activas" | "inactivas" | "padre" | "subcategorias"

export const RubrosInsumo = () => {
  const { rubros: rubrosState, loading, error, fetchRubros, altaBajaRubro } = useRubrosInsumoStore()

  const [rubros, setRubros] = useState<RubroInsumoAbmDto[]>([])
  const [filtroActual, setFiltroActual] = useState<FiltroTipo>("todas")
  const [busqueda, setBusqueda] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedRubro, setSelectedRubro] = useState<RubroInsumoAbmDto | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Cargar rubros al montar el componente
  useEffect(() => {
    const cargarRubros = async () => {
      try {
        await fetchRubros()
      } catch (error) {
        console.error("Error al cargar rubros:", error)
      }
    }
    cargarRubros()
  }, [fetchRubros])

  // Convertir objetos planos a instancias
  useEffect(() => {
    if (rubrosState && Array.isArray(rubrosState)) {
      const rubrosConvertidos = rubrosState.map((r: any) => RubroInsumoAbmDto.fromPlainObject(r))
      setRubros(rubrosConvertidos)
    }
  }, [rubrosState])

  const rubrosFilteredBySearch = rubros.filter((rubro) =>
    rubro.getNombre().toLowerCase().includes(busqueda.toLowerCase()),
  )

  const rubrosFiltered = rubrosFilteredBySearch.filter((rubro) => {
    switch (filtroActual) {
      case "activas":
        return rubro.isDadoDeAlta()
      case "inactivas":
        return !rubro.isDadoDeAlta()
      case "padre":
        return rubro.esRubroPadre()
      case "subcategorias":
        return !rubro.esRubroPadre()
      default:
        return true
    }
  })

  const totalItems = rubrosFiltered.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const rubrosPaginados = rubrosFiltered.slice(startIndex, startIndex + itemsPerPage)

  const getEstadisticas = () => ({
    total: rubros.length,
    activas: rubros.filter((r) => r.isDadoDeAlta()).length,
    inactivas: rubros.filter((r) => !r.isDadoDeAlta()).length,
    padre: rubros.filter((r) => r.esRubroPadre()).length,
    subrubros: rubros.filter((r) => !r.esRubroPadre()).length,
  })

  const getPaginationInfo = () => ({
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
  })

  const handleFiltroChange = (filtro: FiltroTipo) => {
    setFiltroActual(filtro)
    setCurrentPage(1)
  }

  const handleBusquedaChange = (nuevaBusqueda: string) => {
    setBusqueda(nuevaBusqueda)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => setCurrentPage(page)
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  const handleToggleStatus = async (rubro: RubroInsumoAbmDto) => {
    try {
      const confirmed = await NotificationService.confirm(
        `¿Está seguro que desea ${rubro.isDadoDeAlta() ? "desactivar" : "activar"} el rubro "${rubro.getNombre()}"?`,
        "Confirmar cambio de estado",
      )
      if (!confirmed) return

      await altaBajaRubro(rubro.getIdRubroInsumo())
      NotificationService.success(
        `El rubro "${rubro.getNombre()}" ha sido ${rubro.isDadoDeAlta() ? "desactivado" : "activado"} correctamente.`,
        "Estado actualizado",
      )
    } catch (error) {
      NotificationService.error("No se pudo cambiar el estado del rubro.", "Error")
    }
  }

  const handleEdit = (rubro: RubroInsumoAbmDto) => {
    setSelectedRubro(rubro)
    setShowEditModal(true)
  }

  const handleViewDetails = (rubro: RubroInsumoAbmDto) => {
    setSelectedRubro(rubro)
    setShowDetailsModal(true)
  }

  const handleNuevoRubro = () => {
    setSelectedRubro(null)
    setShowCreateModal(true)
  }

  const handleFormSubmit = async (nuevoRubro: NuevoRubroInsumoDto) => {
    setFormLoading(true)
    try {
      if (showEditModal && selectedRubro) {
        await rubroInsumoAbmServicio.modificarRubro(selectedRubro.getIdRubroInsumo(), nuevoRubro)
        NotificationService.success(
          `El rubro "${nuevoRubro.getNombre()}" ha sido actualizado correctamente.`,
          "Rubro actualizado",
        )
      } else {
        await rubroInsumoAbmServicio.crearRubro(nuevoRubro)
        NotificationService.success(
          `El rubro "${nuevoRubro.getNombre()}" ha sido creado correctamente.`,
          "Rubro creado",
        )
      }

      await fetchRubros()
      closeModals()
    } catch (error) {
      NotificationService.error(`No se pudo ${showEditModal ? "actualizar" : "crear"} el rubro.`, "Error")
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDetailsModal(false)
    setSelectedRubro(null)
    setFormLoading(false)
  }

  const estadisticas = getEstadisticas()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-red-900 mb-2">Error al cargar rubros</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={fetchRubros}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Panel de Rubros"
          subtitle="Gestiona los rubros de productos"
          showBackButton
          backTo="/admin/dashboard"
          icon={<Category />}
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Rubros" },
          ]}
        />

        <RubrosFilters
          totalRubros={estadisticas.total}
          rubrosActivos={estadisticas.activas}
          rubrosInactivos={estadisticas.inactivas}
          rubrosPadre={estadisticas.padre}
          subrubros={estadisticas.subrubros}
          filtroActual={filtroActual}
          onFiltroChange={handleFiltroChange}
          busqueda={busqueda}
          onBusquedaChange={handleBusquedaChange}
        />

        <RubrosInsumoTable
          rubros={rubrosPaginados}
          loading={loading}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
          onNuevoRubro={handleNuevoRubro}
          paginationInfo={getPaginationInfo()}
        />

        {(showCreateModal || showEditModal) && (
          <RubroInsumoForm
            rubro={showEditModal && selectedRubro ? selectedRubro : undefined}
            onSubmit={handleFormSubmit}
            onCancel={closeModals}
            loading={formLoading}
          />
        )}

        {showDetailsModal && selectedRubro && (
          <RubroInsumoDetailsModal rubro={selectedRubro} rubros={rubros} onClose={closeModals} />
        )}
      </div>
    </div>
  )
}
