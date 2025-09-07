import { InformacionArticuloNoElaboradoDto } from "../../../models/dto/InformacionArticuloNoElaboradoDto";
import { Page } from "../catalog/articulos";

export type InformacionArticuloNoElaboradoApi = {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioModificado: boolean;
  dadoDeAlta: boolean;
  idCategoria: number;
  nombreCategoria: string;
  imagenUrl: string;
  stock: number;
};

export type PaginatedResponseAbmNoElaboradoApi = {
  page: Page;
  content: InformacionArticuloNoElaboradoApi[];
};

export type PaginatedResponseAbmNoElaborado = {
  page: Page;
  content: InformacionArticuloNoElaboradoDto[];
};
