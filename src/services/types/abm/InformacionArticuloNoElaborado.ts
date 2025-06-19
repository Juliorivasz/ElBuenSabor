import { ImagenApi } from "./InformacionArticulosManufacturadoDto";
import { InformacionArticuloNoElaboradoDto } from "../../../models/dto/InformacionArticuloNoElaboradoDto";

export type InformacionArticuloNoElaboradoApi = {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioModificado: boolean;
  dadoDeAlta: boolean;
  idCategoria: number;
  nombreCategoria: string;
  imagenDto: ImagenApi;
};

export type PaginatedResponseAbmNoElaboradoApi = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: InformacionArticuloNoElaboradoApi[];
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type PaginatedResponseAbmNoElaborado = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: InformacionArticuloNoElaboradoDto[];
  first: boolean;
  last: boolean;
  empty: boolean;
};
