import { ImagenDTOJson } from "./ImagenDTOJson";

export interface InformacionDetalleDtoJson {
  idArticuloInsumo: number;
  nombreInsumo: string;
  unidadDeMedida: string;
  cantidad: number;
}

export interface InformacionArticuloManufacturadoDtoJson {
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
  imagenDto: ImagenDTOJson | null;
  detalles: InformacionDetalleDtoJson[];
}
