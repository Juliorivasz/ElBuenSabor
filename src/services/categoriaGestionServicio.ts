import { CategoriaExtendidaDto } from "../models/dto/CategoriaExtendidaDto"
import { ImagenDTO } from "../models/dto/ImagenDTO"
import type { NuevaCategoriaDto } from "../models/dto/NuevaCategoriaDto"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"

interface CategoriaApiResponse {
  idCategoria: number
  nombre: string
  idCategoriaPadre: number
  imagenModel: {
    url: string
  } | null
  margenGanancia?: number
  fechaBaja?: string | null
}

export class CategoriaGestionServicio {
  // GET /categoria/lista
  static async listarCategorias(): Promise<CategoriaExtendidaDto[]> {
    try {
      const response = await interceptorsApiClient.get("/categoria/lista")

      const data: CategoriaApiResponse[] = response.data

      // Convertir a CategoriaExtendidaDto
      const categorias = data.map((item) => {
        const imagenDto = item.imagenModel ? new ImagenDTO(item.imagenModel.url) : new ImagenDTO("")
        return new CategoriaExtendidaDto(
          item.idCategoria,
          item.nombre,
          item.idCategoriaPadre || 0,
          imagenDto,
          typeof item.margenGanancia === "number" ? item.margenGanancia : 0,
          item.fechaBaja ? new Date(item.fechaBaja) : null,
        )
      })

      return categorias
    } catch (error) {
      console.error("Error al listar categorías:", error)
      throw error
    }
  }

  // POST /categoria/nueva
  static async crearCategoria(nuevaCategoria: NuevaCategoriaDto): Promise<CategoriaExtendidaDto> {
    try {
      const response = await interceptorsApiClient.post("/categoria/nueva", nuevaCategoria.toJSON())

      const data: CategoriaApiResponse = response.data
      const imagenDto = data.imagenModel ? new ImagenDTO(data.imagenModel.url) : new ImagenDTO("")

      return new CategoriaExtendidaDto(
        data.idCategoria,
        data.nombre,
        data.idCategoriaPadre || 0,
        imagenDto,
        typeof data.margenGanancia === "number" ? data.margenGanancia : 0,
        data.fechaBaja ? new Date(data.fechaBaja) : null,
      )
    } catch (error) {
      console.error("Error al crear categoría:", error)
      throw error
    }
  }

  // PUT /categoria/actualizar
  static async actualizarCategoria(idCategoria: number, categoria: NuevaCategoriaDto): Promise<CategoriaExtendidaDto> {
    try {
      console.log("Actualizando categoría:", idCategoria, categoria.toJSON())

      const response = await interceptorsApiClient.put(`/categoria/actualizar/${idCategoria}`, categoria.toJSON())

      const data: CategoriaApiResponse = response.data
      console.log("Respuesta de actualización:", data)

      const imagenDto = data.imagenModel ? new ImagenDTO(data.imagenModel.url) : new ImagenDTO("")

      return new CategoriaExtendidaDto(
        data.idCategoria,
        data.nombre,
        data.idCategoriaPadre || 0,
        imagenDto,
        typeof data.margenGanancia === "number" ? data.margenGanancia : 0,
        data.fechaBaja ? new Date(data.fechaBaja) : null,
      )
    } catch (error) {
      console.error("Error al actualizar categoría:", error)
      throw error
    }
  }

  // POST /categoria/altaBaja/{idCategoria}
  static async toggleEstadoCategoria(idCategoria: number): Promise<void> {
    try {
      console.log("Cambiando estado de categoría:", idCategoria)

      await interceptorsApiClient.post(`/categoria/altaBaja/${idCategoria}`)
    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error)
      throw error
    }
  }

  // GET /categoria/obtenerNombre/{idCategoria}
  static async obtenerNombreCategoria(idCategoria: number): Promise<string> {
    try {
      const response = await interceptorsApiClient.get(`/categoria/obtenerNombre/${idCategoria}`)
      return response.data
    } catch (error) {
      console.error("Error al obtener nombre de categoría:", error)
      throw error
    }
  }
}
