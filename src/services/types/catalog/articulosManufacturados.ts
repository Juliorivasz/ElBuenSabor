import { ArticuloManufacturadoDTO } from "../../../models/dto/ArticuloManufacturadoDTO";

export type ImagenDTOApi = {
  url: string;
};

export type ArticuloManufacturadoDTOApi = {
  idArticuloManufacturado: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  tiempoDeCocina: number;
  idCategoria: number;
  puedeElaborarse: boolean;
  imagenDto: ImagenDTOApi;
};

export type PaginatedResponseArticuloManufacturadoDTOApi = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: ArticuloManufacturadoDTOApi[];
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type PaginatedResponseArticuloManufacturadoDTO = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: ArticuloManufacturadoDTO[];
  first: boolean;
  last: boolean;
  empty: boolean;
};
