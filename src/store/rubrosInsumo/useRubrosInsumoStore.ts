import { create } from "zustand"
import type { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto"
import { rubroInsumoAbmServicio } from "../../services/rubroInsumoAbmServicio"

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface RubrosInsumoState {
  rubros: RubroInsumoAbmDto[]
  rubrosLista: Array<{ idRubroInsumo: number; nombre: string }>
  loading: boolean
  error: string | null
  pagination: PaginationState

  // Actions
  fetchRubros: () => Promise<void>
  fetchRubrosLista: () => Promise<void>
  altaBajaRubro: (idRubroInsumo: number) => Promise<void>
  clearError: () => void
  setPagination: (pagination: Partial<PaginationState>) => void
}

const initialPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
}

export const useRubrosInsumoStore = create<RubrosInsumoState>((set, get) => ({
  rubros: [],
  rubrosLista: [],
  loading: false,
  error: null,
  pagination: { ...initialPagination },

  fetchRubros: async () => {
    set({ loading: true, error: null })
    try {
      const rubros = await rubroInsumoAbmServicio.obtenerRubrosAbm()
      set({
        rubros,
        loading: false,
        pagination: {
          ...get().pagination,
          totalItems: rubros.length,
          totalPages: Math.ceil(rubros.length / get().pagination.itemsPerPage),
        },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al cargar rubros",
        loading: false,
      })
    }
  },

  fetchRubrosLista: async () => {
    try {
      const rubrosLista = await rubroInsumoAbmServicio.obtenerRubrosLista()
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

  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
}))
