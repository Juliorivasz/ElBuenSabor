import { interceptorsApiClient } from "./interceptors/axios.interceptors"
import { InformacionArticuloNoElaboradoDto } from "../models/dto/InformacionArticuloNoElaboradoDto"

import type {
  InformacionArticuloNoElaboradoApi,
  PaginatedResponseAbmNoElaborado,
  PaginatedResponseAbmNoElaboradoApi,
} from "./types/abm/InformacionArticuloNoElaborado"
import type { NuevoArticuloNoElaboradoDto } from "../models/dto/NuevoArticuloNoElaboradoDto"

const parseInformacionArticuloNoElaboradoDto = (data: InformacionArticuloNoElaboradoApi) => {
  return new InformacionArticuloNoElaboradoDto(
    data.idArticulo,
    data.nombre,
    data.descripcion,
    data.precioVenta,
    data.precioModificado,
    data.dadoDeAlta,
    data.idCategoria,
    data.nombreCategoria,
    data.imagenUrl,
    data.stock,
  )
}

export const fetchArticulosNoElaboradosAbm = async (
  page: number,
  itemsPerPage = 12,
): Promise<PaginatedResponseAbmNoElaborado> => {
  const response = await interceptorsApiClient.get(`/articuloNoElaborado/abm?page=${page}&size=${itemsPerPage}`)

  const data: PaginatedResponseAbmNoElaboradoApi = response.data
  console.log(data)
  const content = data.content.map(parseInformacionArticuloNoElaboradoDto)

  return { ...data, content: content }
}

// Función para crear un nuevo artículo no elaborado
export const crearArticuloNoElaborado = async (producto: NuevoArticuloNoElaboradoDto, file?: File) => {
  const formData = new FormData()

  // Agregar el JSON del artículo
  formData.append("articulo", JSON.stringify(producto.toJSON()))

  // Agregar el archivo si existe
  if (file) {
    formData.append("file", file)
    console.log("Archivo adjuntado:", file.name, file.type, file.size)
  }

  console.log("Enviando datos:", JSON.stringify(producto.toJSON()))

  const response = await interceptorsApiClient.post("/articuloNoElaborado/nuevo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  console.log("Respuesta del servidor:", response.data)
  return response.data
}

// Función para actualizar un artículo no elaborado
export const actualizarArticuloNoElaborado = async (
  id: number,
  producto: InformacionArticuloNoElaboradoDto,
  file?: File,
) => {
  const formData = new FormData()

  // Convertir el DTO a la estructura requerida por la API
  formData.append("articulo", JSON.stringify(producto.toJSON()))

  console.log("Respuesta del servidor para actualización:", producto.toJSON())

  // Agregar el archivo si existe
  if (file) {
    formData.append("file", file)
    console.log("Archivo adjuntado para actualización:", file.name, file.type, file.size)
  }

  const response = await interceptorsApiClient.put(`/articuloNoElaborado/modificar/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  console.log("Respuesta del servidor para actualización:", response.data)
  return true
}
