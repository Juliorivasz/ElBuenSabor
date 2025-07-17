"use client"

import { useEffect, useState, useMemo } from "react"
import { PageHeader } from "../../../components/shared/PageHeader"
import { RubrosFilters } from "../../../components/rubros/RubrosFilters"
import { RubrosTable } from "../../../components/rubros/RubrosTable"
import { RubroForm } from "../../../components/rubros/RubroForm"
import { RubroDetailsModal } from "../../../components/rubros/RubroDetailsModal"
import { useRubrosStore } from "../../../store/rubros/useRubrosStore"
import { RubroInsumoServicio } from "../../../services/rubroInsumoServicio"
import { NotificationService } from "../../../utils/notifications"
import type { RubroInsumoDto } from "../../../models/dto/RubroInsumoDto"
import type { NuevoRubroInsumoDto } from "../../../models/dto/NuevoRubroInsumoDto"

type FiltroTipo = "todos" | "activos" | "inactivos" | "padre" | "subrubros"

export const Rubros = () => {
  const { rubros, loading, error, fetchRubros, setLoading, clearError } = useRubrosStore()

  // Estados locales
  const [filtroActual, setFiltroActual] = useState<FiltroTipo>("todos")
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(10)

  // Estados de modales
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [rubroSeleccionado, setRubroSeleccionado] = useState<RubroInsumoDto | null>(null)
  const [rubroPadreParaSubrubro, setRubroPadreParaSubrubro] = useState<RubroInsumoDto | null>(null)
  const [formLoading, setFormLoading] = useState(false)

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

  // Obtener todos los rubros de forma plana (incluyendo subrubros)
  const obtenerTodosLosRubros = (rubrosLista: RubroInsumoDto[]): RubroInsumoDto[] => {
    const todosLosRubros: RubroInsumoDto[] = []

    const procesarRubros = (rubros: RubroInsumoDto[]) => {
      rubros.forEach((rubro) => {
        todosLosRubros.push(rubro)
        if (rubro.getSubrubros().length > 0) {
          procesarRubros(rubro.getSubrubros())
        }
      })
    }

    procesarRubros(rubrosLista)
    return todosLosRubros
  }

  const todosLosRubros = obtenerTodosLosRubros(rubros)

  // Filtrar y buscar rubros
  const rubrosFiltrados = useMemo(() => {
    let rubrosFiltrados = [...todosLosRubros]

    // Aplicar filtro de búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase().trim()
      rubrosFiltrados = rubrosFiltrados.filter((rubro) => rubro.getNombre().toLowerCase().includes(busquedaLower))
    }

    // Aplicar filtros por tipo
    switch (filtroActual) {
      case "activos":
        rubrosFiltrados = rubrosFiltrados.filter((rubro) => rubro.isActivo())
        break
      case "inactivos":
        rubrosFiltrados = rubrosFiltrados.filter((rubro) => !rubro.isActivo())
        break
      case "padre":
        rubrosFiltrados = rubrosFiltrados.filter((rubro) => rubro.esRubroPadre())
        break
      case "subrubros":
        rubrosFiltrados = rubrosFiltrados.filter((rubro) => !rubro.esRubroPadre())
        break
      case "todos":
      default:
        // En modo "todos", solo mostrar rubros padre para la vista jerárquica
        rubrosFiltrados = rubros.filter((rubro) => {
          if (busqueda.trim()) {
            const busquedaLower = busqueda.toLowerCase().trim()
            return rubro.getNombre().toLowerCase().includes(busquedaLower)
          }
          return true
        })
        break
    }

    return rubrosFiltrados
  }, [todosLosRubros, rubros, busqueda, filtroActual])

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const total = todosLosRubros.length
    const activos = todosLosRubros.filter((r) => r.isActivo()).length
    const inactivos = total - activos
    const principales = todosLosRubros.filter((r) => r.esRubroPadre()).length
    const subrubros = total - principales

    return {
      total,
      activos,
      inactivos,
      principales,
      subrubros,
    }
  }, [todosLosRubros])

  // Paginación
  const totalPaginas = Math.ceil(rubrosFiltrados.length / itemsPorPagina)
  const indiceInicio = (paginaActual - 1) * itemsPorPagina
  const indiceFin = indiceInicio + itemsPorPagina
  const rubrosPaginados = rubrosFiltrados.slice(indiceInicio, indiceFin)

  const paginationState = {
    currentPage: paginaActual,
    itemsPerPage: itemsPorPagina,
    totalItems: rubrosFiltrados.length,
    totalPages: totalPaginas,
  }

  // Handlers
  const handlePageChange = (page: number) => {
    setPaginaActual(page)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPorPagina(items)
    setPaginaActual(1)
  }

  const handleFiltroChange = (filtro: FiltroTipo) => {
    setFiltroActual(filtro)
    setPaginaActual(1)
  }

  const handleBusquedaChange = (busqueda: string) => {
    setBusqueda(busqueda)
    setPaginaActual(1)
  }

  const handleNuevoRubro = () => {
    setRubroSeleccionado(null)
    setRubroPadreParaSubrubro(null)
    setShowForm(true)
  }

  const handleNuevoSubrubro = (rubroPadre: RubroInsumoDto) => {
    setRubroSeleccionado(null)
    setRubroPadreParaSubrubro(rubroPadre)
    setShowForm(true)
  }

  const handleEditarRubro = (rubro: RubroInsumoDto) => {
    setRubroSeleccionado(rubro)
    setRubroPadreParaSubrubro(null)
    setShowForm(true)
  }

  const handleVerDetalles = (rubro: RubroInsumoDto) => {
    setRubroSeleccionado(rubro)
    setShowDetails(true)
  }

  const handleToggleStatus = async (rubro: RubroInsumoDto) => {
    const accion = rubro.isActivo() ? "desactivar" : "activar"
    const confirmado = await NotificationService.confirm(
      `¿Estás seguro de que deseas ${accion} el rubro "${rubro.getNombre()}"?`,
      `Confirmar ${accion}`,
    )

    if (confirmado) {
      try {
        setLoading(true)
        await RubroInsumoServicio.toggleEstadoRubro(rubro.getIdRubroInsumo())
        await fetchRubros() // Recargar la lista
        NotificationService.success(`Rubro ${accion === "activar" ? "activado" : "desactivado"} correctamente`)
      } catch (error) {
        NotificationService.error(`Error al ${accion} el rubro`)
        console.error(`Error al ${accion} rubro:`, error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmitForm = async (nuevoRubro: NuevoRubroInsumoDto) => {
    try {
      setFormLoading(true)

      if (rubroSeleccionado) {
        // Editar rubro existente
        await RubroInsumoServicio.actualizarRubro(rubroSeleccionado.getIdRubroInsumo(), nuevoRubro)
        NotificationService.success("Rubro actualizado correctamente")
      } else {
        // Crear nuevo rubro
        await RubroInsumoServicio.crearRubro(nuevoRubro)
        NotificationService.success("Rubro creado correctamente")
      }

      setShowForm(false)
      setRubroSeleccionado(null)
      setRubroPadreParaSubrubro(null)
      await fetchRubros() // Recargar la lista
    } catch (error) {
      const mensaje = rubroSeleccionado ? "Error al actualizar el rubro" : "Error al crear el rubro"
      NotificationService.error(mensaje)
      console.error("Error en formulario:", error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setRubroSeleccionado(null)
    setRubroPadreParaSubrubro(null)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setRubroSeleccionado(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Gestión de Rubros"
        subtitle="Administra los rubros e insumos del sistema"
        showBackButton
        backTo="/admin/dashboard"
        breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Rubros" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filtros */}
          <RubrosFilters
            totalRubros={estadisticas.total}
            rubrosActivos={estadisticas.activos}
            rubrosInactivos={estadisticas.inactivos}
            rubrosPadre={estadisticas.principales}
            subrubros={estadisticas.subrubros}
            filtroActual={filtroActual}
            onFiltroChange={handleFiltroChange}
            busqueda={busqueda}
            onBusquedaChange={handleBusquedaChange}
          />

          {/* Tabla */}
          <RubrosTable
            rubros={rubrosPaginados}
            loading={loading}
            pagination={paginationState}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onEdit={handleEditarRubro}
            onViewDetails={handleVerDetalles}
            onToggleStatus={handleToggleStatus}
            onNuevoRubro={handleNuevoRubro}
            onNuevoSubrubro={handleNuevoSubrubro}
            filtroActual={filtroActual}
            todosLosRubros={todosLosRubros}
          />
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <RubroForm
          rubro={rubroSeleccionado || undefined}
          rubros={rubros}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          loading={formLoading}
          rubroPadrePreseleccionado={rubroPadreParaSubrubro || undefined}
        />
      )}

      {/* Modal de detalles */}
      {showDetails && rubroSeleccionado && (
        <RubroDetailsModal rubro={rubroSeleccionado} rubros={rubros} onClose={handleCloseDetails} />
      )}
    </div>
  )
}
