export class DetallePromocionDTO {
  private idArticulo: number;
  private cantidad: number;
  private nombreArticulo?: string;
  private precio?: number;

  constructor(idArticulo: number, cantidad: number, nombreArticulo?: string, precio?: number) {
    this.idArticulo = idArticulo;
    this.cantidad = cantidad;
    this.nombreArticulo = nombreArticulo;
    this.precio = precio;
  }
  getIdArticulo(): number {
    return this.idArticulo;
  }
  getCantidad(): number {
    return this.cantidad;
  }
  getNombreArticulo(): string | undefined {
    return this.nombreArticulo;
  }
  getPrecio(): number | undefined {
    return this.precio;
  }
  setIdArticulo(idArticulo: number): void {
    this.idArticulo = idArticulo;
  }
  setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }
  setNombreArticulo(nombreArticulo: string): void {
    this.nombreArticulo = nombreArticulo;
  }
  setPrecio(precio: number): void {
    this.precio = precio;
  }
}