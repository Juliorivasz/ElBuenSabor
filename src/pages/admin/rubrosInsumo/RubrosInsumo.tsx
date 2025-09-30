"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { RubroInsumoDetailsModal } from "../../../components/rubrosInsumo/RubroInsumoDetailsModal"
import { RubroInsumoForm } from "../../../components/rubrosInsumo/RubroInsumoForm"
import { RubrosInsumoTable } from "../../../components/rubrosInsumo/RubrosInsumoTable"
import { RubrosInsumoFilters } from "../../../components/rubrosInsumo/RubrosInsumoFilters"
import type { RubroInsumoAbmDto } from "../../../models/dto/RubroInsumoAbmDto"
import type { NuevoRubroInsumoDto } from "../../../models/dto/NuevoRubroInsumoDto"
import { rubroInsumoAbmServicio } from "../../../services/rubroInsumoAbmServicio"
import { useRubrosInsumoStore } from "../../../store/rubrosInsumo/useRubrosInsumoStore"
import { NotificationService } from "../../../utils/notifications"
import { PageHeader } from "../../../components/shared/PageHeader"
import { Tapas as RubroIcon } from "@mui/icons-material"

export const RubrosInsumo = () => {
  const { rubros, loading, error, fetchRubros, altaBajaRubro, clearError, pagination, setPagination } =
    useRubrosInsumoStore()

  const [selectedRubro, setSelectedRubro] = useState<RubroInsumoAbmDto | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingRubro, setEditingRubro] = useState<RubroInsumoAbmDto | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activos" | "inactivos" | "padre" | "subrubros">("todos")
  const [busqueda, setBusqueda] = useState<string>("")

  // Cargar rubros al montar el componente
  useEffect(() => {
    fetchRubros()
  }, [fetchRubros])

  // Mostrar errores
  useEffect(() => {
    if (error) {
      NotificationService.error(error)
      clearError()
    }
  }, [error, clearError])

  const filteredRubros = useMemo(() => {
    return rubros.filter((rubro) => {
      // Filtro por estado
      if (filtroEstado === "activos" && !rubro.isDadoDeAlta()) return false
      if (filtroEstado === "inactivos" && rubro.isDadoDeAlta()) return false
      if (filtroEstado === "padre" && !rubro.esRubroPadre()) return false
      if (filtroEstado === "subrubros" && rubro.esRubroPadre()) return false

      // Filtro por búsqueda
      if (busqueda) {
        const searchLower = busqueda.toLowerCase()
        const nombre = rubro.getNombre().toLowerCase()
        if (!nombre.includes(searchLower)) {
          return false
        }
      }

      return true
    })
  }, [rubros, filtroEstado, busqueda])

  const paginatedRubros = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    return filteredRubros.slice(startIndex, endIndex)
  }, [filteredRubros, pagination.currentPage, pagination.itemsPerPage])

  useEffect(() => {
    setPagination({
      totalItems: filteredRubros.length,
      totalPages: Math.ceil(filteredRubros.length / pagination.itemsPerPage),
      currentPage: 1, // Reset to first page when filters change
    })
  }, [filteredRubros.length, pagination.itemsPerPage, setPagination])

  const rubrosActivos = useMemo(() => rubros.filter((r) => r.isDadoDeAlta()).length, [rubros])
  const rubrosInactivos = useMemo(() => rubros.filter((r) => !r.isDadoDeAlta()).length, [rubros])
  const rubrosPadre = useMemo(() => rubros.filter((r) => r.esRubroPadre()).length, [rubros])
  const subrubros = useMemo(() => rubros.filter((r) => !r.esRubroPadre()).length, [rubros])

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ currentPage: page })
    },
    [setPagination],
  )

  const handleItemsPerPageChange = useCallback(
    (itemsPerPage: number) => {
      setPagination({ itemsPerPage, currentPage: 1 })
    },
    [setPagination],
  )

  // Función recursiva para obtener todos los descendientes de un rubro
  const getAllDescendants = (parentId: number, allRubros: RubroInsumoAbmDto[]): RubroInsumoAbmDto[] => {
    const directChildren = allRubros.filter((r) => r.getIdRubroPadre() === parentId)
    let allDescendants: RubroInsumoAbmDto[] = [...directChildren]

    // Para cada hijo directo, obtener sus descendientes recursivamente
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
      // const nuevoEstado = !estadoActual

      // Obtener todos los descendientes del rubro
      const descendientes = getAllDescendants(rubro.getIdRubroInsumo(), rubros)

      // Cambiar el estado del rubro actual
      await altaBajaRubro(rubro.getIdRubroInsumo())

      // Si tiene descendientes, cambiar su estado también
      if (descendientes.length > 0) {
        for (const descendiente of descendientes) {
          // Solo cambiar si el estado del descendiente es diferente al nuevo estado del rubro
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
        // Editar rubro existente
        await rubroInsumoAbmServicio.modificarRubro(editingRubro.getIdRubroInsumo(), rubroData)
        NotificationService.success("Rubro actualizado correctamente", "Actualización exitosa")
      } else {
        // Crear nuevo rubro
        await rubroInsumoAbmServicio.crearRubro(rubroData)
        NotificationService.success("Rubro creado correctamente", "Creación exitosa")
      }

      // Refrescar la lista
      await fetchRubros()

      // Cerrar modal
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

        <RubrosInsumoFilters
          totalRubros={rubros.length}
          rubrosActivos={rubrosActivos}
          rubrosInactivos={rubrosInactivos}
          rubrosPadre={rubrosPadre}
          subrubros={subrubros}
          filtroActual={filtroEstado}
          onFiltroChange={setFiltroEstado}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
        />

        <RubrosInsumoTable
          rubros={paginatedRubros}
          loading={loading}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
          onNuevoRubro={handleNuevoRubro}
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          filtroActual={filtroEstado}
          todosLosRubros={rubros}
        />
      </div>

      {/* Modal de detalles */}
      {showDetailsModal && selectedRubro && (
        <RubroInsumoDetailsModal rubro={selectedRubro} rubros={rubros} onClose={handleCloseDetailsModal} />
      )}

      {/* Modal de formulario */}
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
