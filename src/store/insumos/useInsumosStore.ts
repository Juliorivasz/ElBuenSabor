import { create } from "zustand"
import type { InsumoAbmDTO } from "../../models/dto/InsumoAbmDTO"
import type { NuevoInsumoDTO } from "../../models/dto/NuevoInsumoDTO"
import type { RubroInsumoDTO } from "../../models/dto/RubroInsumoDTO"
import type { UnidadMedidaDTO } from "../../models/dto/UnidadMedidaDTO"
import {
  fetchInsumosAbm,
  createInsumo,
  updateInsumo,
  toggleInsumoStatus,
  fetchRubrosInsumo,
  fetchUnidadesMedida,
} from "../../services/insumoAbmServicio"
import { NotificationService } from "../../utils/notifications"

interface InsumosState {
  // Estado
  insumos: InsumoAbmDTO[]
  rubros: RubroInsumoDTO[]
  unidadesMedida: UnidadMedidaDTO[]
  loading: boolean
  error: string | null

  // Paginación
  currentPage: number
  pageSize: number
  totalPages: number
  totalElements: number

  // Filtros
  searchTerm: string
  estadoFilter: boolean | null
  costoMinFilter: number | null
  costoMaxFilter: number | null

  // Acciones
  fetchInsumos: () => Promise<void>
  createNewInsumo: (insumo: NuevoInsumoDTO) => Promise<void>
  updateExistingInsumo: (id: number, insumo: Partial<InsumoAbmDTO>) => Promise<void>
  toggleStatus: (id: number) => Promise<void>
  fetchRubros: () => Promise<void>
  fetchUnidades: () => Promise<void>

  // Paginación
  setPage: (page: number) => void
  setPageSize: (size: number) => void

  // Filtros
  setSearchTerm: (term: string) => void
  setEstadoFilter: (estado: boolean | null) => void
  setCostoFilter: (min: number | null, max: number | null) => void
  clearFilters: () => void

  // Utilidades
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useInsumosStore = create<InsumosState>((set, get) => ({
  // Estado inicial
  insumos: [],
  rubros: [],
  unidadesMedida: [],
  loading: false,
  error: null,

  // Paginación inicial
  currentPage: 0,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0,

  // Filtros iniciales
  searchTerm: "",
  estadoFilter: null,
  costoMinFilter: null,
  costoMaxFilter: null,

  // Acciones
  fetchInsumos: async () => {
    const state = get()
    set({ loading: true, error: null })

    try {
      const response = await fetchInsumosAbm(
        state.currentPage,
        state.pageSize,
        state.searchTerm || undefined,
        state.estadoFilter ?? undefined,
        state.costoMinFilter ?? undefined,
        state.costoMaxFilter ?? undefined,
      )

      set({
        insumos: response.insumos,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar insumos"
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage)
    }
  },

  createNewInsumo: async (insumo: NuevoInsumoDTO) => {
    set({ loading: true, error: null })

    try {
      await createInsumo(insumo)
      NotificationService.success("Insumo creado exitosamente")

      // Recargar la lista
      await get().fetchInsumos()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear insumo"
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage)
      throw error
    }
  },

  updateExistingInsumo: async (id: number, insumo: Partial<InsumoAbmDTO>) => {
    set({ loading: true, error: null })

    try {
      await updateInsumo(id, insumo)
      NotificationService.success("Insumo actualizado exitosamente")

      // Recargar la lista
      await get().fetchInsumos()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar insumo"
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage)
      throw error
    }
  },

  toggleStatus: async (id: number) => {
    const confirmed = await NotificationService.confirm("¿Está seguro que desea cambiar el estado de este insumo?")

    if (!confirmed) return

    set({ loading: true, error: null })

    try {
      await toggleInsumoStatus(id)
      NotificationService.success("Estado del insumo actualizado")

      // Recargar la lista
      await get().fetchInsumos()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cambiar estado del insumo"
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage)
    }
  },

  fetchRubros: async () => {
    try {
      const rubros = await fetchRubrosInsumo()
      set({ rubros })
    } catch (error) {
      console.error("Error fetching rubros:", error)
    }
  },

  fetchUnidades: async () => {
    try {
      const unidadesMedida = await fetchUnidadesMedida()
      set({ unidadesMedida })
    } catch (error) {
      console.error("Error fetching unidades medida:", error)
    }
  },

  // Paginación
  setPage: (page: number) => {
    set({ currentPage: page })
    get().fetchInsumos()
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 0 })
    get().fetchInsumos()
  },

  // Filtros
  setSearchTerm: (term: string) => {
    set({ searchTerm: term, currentPage: 0 })
    // Solo llamar fetchInsumos si el término está vacío o tiene al menos 2 caracteres
    if (term === "" || term.length >= 2) {
      get().fetchInsumos()
    }
  },

  setEstadoFilter: (estado: boolean | null) => {
    set({ estadoFilter: estado, currentPage: 0 })
    get().fetchInsumos()
  },

  setCostoFilter: (min: number | null, max: number | null) => {
    set({ costoMinFilter: min, costoMaxFilter: max, currentPage: 0 })
    get().fetchInsumos()
  },

  clearFilters: () => {
    set({
      searchTerm: "",
      estadoFilter: null,
      costoMinFilter: null,
      costoMaxFilter: null,
      currentPage: 0,
    })
    get().fetchInsumos()
  },

  // Utilidades
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}))
