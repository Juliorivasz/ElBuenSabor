import type { DetallePromocionDto } from "../models/dto/DetallePromocionDTO"
import { Promocion } from "../models/Promocion"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"

export interface ArticuloListado {
  idArticulo: number
  nombre: string
  precioVenta: number
  activo: boolean
  puedeElaborarse: boolean
  disponible: boolean
}

class PromocionServicio {
  private baseURL = "/promocion"
  private articuloURL = "/articulo"

  async obtenerArticulos(): Promise<ArticuloListado[]> {
    try {
      const response = await interceptorsApiClient.get<ArticuloListado[]>(
        `${this.articuloURL}/listado-promociones`,
      )
      return response.data
    } catch (error) {
      console.error("Error al obtener artículos para promociones:", error)
      throw error
    }
  }

  async obtenerArticulosConDisponibilidad(): Promise<ArticuloListado[]> {
    return this.obtenerArticulos()
  }

  private formatTime(time: string | [number, number]): string {
    if (Array.isArray(time)) {
      const [hours, minutes] = time
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }
    if (typeof time === "string" && time.includes(":")) return time
    try {
      const date = new Date(time)
      return date.toTimeString().substring(0, 5)
    } catch {
      return time
    }
  }

  async obtenerPromociones(): Promise<Promocion[]> {
    try {
      const response = await interceptorsApiClient.get<any[]>(`${this.baseURL}/abm`)
      const articulos = await this.obtenerArticulos()

      return response.data.map((item) => {
        const promocion = new Promocion()
        promocion.setIdPromocion(item.idPromocion)
        promocion.setTitulo(item.titulo)
        promocion.setDescripcion(item.descripcion)
        promocion.setHorarioInicio(this.formatTime(item.horarioInicio))
        promocion.setHorarioFin(this.formatTime(item.horarioFin))
        promocion.setActivo(item.activo)
        promocion.setUrl(item.url || "")
        promocion.setPrecioPromocion(item.precioPromocion)

        const detallesEnriquecidos = (item.detalles || []).map((detalle: any) => {
          const articulo = articulos.find((a) => a.idArticulo === detalle.idArticulo)
          return {
            ...detalle,
            nombreArticulo: articulo?.nombre || "Artículo no encontrado",
            precio: articulo?.precioVenta || 0,
            activo: articulo?.activo ?? true,
          }
        })

        promocion.setDetalles(detallesEnriquecidos)
        return promocion
      })
    } catch (error) {
      console.error("Error al obtener promociones:", error)
      throw error
    }
  }

  // ⚡ Crear promoción con FormData
  async crearPromocion(formData: FormData): Promise<void> {
    try {
      await interceptorsApiClient.post(`${this.baseURL}/nueva`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    } catch (error) {
      console.error("Error al crear promoción:", error)
      throw error
    }
  }

  // ⚡ Actualizar promoción con FormData
  async actualizarPromocion(id: number, formData: FormData): Promise<void> {
    try {
      await interceptorsApiClient.put(`${this.baseURL}/modificar/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    } catch (error) {
      console.error("Error al actualizar promoción:", error)
      throw error
    }
  }

  async cambiarEstadoPromocion(id: number): Promise<void> {
    try {
      await interceptorsApiClient.put(`${this.baseURL}/altaBaja/${id}`)
    } catch (error) {
      console.error("Error al cambiar estado de promoción:", error)
      throw error
    }
  }

  async obtenerPrecioSugerido(detalles: DetallePromocionDto[]): Promise<number> {
    try {
      const response = await interceptorsApiClient.post<number>(
        `${this.baseURL}/precio-sugerido`,
        detalles,
      )
      return response.data
    } catch (error) {
      console.error("Error al obtener precio sugerido:", error)
      throw error
    }
  }

  async obtenerResumenPromocion(
    idPromocion: number,
  ): Promise<{ precioBase: number; precioPromocional: number; ahorro: number }> {
    try {
      const response = await interceptorsApiClient.get(
        `${this.baseURL}/resumen/${idPromocion}`,
      )
      return response.data
    } catch (error) {
      console.error("Error al obtener resumen de promoción:", error)
      throw error
    }
  }
}

export const promocionServicio = new PromocionServicio()
