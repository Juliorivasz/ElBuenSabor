import type { Articulo } from "../models/Articulo";
import { articuloMapper } from "../utils/mapper/articuloMapper";
import { interceptorsApiClient } from "./../services/interceptors/axios.interceptors";

export const articuloServicio = {
  // Trae todos los artículos (para Promociones.tsx)
  obtenerArticulos: async (): Promise<Articulo[]> => {
    try {
      // Endpoint correcto para ABM
      const response = await interceptorsApiClient.get(`/articulo/listado`);
      const data = response.data; // asumiendo array plano de artículos
      return data.map(articuloMapper);
    } catch (error) {
      console.error("Error al obtener artículos:", error);
      return [];
    }
  },

  // Cambia alta/baja de un artículo
  altaBajaArticulo: async (id: number): Promise<void> => {
    try {
      await interceptorsApiClient.put(`/articulo/altaBaja/${id}`);
    } catch (error) {
      console.error("Error al cambiar estado del artículo:", error);
      throw error;
    }
  },
};
