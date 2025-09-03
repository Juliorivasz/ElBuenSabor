import { create } from "zustand"
import { persist } from "zustand/middleware"
import { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto"
import { rubroInsumoAbmServicio } from "../../services/rubroInsumoAbmServicio"

interface RubrosInsumoState {
  rubros: RubroInsumoAbmDto[]
  rubrosLista: RubroInsumoAbmDto[]
  loading: boolean
  error: string | null

  // Actions
  fetchRubros: () => Promise<void>
  fetchRubrosLista: () => Promise<void>
  altaBajaRubro: (idRubroInsumo: number) => Promise<void>
  clearError: () => void
}

export const useRubrosInsumoStore = create<RubrosInsumoState>()(
  persist(
    (set, get) => ({
      rubros: [],
      rubrosLista: [],
      loading: false,
      error: null,

      fetchRubros: async () => {
        set({ loading: true, error: null })
        try {
          const rubrosData = await rubroInsumoAbmServicio.obtenerRubrosAbm()
          // Convertir los objetos planos en instancias de RubroInsumoAbmDto
          const rubros = rubrosData.map(RubroInsumoAbmDto.fromPlainObject)
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
    }),
    {
      name: "rubros-insumo-storage",
    },
  ),
)
