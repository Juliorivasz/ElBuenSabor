import { InsumoAbmDTO } from "../models/dto/InsumoAbmDTO"
import type { NuevoInsumoDTO } from "../models/dto/NuevoInsumoDTO"
import { RubroInsumoDTO } from "../models/dto/RubroInsumoDTO"
import { UnidadMedidaDTO } from "../models/dto/UnidadMedidaDTO"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"

// Interfaces para las respuestas de la API
interface InsumoAbmApiResponse {
  idArticuloInsumo: number
  nombre: string
  stockActual: number
  stockMinimo: number
  stockMaximo: number
  dadoDeAlta: boolean
  idRubro: number
  nombreRubro: string
  idUnidadDeMedida: number
  unidadDeMedida: string
  costo?: number
}

interface PaginatedResponse<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

interface RubroInsumoApiResponse {
  idRubroInsumo: number
  nombre: string
}

interface UnidadMedidaApiResponse {
  idUnidadDeMedida: number
  nombre: string
}

// Funciones de mapeo
const parseInsumoAbmDTO = (data: InsumoAbmApiResponse): InsumoAbmDTO => {
  return new InsumoAbmDTO(
    data.idArticuloInsumo,
    data.nombre,
    data.stockActual,
    data.stockMinimo,
    data.stockMaximo,
    data.dadoDeAlta,
    data.idRubro,
    data.nombreRubro,
    data.idUnidadDeMedida,
    data.unidadDeMedida,
    data.costo || 0,
  )
}

const parseRubroInsumoDTO = (data: RubroInsumoApiResponse): RubroInsumoDTO => {
  return new RubroInsumoDTO(data.idRubroInsumo, data.nombre)
}

const parseUnidadMedidaDTO = (data: UnidadMedidaApiResponse): UnidadMedidaDTO => {
  return new UnidadMedidaDTO(data.idUnidadDeMedida, data.nombre)
}

// Servicios
export const fetchInsumosAbm = async (
  page = 0,
  size = 10,
  search?: string,
  estado?: boolean,
  costoMin?: number,
  costoMax?: number,
): Promise<{
  insumos: InsumoAbmDTO[]
  totalPages: number
  totalElements: number
  currentPage: number
  pageSize: number
}> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })

    if (search) {
      params.append("search", search)
    }
    if (estado !== undefined) {
      params.append("estado", estado.toString())
    }
    if (costoMin !== undefined) {
      params.append("costoMin", costoMin.toString())
    }
    if (costoMax !== undefined) {
      params.append("costoMax", costoMax.toString())
    }

    const response = await interceptorsApiClient.get(`/insumo/abm?${params.toString()}`)
    const data: PaginatedResponse<InsumoAbmApiResponse> = response.data

    return {
      insumos: data.content.map(parseInsumoAbmDTO),
      totalPages: data.page.totalPages,
      totalElements: data.page.totalElements,
      currentPage: data.page.number,
      pageSize: data.page.size,
    }
  } catch (error) {
    console.error("Error fetching insumos:", error)
    throw error
  }
}

export const createInsumo = async (nuevoInsumo: NuevoInsumoDTO): Promise<void> => {
  try {
    await interceptorsApiClient.post("/insumo/nuevo", nuevoInsumo.toJSON())
  } catch (error) {
    console.error("Error creating insumo:", error)
    throw error
  }
}

export const updateInsumo = async (id: number, insumo: Partial<InsumoAbmDTO>): Promise<void> => {
  try {
    await interceptorsApiClient.put(`/insumo/modificar/${id}`, insumo)
  } catch (error) {
    console.error("Error updating insumo:", error)
    throw error
  }
}

export const toggleInsumoStatus = async (id: number): Promise<void> => {
  try {
    await interceptorsApiClient.post(`/insumo/altaBaja/${id}`)
  } catch (error) {
    console.error("Error toggling insumo status:", error)
    throw error
  }
}

export const fetchRubrosInsumo = async (): Promise<RubroInsumoDTO[]> => {
  try {
    const response = await interceptorsApiClient.get("/rubroInsumo/lista")
    console.log(response.data)
    return response.data.arregloRubros.map(parseRubroInsumoDTO)
  } catch (error) {
    console.error("Error fetching rubros insumo:", error)
    throw error
  }
}

export const fetchUnidadesMedida = async (): Promise<UnidadMedidaDTO[]> => {
  try {
    const response = await interceptorsApiClient.get("/unidadDeMedida/lista")
    console.log(response.data.lista)
    return response.data.lista.map(parseUnidadMedidaDTO)
  } catch (error) {
    console.error("Error fetching unidades medida:", error)
    throw error
  }
}
