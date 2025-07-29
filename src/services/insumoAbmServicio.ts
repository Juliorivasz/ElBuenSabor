import { InsumoAbmDto } from "../models/dto/InsumoAbmDto"
import { UnidadDeMedidaDto } from "../models/dto/UnidadDeMedidaDto"
import { RubroInsumoAbmDto } from "../models/dto/RubroInsumoAbmDto"
import { InsumoDTO } from "../models/dto/InsumoDTO"
import type { NuevoInsumoDto } from "../models/dto/NuevoInsumoDto"
import type { ModificarInsumoDto } from "../models/dto/ModificarInsumoDto"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"

type InsumoAbmApiResponse = {
  content: Array<{
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
  }>
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

type UnidadDeMedidaApiResponse = {
  lista: Array<{
    idUnidadDeMedida: number
    nombre: string
  }>
}

type RubroInsumoApiResponse = {
  arregloRubros: Array<{
    idRubroInsumo: number
    nombre: string
  }>
}

type InsumoListaApiResponse = {
  insumos: Array<{
    idArticuloInsumo: number
    unidadDeMedida: string
    nombre: string
    costo: number
  }>
}

type RecargarStockRequest = {
  lista: Array<{
    idArticuloInsumo: number
    cantidad: number
  }>
}

const parseInsumoAbmDto = (data: any): InsumoAbmDto => {
  return new InsumoAbmDto(
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

const parseUnidadDeMedidaDto = (data: any): UnidadDeMedidaDto => {
  return new UnidadDeMedidaDto(data.idUnidadDeMedida, data.nombre)
}

const parseInsumoDto = (data: any): InsumoDTO => {
  return new InsumoDTO(data.idArticuloInsumo, data.unidadDeMedida, data.nombre, data.costo)
}

export const fetchInsumosAbm = async (
  page = 0,
  size = 10,
): Promise<{
  content: InsumoAbmDto[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}> => {
  const response = await interceptorsApiClient.get(`/insumo/abm?page=${page}&size=${size}`)
  const data: InsumoAbmApiResponse = response.data

  return {
    content: data.content.map(parseInsumoAbmDto),
    page: data.page,
  }
}

export const fetchUnidadesDeMedida = async (): Promise<UnidadDeMedidaDto[]> => {
  const response = await interceptorsApiClient.get("/unidadDeMedida/lista")
  const data: UnidadDeMedidaApiResponse = response.data
  return data.lista.map(parseUnidadDeMedidaDto)
}

export const fetchRubrosInsumo = async (): Promise<RubroInsumoAbmDto[]> => {
  const response = await interceptorsApiClient.get("/rubroInsumo/lista")
  const data: Array<{ idRubroInsumo: number; nombre: string }> = response.data

  // Convertir el formato simple a RubroInsumoAbmDto
  return data.map(
    (item) =>
      new RubroInsumoAbmDto(
        item.idRubroInsumo,
        item.nombre,
        true, // dadoDeAlta - asumimos que están activos en la lista
        null, // idRubroPadre - no viene en la respuesta
        null, // rubroPadre - no viene en la respuesta
        0, // cantInsumos - no viene en la respuesta
        [], // insumos - no viene en la respuesta
      ),
  )
}

export const fetchInsumosLista = async (): Promise<InsumoDTO[]> => {
  const response = await interceptorsApiClient.get("/insumo/lista")
  const data: InsumoListaApiResponse = response.data
  return data.insumos.map(parseInsumoDto)
}

export const altaBajaInsumo = async (idArticuloInsumo: number): Promise<void> => {
  await interceptorsApiClient.put(`/insumo/altaBaja/${idArticuloInsumo}`)
}

export const crearInsumo = async (insumo: NuevoInsumoDto): Promise<void> => {
  const requestBody = {
    nombre: insumo.getNombre(),
    stockActual: insumo.getStockActual(),
    stockMinimo: insumo.getStockMinimo(),
    stockMaximo: insumo.getStockMaximo(),
    dadoDeAlta: insumo.isDadoDeAlta(),
    idUnidadDeMedida: insumo.getIdUnidadDeMedida(),
    idRubroInsumo: insumo.getIdRubroInsumo(),
    costo: insumo.getCosto(),
  }

  await interceptorsApiClient.post("/insumo/nuevo", requestBody)
}

export const modificarInsumo = async (idArticuloInsumo: number, insumo: ModificarInsumoDto): Promise<void> => {
  const requestBody = {
    nombre: insumo.getNombre(),
    stockMinimo: insumo.getStockMinimo(),
    stockMaximo: insumo.getStockMaximo(),
    dadoDeAlta: insumo.isDadoDeAlta(),
    idRubroInsumo: insumo.getIdRubroInsumo(),
    idUnidadDeMedida: insumo.getIdUnidadDeMedida(),
    costo: insumo.getCosto(),
  }

  await interceptorsApiClient.put(`/insumo/modificar/${idArticuloInsumo}`, requestBody)
}

export const recargarStock = async (request: RecargarStockRequest): Promise<void> => {
  await interceptorsApiClient.put("/insumo/recargaStock", request)
}
