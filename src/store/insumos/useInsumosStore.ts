import { create } from "zustand"
import type { InsumoAbmDto } from "../../models/dto/InsumoAbmDto"
import type { UnidadDeMedidaDto } from "../../models/dto/UnidadDeMedidaDto"
import type { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto"
import type { NuevoInsumoDto } from "../../models/dto/NuevoInsumoDto"
import type { ModificarInsumoDto } from "../../models/dto/ModificarInsumoDto"
import {
  fetchInsumosAbm,
  fetchUnidadesDeMedida,
  fetchRubrosInsumo,
  altaBajaInsumo,
  crearInsumo,
  modificarInsumo,
} from "../../services/insumoAbmServicio"
import { useAuth0Store } from "../auth/useAuth0Store"

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface FiltersState {
  searchTerm: string
  rubroFilter: number
  estadoFilter: "todos" | "activos" | "inactivos"
}

// Helper function to wait for token to be ready
const waitForToken = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkToken = () => {
      const { isTokenReady } = useAuth0Store.getState()
      if (isTokenReady) {
        resolve()
      } else {
        setTimeout(checkToken, 100)
      }
    }
    checkToken()
  })
}

interface InsumosStore {
  // Estados principales
  insumos: InsumoAbmDto[]
  unidadesDeMedida: UnidadDeMedidaDto[]
  rubrosInsumo: RubroInsumoAbmDto[]
  loading: boolean
  error: string | null

  // Estados de paginación y filtros
  pagination: PaginationState
  filters: FiltersState

  // Actions principales
  fetchInsumos: (page?: number, itemsPerPage?: number) => Promise<void>
  fetchUnidadesDeMedida: () => Promise<void>
  fetchRubrosInsumo: () => Promise<void>
  toggleInsumoStatus: (id: number) => Promise<void>
  createInsumo: (insumo: NuevoInsumoDto) => Promise<void>
  updateInsumo: (id: number, insumo: ModificarInsumoDto) => Promise<void>

  // Actions de paginación y filtros
  setPagination: (pagination: Partial<PaginationState>) => void
  setFilters: (filters: Partial<FiltersState>) => void
  setSearchTerm: (searchTerm: string) => void
  setRubroFilter: (rubroId: number) => void
  setEstadoFilter: (estado: "todos" | "activos" | "inactivos") => void

  // Actions de utilidad
  setError: (error: string | null) => void
  clearFilters: () => void
  refreshInsumos: () => Promise<void>
}

const initialPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
}

const initialFilters: FiltersState = {
  searchTerm: "",
  rubroFilter: 0,
  estadoFilter: "todos",
}

export const useInsumosStore = create<InsumosStore>((set, get) => ({
  // Estados iniciales
  insumos: [],
  unidadesDeMedida: [],
  rubrosInsumo: [],
  loading: false,
  error: null,
  pagination: { ...initialPagination },
  filters: { ...initialFilters },

  // Actions principales
  fetchInsumos: async (page, itemsPerPage) => {
    await waitForToken()

    const currentPagination = get().pagination
    const finalPage = page ?? currentPagination.currentPage
    const finalItemsPerPage = itemsPerPage ?? currentPagination.itemsPerPage

    set({ loading: true, error: null })
    try {
      const response = await fetchInsumosAbm(finalPage - 1, finalItemsPerPage)
      set({
        insumos: response.content,
        loading: false,
        pagination: {
          currentPage: finalPage,
          itemsPerPage: finalItemsPerPage,
          totalItems: response.page.totalElements,
          totalPages: response.page.totalPages,
        },
      })
    } catch (error) {
      console.error("Error al cargar insumos:", error)
      set({ error: (error as Error).message, loading: false })
    }
  },

  fetchUnidadesDeMedida: async () => {
    await waitForToken()

    try {
      const unidades = await fetchUnidadesDeMedida()
      set({ unidadesDeMedida: unidades })
    } catch (error) {
      console.error("Error al cargar unidades de medida:", error)
      set({ error: (error as Error).message })
    }
  },

  fetchRubrosInsumo: async () => {
    await waitForToken()

    try {
      const rubros = await fetchRubrosInsumo()
      set({ rubrosInsumo: rubros })
    } catch (error) {
      console.error("Error al cargar rubros de insumo:", error)
      set({ error: (error as Error).message })
    }
  },

  toggleInsumoStatus: async (id) => {
    await waitForToken()

    try {
      const currentInsumo = get().insumos.find((insumo) => insumo.getIdArticuloInsumo() === id)
      if (!currentInsumo) {
        throw new Error("Insumo no encontrado")
      }

      const newStatus = !currentInsumo.isDadoDeAlta()

      // Actualización optimista
      set((state) => ({
        insumos: state.insumos.map((insumo) => {
          if (insumo.getIdArticuloInsumo() === id) {
            const updatedInsumo = Object.create(Object.getPrototypeOf(insumo))
            Object.assign(updatedInsumo, insumo)
            updatedInsumo.setDadoDeAlta(newStatus)
            return updatedInsumo
          }
          return insumo
        }),
      }))

      await altaBajaInsumo(id)
    } catch (error) {
      console.error("Error en toggleInsumoStatus:", error)
      set({ error: (error as Error).message })
      // Revertir cambio optimista recargando los datos
      await get().refreshInsumos()
      throw error
    }
  },

  createInsumo: async (insumo) => {
    await waitForToken()

    set({ loading: true, error: null })
    try {
      await crearInsumo(insumo)
      await get().refreshInsumos()
    } catch (error) {
      console.error("Error al crear insumo:", error)
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateInsumo: async (id, insumo) => {
    await waitForToken()

    set({ loading: true, error: null })
    try {
      await modificarInsumo(id, insumo)
      await get().refreshInsumos()
    } catch (error) {
      console.error("Error al actualizar insumo:", error)
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  // Actions de paginación y filtros
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setSearchTerm: (searchTerm) =>
    set((state) => ({
      filters: { ...state.filters, searchTerm },
    })),

  setRubroFilter: (rubroId) =>
    set((state) => ({
      filters: { ...state.filters, rubroFilter: rubroId },
    })),

  setEstadoFilter: (estado) =>
    set((state) => ({
      filters: { ...state.filters, estadoFilter: estado },
    })),

  // Actions de utilidad
  setError: (error) => set({ error }),

  clearFilters: () => set({ filters: { ...initialFilters } }),

  refreshInsumos: async () => {
    const { pagination } = get()
    await get().fetchInsumos(pagination.currentPage, pagination.itemsPerPage)
  },
}))
