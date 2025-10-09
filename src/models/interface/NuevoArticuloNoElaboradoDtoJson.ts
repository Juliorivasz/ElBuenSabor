export interface NuevoArticuloNoElaboradoDtoJson {
  nombre: string;
  descripcion: string;
  precioVenta: number;
  dadoDeAlta: boolean;
  idCategoria: number;
  costo: number;
  stock: number;
  imagenUrl?: string;
}
