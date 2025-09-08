import { create } from "zustand"
import { persist } from "zustand/middleware"
import { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto"
import { rubroInsumoAbmServicio } from "../../services/rubroInsumoAbmServicio"

interface RubrosInsumoState {
  rubros: RubroInsumoAbmDto[]
  rubrosLista: RubroInsumoAbmDto[]
  loading: boolean
  error: string | null

  filtroActual: "todos" | "activos" | "inactivos" | "padre" | "subrubros"
  busqueda: string
  currentPage: number
  itemsPerPage: number

  // Actions
  fetchRubros: () => Promise<void>
  fetchRubrosLista: () => Promise<void>
  altaBajaRubro: (idRubroInsumo: number) => Promise<void>
  clearError: () => void

  setFiltro: (filtro: "todos" | "activos" | "inactivos" | "padre" | "subrubros") => void
  setBusqueda: (busqueda: string) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void

  getRubrosFiltrados: () => RubroInsumoAbmDto[]
  getRubrosPaginados: () => RubroInsumoAbmDto[]
  getEstadisticas: () => {
    total: number
    activos: number
    inactivos: number
    padre: number
    subrubros: number
  }
  getPaginationInfo: () => {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export const useRubrosInsumoStore = create<RubrosInsumoState>()(
  persist(
    (set, get) => ({
      rubros: [],
      rubrosLista: [],
      loading: false,
      error: null,

  filtroActual: "todos",
  busqueda: "",
  currentPage: 1,
  itemsPerPage: 10,

  fetchRubros: async () => {
    set({ loading: true, error: null })
    try {
      const rubros = await rubroInsumoAbmServicio.obtenerRubrosAbm()
      set({ rubros, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al cargar rubros",
        loading: false,
      })
    }
  },

      fetchRubrosLista: async () => {
        try {
          const rubrosListaData = await rubroInsumoAbmServicio.obtenerRubrosLista()
          // Convertir los objetos planos en instancias
          const rubrosLista = rubrosListaData.map(RubroInsumoAbmDto.fromPlainObject)
          set({ rubrosLista })
        } catch (error) {
          console.error("Error al cargar lista de rubros:", error)
        }
      },

      altaBajaRubro: async (idRubroInsumo: number) => {
        try {
          await rubroInsumoAbmServicio.altaBajaRubro(idRubroInsumo)
          // Refrescar la lista después del cambio
          await get().fetchRubros()
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error al cambiar estado del rubro",
          })
        }
      },

  clearError: () => set({ error: null }),

  setFiltro: (filtro) => {
    set({ filtroActual: filtro, currentPage: 1 })
  },

  setBusqueda: (busqueda) => {
    set({ busqueda, currentPage: 1 })
  },

  setCurrentPage: (currentPage) => {
    set({ currentPage })
  },

  setItemsPerPage: (itemsPerPage) => {
    set({ itemsPerPage, currentPage: 1 })
  },

  getRubrosFiltrados: () => {
    const { rubros, filtroActual, busqueda } = get()

    let filtrados = [...rubros]

    // Aplicar filtro de búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase()
      filtrados = filtrados.filter((rubro) => rubro.getNombre().toLowerCase().includes(busquedaLower))
    }

    // Aplicar filtro de estado/tipo
    switch (filtroActual) {
      case "activos":
        filtrados = filtrados.filter((rubro) => rubro.isDadoDeAlta())
        break
      case "inactivos":
        filtrados = filtrados.filter((rubro) => !rubro.isDadoDeAlta())
        break
      case "padre":
        filtrados = filtrados.filter((rubro) => rubro.esRubroPadre())
        break
      case "subrubros":
        filtrados = filtrados.filter((rubro) => !rubro.esRubroPadre())
        break
      case "todos":
      default:
        // Mostrar todos los rubros sin filtro adicional
        break
    }

    return filtrados
  },

  getRubrosPaginados: () => {
    const { currentPage, itemsPerPage } = get()
    const filtrados = get().getRubrosFiltrados()

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return filtrados.slice(startIndex, endIndex)
  },

  getEstadisticas: () => {
    const { rubros } = get()

    return {
      total: rubros.length,
      activos: rubros.filter((rubro) => rubro.isDadoDeAlta()).length,
      inactivos: rubros.filter((rubro) => !rubro.isDadoDeAlta()).length,
      padre: rubros.filter((rubro) => rubro.esRubroPadre()).length,
      subrubros: rubros.filter((rubro) => !rubro.esRubroPadre()).length,
    }
  },

  getPaginationInfo: () => {
    const { currentPage, itemsPerPage, filtroActual } = get()
    let totalItems: number

    if (filtroActual === "todos") {
      // Para vista jerárquica, contar todos los rubros
      totalItems = get().getRubrosFiltrados().length
    } else {
      totalItems = get().getRubrosFiltrados().length
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
    }
  },
}))
