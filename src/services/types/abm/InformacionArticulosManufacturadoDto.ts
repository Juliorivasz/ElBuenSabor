import { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto";
import { Page } from "../catalog/articulos";

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
  page: Page;
  content: InformacionArticuloManufacturadoDtoApi[];
};

export type PaginatedResponseAbm = {
  page: Page;
  content: InformacionArticuloManufacturadoDto[];
};
