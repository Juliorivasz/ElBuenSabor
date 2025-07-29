import { RubroInsumoAbmDto } from "../models/dto/RubroInsumoAbmDto"
import type { NuevoRubroInsumoDto } from "../models/dto/NuevoRubroInsumoDto"
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
  return new RubroInsumoAbmDto(
    data.idRubroInsumo,
    data.nombre,
    data.dadoDeAlta,
    data.idRubroPadre,
    data.rubroPadre,
    data.cantInsumos,
    data.insumos || [],
  )
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

  obtenerRubrosLista: async (): Promise<Array<{ idRubroInsumo: number; nombre: string }>> => {
    try {
      const response = await interceptorsApiClient.get("/rubroInsumo/lista")
      const data: RubroInsumoListaApiResponse = response.data
      return data
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
      const requestBody = {
        nombre: rubro.getNombre(),
        dadoDeAlta: rubro.isDadoDeAlta(),
        idRubroInsumoPadre: rubro.getIdRubroInsumoPadre(),
      }
      await interceptorsApiClient.post("/rubroInsumo/nuevo", requestBody)
    } catch (error) {
      console.error("Error al crear rubro:", error)
      throw error
    }
  },

  modificarRubro: async (idRubroInsumo: number, rubro: NuevoRubroInsumoDto): Promise<void> => {
    try {
      const requestBody = {
        nombre: rubro.getNombre(),
        dadoDeAlta: rubro.isDadoDeAlta(),
        idRubroInsumoPadre: rubro.getIdRubroInsumoPadre(),
      }
      await interceptorsApiClient.put(`/rubroInsumo/modificar/${idRubroInsumo}`, requestBody)
    } catch (error) {
      console.error("Error al modificar rubro:", error)
      throw error
    }
  },
}
