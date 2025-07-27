export interface IInformacionArticuloNoElaboradoDtoJson {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioModificado: boolean;
  dadoDeAlta: boolean;
  idCategoria: number;
  nombreCategoria: string;
  imagenUrl: string | null;
  stock: number;
}
