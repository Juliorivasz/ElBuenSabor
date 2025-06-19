import { ImagenDTO } from "../models/dto/ImagenDTO";
import { interceptorsApiClient } from "./interceptors/axios.interceptors";
import { InformacionArticuloNoElaboradoDto } from "../models/dto/InformacionArticuloNoElaboradoDto";

import {
  InformacionArticuloNoElaboradoApi,
  PaginatedResponseAbmNoElaborado,
  PaginatedResponseAbmNoElaboradoApi,
} from "./types/abm/InformacionArticuloNoElaborado";
import { NuevoArticuloNoElaboradoDto } from "../models/dto/NuevoArticuloNoElaboradoDto";

const parseInformacionArticuloNoElaboradoDto = (data: InformacionArticuloNoElaboradoApi) => {
  const imagenDto = new ImagenDTO(data.imagenDto?.url);

  return new InformacionArticuloNoElaboradoDto(
    data.idArticulo,
    data.nombre,
    data.descripcion,
    data.precioVenta,
    data.precioModificado,
    data.dadoDeAlta,
    data.idCategoria,
    data.nombreCategoria,
    imagenDto,
  );
};

export const fetchArticulosNoElaboradosAbm = async (
  page: number,
  itemsPerPage: number = 12,
): Promise<PaginatedResponseAbmNoElaborado> => {
  const response = interceptorsApiClient.get(`/articuloNoElaborado/abm?page=${page}&size=${itemsPerPage}`);

  const data: PaginatedResponseAbmNoElaboradoApi = (await response).data;
  const content = data.content.map(parseInformacionArticuloNoElaboradoDto);

  return { ...data, content: content };
};

// Función para realizar alta/baja lógica de un producto
export const altaBajaArticuloNoElaborado = async (id: number, dadoDeAlta: boolean): Promise<void> => {
  interceptorsApiClient.post("/articuloNoElaborado/altaBajaLogica", {
    id,
    dadoDeAlta,
  });
};

// Función para crear un nuevo artículo no elaborado
export const crearArticuloNoElaborado = async (producto: NuevoArticuloNoElaboradoDto) => {
  // Convertir el DTO a la estructura requerida por la API
  interceptorsApiClient.post("/articuloNoElaborado/nuevo", producto.toJSON());
};

// Función para actualizar un artículo no elaborado
export const actualizarArticuloNoElaborado = async (id: number, producto: InformacionArticuloNoElaboradoDto) => {
  interceptorsApiClient.put(`/articuloNoElaborado/modificar/${id}`, producto.toJSON());
};
