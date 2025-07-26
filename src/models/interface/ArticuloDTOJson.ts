export interface ArticuloDTOJson {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  tiempoDeCocina: number;
  idCategoria: number;
  url: string | null;
  puedeElaborarse: boolean;
}
