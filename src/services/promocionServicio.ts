import axios from "axios"
import { API_URL } from "."
import { useAuth0Store } from "../auth/Auth0Bridge"
import type { DetallePromocionDto } from "../models/dto/DetallePromocionDTO"
import type { NuevaPromocionDto } from "../models/dto/NuevaPromocionDTO"
import { Promocion } from "../models/Promocion"

export interface ArticuloListado {
  idArticulo: number
  nombre: string
  precioVenta: number
  activo: boolean
  puedeElaborarse: boolean
  disponible: boolean
}

class PromocionServicio {
  private baseURL = `${API_URL}/promocion`
  private articuloURL = `${API_URL}/articulo`

  private async getAuthHeaders() {
    const user = useAuth0Store.getState().user
    if (!user?.token) throw new Error("No hay token disponible")
    return { Authorization: `Bearer ${user.token}` }
  }

  private buildFormData(data: NuevaPromocionDto & { file?: File; url?: string }): FormData {
    const formData = new FormData()
    formData.append("promocion", new Blob([JSON.stringify(data)], { type: "application/json" }))
    if (data.file) formData.append("file", data.file)
    if (data.url) formData.append("url", data.url)
    return formData
  }

  async obtenerArticulos(): Promise<ArticuloListado[]> {
    try {
      const response = await axios.get<ArticuloListado[]>(`${this.articuloURL}/listado-promociones`, {
        headers: await this.getAuthHeaders(),
      })
      return response.data
    } catch (error) {
      console.error("Error al obtener artículos para promociones:", error)
      throw error
    }
  }

  async obtenerArticulosConDisponibilidad(): Promise<ArticuloListado[]> {
    try {
      return await this.obtenerArticulos()
    } catch (error) {
      console.error("Error al obtener artículos con disponibilidad:", error)
      throw error
    }
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
      const response = await axios.get<any[]>(`${this.baseURL}/abm`, {
        headers: await this.getAuthHeaders(),
      })

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

  // ⚡ Actualizado: ahora recibe FormData
  async crearPromocion(formData: FormData): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/nueva`, formData, {
        headers: {
          ...(await this.getAuthHeaders()),
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error("Error al crear promoción:", error)
      throw error
    }
  }

  // ⚡ Actualizado: ahora recibe FormData
  async actualizarPromocion(id: number, formData: FormData): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/modificar/${id}`, formData, {
        headers: {
          ...(await this.getAuthHeaders()),
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error("Error al actualizar promoción:", error)
      throw error
    }
  }

  async cambiarEstadoPromocion(id: number): Promise<void> {
    try {
      await axios.put(
        `${this.baseURL}/altaBaja/${id}`,
        {},
        {
          headers: await this.getAuthHeaders(),
        },
      )
    } catch (error) {
      console.error("Error al cambiar estado de promoción:", error)
      throw error
    }
  }

  async obtenerPrecioSugerido(detalles: DetallePromocionDto[]): Promise<number> {
    try {
      const response = await axios.post<number>(`${this.baseURL}/precio-sugerido`, detalles, {
        headers: await this.getAuthHeaders(),
      })
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
      const response = await axios.get(`${this.baseURL}/resumen/${idPromocion}`, {
        headers: await this.getAuthHeaders(),
      })
      return response.data
    } catch (error) {
      console.error("Error al obtener resumen de promoción:", error)
      throw error
    }
  }
}

export const promocionServicio = new PromocionServicio()
