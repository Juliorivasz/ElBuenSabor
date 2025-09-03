import { create } from "zustand"
import { persist } from "zustand/middleware"
import { RubroInsumoDto } from "../../models/dto/RubroInsumoDto"
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

export const useRubrosStore = create<RubrosState>()(
  persist(
    (set, get) => ({
      rubros: [],
      loading: false,
      error: null,

      fetchRubros: async () => {
        set({ loading: true, error: null })
        try {
          const rubros = await RubroInsumoServicio.listarRubros()
          // Los rubros ya vienen como instancias desde el servicio
          set({ rubros, loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error al cargar rubros",
            loading: false,
          })
        }
      },

      setRubros: (rubros) => {
        // Asegurar que todos los rubros sean instancias de RubroInsumoDto
        const rubrosInstancias = rubros.map((rubro) =>
          rubro instanceof RubroInsumoDto ? rubro : RubroInsumoDto.fromPlainObject(rubro),
        )
        set({ rubros: rubrosInstancias })
      },

      addRubro: (rubro) => {
        const { rubros } = get()
        // Asegurar que el nuevo rubro sea una instancia
        const rubroInstancia = rubro instanceof RubroInsumoDto ? rubro : RubroInsumoDto.fromPlainObject(rubro)
        set({ rubros: [...rubros, rubroInstancia] })
      },

      updateRubro: (rubroActualizado) => {
        const { rubros } = get()
        // Asegurar que el rubro actualizado sea una instancia
        const rubroInstancia =
          rubroActualizado instanceof RubroInsumoDto
            ? rubroActualizado
            : RubroInsumoDto.fromPlainObject(rubroActualizado)
        const rubrosActualizados = rubros.map((rubro) =>
          rubro.getIdRubroInsumo() === rubroInstancia.getIdRubroInsumo() ? rubroInstancia : rubro,
        )
        set({ rubros: rubrosActualizados })
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "rubros-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          return {
            ...parsed,
            state: {
              ...parsed.state,
              rubros: parsed.state.rubros.map((rubro: any) => RubroInsumoDto.fromPlainObject(rubro)),
            },
          }
        },
        setItem: (name, value) => {
          // Ensure rubros are serialized properly
          const parsed = typeof value === "string" ? JSON.parse(value) : value
          parsed.state.rubros = parsed.state.rubros.map((rubro: any) =>
            typeof rubro.toJSON === "function" ? rubro.toJSON() : rubro,
          )
          localStorage.setItem(name, JSON.stringify(parsed))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)
