import { ImagenDTOJson } from "./ImagenDTOJson";

export interface ArticuloDTOJson {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  tiempoDeCocina: number;
  idCategoria: number;
  imagenDto: ImagenDTOJson | null;
  puedeElaborarse: boolean;
}
