import { ArticuloManufacturadoDetalleDtoJson } from "./ArticuloManufacturadoDetalleDtoJson";

export interface NuevoArticuloManufacturadoDtoJson {
  nombre: string;
  descripcion: string;
  receta: string;
  precioVenta: number;
  tiempoDeCocina: number;
  dadoDeAlta: boolean;
  idCategoria: number;
  imagenUrl?: string;
  detalles: ArticuloManufacturadoDetalleDtoJson[];
}
