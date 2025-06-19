import { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto";

export type ImagenApi = {
  url: string;
};

export type InformacionDetalleDTOApi = {
  idArticuloInsumo: number;
  nombreInsumo: string;
  unidadDeMedida: string;
  cantidad: number;
};

export type InformacionArticuloManufacturadoDtoApi = {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioModificado: boolean;
  receta: string;
  tiempoDeCocina: number;
  dadoDeAlta: boolean;
  idCategoria: number;
  nombreCategoria: string;
  imagenDto: ImagenApi;
  detalles: InformacionDetalleDTOApi[];
};

export type PaginatedResponseAbmApi = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: InformacionArticuloManufacturadoDtoApi[];
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type PaginatedResponseAbm = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: InformacionArticuloManufacturadoDto[];
  first: boolean;
  last: boolean;
  empty: boolean;
};
