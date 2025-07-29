import axios from "axios";
import { API_URL } from "./index";
import { Promocion } from "../models/Promocion";

export interface PromocionData {
  titulo: string;
  descripcion: string;
  descuento: number;
  horarioInicio: string;
  horarioFin: string;
  activo: boolean;
  idArticulo: number;
}

export interface ArticuloListado {
  idArticulo: number;
  nombre: string;
}

class PromocionServicio {
  private baseURL = `${API_URL}/promocion`;
  private articuloURL = `${API_URL}/articulo`;

  async obtenerPromociones(): Promise<Promocion[]> {
    try {
      const response = await axios.get(`${this.baseURL}/abm`);
      return response.data.map(
        (promo: any) =>
          new Promocion(
            promo.idPromocion,
            promo.titulo,
            promo.descripcion,
            promo.descuento,
            promo.horarioInicio,
            promo.horarioFin,
            promo.activo,
            promo.url,
            promo.idArticulo,
            promo.nombreArticulo,
            promo.articuloActivo || true, // Nuevo campo para estado del artículo
          ),
      );
    } catch (error) {
      console.error("Error al obtener promociones:", error);
      throw error;
    }
  }

  async obtenerArticulos(): Promise<ArticuloListado[]> {
    try {
      const response = await axios.get(`${this.articuloURL}/listado`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener artículos:", error);
      throw error;
    }
  }

  async crearPromocion(promocionData: PromocionData, file?: File, url?: string): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("promocion", JSON.stringify(promocionData));

      if (file) {
        formData.append("file", file);
      } else if (url) {
        formData.append("url", url);
      }

      await axios.post(`${this.baseURL}/nueva`, formData);
    } catch (error) {
      console.error("Error al crear promoción:", error);
      throw error;
    }
  }

  async modificarPromocion(
    idPromocion: number,
    promocionData: PromocionData,
    file?: File,
    url?: string,
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("promocion", JSON.stringify(promocionData));

      if (file) {
        formData.append("file", file);
      } else if (url) {
        formData.append("url", url);
      }

      await axios.put(`${this.baseURL}/modificar/${idPromocion}`, formData);
    } catch (error) {
      console.error("Error al modificar promoción:", error);
      throw error;
    }
  }

  async cambiarEstadoPromocion(idPromocion: number): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/altaBaja/${idPromocion}`);
    } catch (error) {
      console.error("Error al cambiar estado de promoción:", error)

      // Capturar excepción específica del artículo dado de baja
      if (error.response?.status === 400 || error.response?.status === 409) {
        const errorMessage = error.response?.data?.message || error.response?.data || ""

        // Verificar si el error es por artículo dado de baja
        if (
          errorMessage.toLowerCase().includes("artículo") &&
          (errorMessage.toLowerCase().includes("baja") ||
            errorMessage.toLowerCase().includes("inactivo") ||
            errorMessage.toLowerCase().includes("desactivado"))
        ) {
          throw new Error(
            "No se puede activar la promoción porque el artículo correspondiente se encuentra dado de baja",
          )
        }
      }

      throw error
    }
  }

  async obtenerPromocionPorArticulo(idArticulo: number): Promise<Promocion | null> {
    try {
      const response = await axios.get(`${this.baseURL}/articulo/${idArticulo}`)
      if (response.data) {
        return new Promocion(
          response.data.idPromocion,
          response.data.titulo,
          response.data.descripcion,
          response.data.descuento,
          response.data.horarioInicio,
          response.data.horarioFin,
          response.data.activo,
          response.data.url,
          response.data.idArticulo,
          response.data.nombreArticulo,
          response.data.articuloActivo || true,
        )
      }
      return null
    } catch (error) {
      // Si no hay promoción o hay error, retornamos null
      return null
    }
  }

  async obtenerPromocionesActivas(): Promise<Promocion[]> {
    try {
      const response = await axios.get(`${this.baseURL}/activas`)
      return response.data.map(
        (promo: any) =>
          new Promocion(
            promo.idPromocion,
            promo.titulo,
            promo.descripcion,
            promo.descuento,
            promo.horarioInicio,
            promo.horarioFin,
            promo.activo,
            promo.url,
            promo.idArticulo,
            promo.nombreArticulo,
            promo.articuloActivo || true,
          ),
      )
    } catch (error) {
      console.error("Error al obtener promociones activas:", error)
      return []
    }
  }

  async verificarEstadoArticulo(idArticulo: number): Promise<boolean> {
    try {
      const response = await axios.get(`${this.articuloURL}/${idArticulo}/estado`)
      return response.data.activo || false
    } catch (error) {
      console.error("Error al verificar estado del artículo:", error)
      return false
    }
  }
}

export const promocionServicio = new PromocionServicio();
