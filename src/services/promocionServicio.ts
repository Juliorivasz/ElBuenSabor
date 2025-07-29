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
      console.error("Error al cambiar estado de promoción:", error);
      throw error;
    }
  }
}

export const promocionServicio = new PromocionServicio();
