import { articuloMapper } from "../utils/mapper/articuloMapper";
import { interceptorsApiClient } from "./interceptors/axios.interceptors";
import { PaginatedApiArticulo, PaginatedArticulo } from "./types/catalog/articulos";

export const getAllArticulos = async (page: number, size: number = 9): Promise<PaginatedArticulo> => {
  const response = await interceptorsApiClient.get(`/articulo/catalogo?page=${page}&size=${size}`);
  const data: PaginatedApiArticulo = response.data;
  const content = data.content.map(articuloMapper);

  return {
    ...data,
    content: content,
  };
};

// Función para realizar alta/baja lógica de un producto
export const altaBajaArticulo = async (id: number): Promise<void> => {
  interceptorsApiClient.post(`/articulo/altaBaja/${id}`);
};
