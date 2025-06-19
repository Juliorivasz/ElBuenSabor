import { ImagenDTOJson } from "./ImagenDTOJson";

export interface NuevoArticuloNoElaboradoDtoJson {
  nombre: string;
  descripcion: string;
  precioVenta: number;
  dadoDeAlta: boolean;
  idCategoria: number;
  imagenDto: ImagenDTOJson | null;
}
