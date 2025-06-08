import { ArticuloManufacturadoDetalleDtoJson } from "./ArticuloManufacturadoDetalleDtoJson";
import { ImagenDTOJson } from "./ImagenDTOJson";

export interface NuevoArticuloManufacturadoDtoJson {
  nombre: string;
  descripcion: string;
  receta: string;
  precioVenta: number;
  tiempoDeCocina: number;
  dadoDeAlta: boolean;
  idCategoria: number;
  imagenDto: ImagenDTOJson;
  detalles: ArticuloManufacturadoDetalleDtoJson[];
}
