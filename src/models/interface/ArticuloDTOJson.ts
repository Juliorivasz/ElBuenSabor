export interface ArticuloDTOJson {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  tiempoDeCocina: number;
  idCategoria: number;
  imagenModel: string | null;
  puedeElaborarse: boolean;
}
