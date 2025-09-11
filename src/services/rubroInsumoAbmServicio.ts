import type { NuevoRubroInsumoDto } from "../models/dto/NuevoRubroInsumoDto"
import { RubroInsumoAbmDto } from "../models/dto/RubroInsumoAbmDto"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"

type RubroInsumoAbmApiResponse = Array<{
  idRubroInsumo: number
  nombre: string
  dadoDeAlta: boolean
  idRubroPadre: number | null
  rubroPadre: string | null
  cantInsumos: number
  insumos: string[]
}>

type RubroInsumoListaApiResponse = Array<{
  idRubroInsumo: number
  nombre: string
}>

const parseRubroInsumoAbmDto = (data: any): RubroInsumoAbmDto => {
  return RubroInsumoAbmDto.fromPlainObject(data)
}

export const rubroInsumoAbmServicio = {
  obtenerRubrosAbm: async (): Promise<RubroInsumoAbmDto[]> => {
    try {
      const response = await interceptorsApiClient.get("/rubroInsumo/abm")
      const data: RubroInsumoAbmApiResponse = response.data
      return data.map(parseRubroInsumoAbmDto)
    } catch (error) {
      console.error("Error al obtener rubros ABM:", error)
      throw error
    }
  },

  obtenerRubrosLista: async (): Promise<RubroInsumoAbmDto[]> => {
    try {
      const response = await interceptorsApiClient.get("/rubroInsumo/lista")
      const data: RubroInsumoListaApiResponse = response.data
      return data.map((item) =>
        RubroInsumoAbmDto.fromPlainObject({
          idRubroInsumo: item.idRubroInsumo,
          nombre: item.nombre,
          dadoDeAlta: true, // Lista endpoint assumes active items
          idRubroPadre: null, // Not provided by lista endpoint
          rubroPadre: null, // Not provided by lista endpoint
          cantInsumos: 0, // Not provided by lista endpoint
          insumos: [], // Not provided by lista endpoint
        }),
      )
    } catch (error) {
      console.error("Error al obtener lista de rubros:", error)
      throw error
    }
  },

  altaBajaRubro: async (idRubroInsumo: number): Promise<void> => {
    try {
      await interceptorsApiClient.put(`/rubroInsumo/altaBaja/${idRubroInsumo}`)
    } catch (error) {
      console.error("Error al cambiar estado del rubro:", error)
      throw error
    }
  },

  crearRubro: async (rubro: NuevoRubroInsumoDto): Promise<void> => {
    try {
      await interceptorsApiClient.post("/rubroInsumo/nuevo", rubro.toJSON())
    } catch (error) {
      console.error("Error al crear rubro:", error)
      throw error
    }
  },

  modificarRubro: async (idRubroInsumo: number, rubro: NuevoRubroInsumoDto): Promise<void> => {
    try {
      await interceptorsApiClient.put(`/rubroInsumo/modificar/${idRubroInsumo}`, rubro.toJSON())
    } catch (error) {
      console.error("Error al modificar rubro:", error)
      throw error
    }
  },
}
