import { create } from "zustand"
import type { RubroInsumoDto } from "../../models/dto/RubroInsumoDto"
import { RubroInsumoServicio } from "../../services/rubroInsumoServicio"

interface RubrosState {
  rubros: RubroInsumoDto[]
  loading: boolean
  error: string | null

  // Actions
  fetchRubros: () => Promise<void>
  setRubros: (rubros: RubroInsumoDto[]) => void
  addRubro: (rubro: RubroInsumoDto) => void
  updateRubro: (rubro: RubroInsumoDto) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useRubrosStore = create<RubrosState>((set, get) => ({
  rubros: [],
  loading: false,
  error: null,

  fetchRubros: async () => {
    set({ loading: true, error: null })
    try {
      const rubros = await RubroInsumoServicio.listarRubros()
      set({ rubros, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al cargar rubros",
        loading: false,
      })
    }
  },

  setRubros: (rubros) => set({ rubros }),

  addRubro: (rubro) => {
    const { rubros } = get()
    set({ rubros: [...rubros, rubro] })
  },

  updateRubro: (rubroActualizado) => {
    const { rubros } = get()
    const rubrosActualizados = rubros.map((rubro) =>
      rubro.getIdRubroInsumo() === rubroActualizado.getIdRubroInsumo() ? rubroActualizado : rubro,
    )
    set({ rubros: rubrosActualizados })
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
