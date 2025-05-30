export class InformacionDetalleDto {
  private idArticuloInsumo: number;
  private cantidad: number;

  constructor(idArticuloInsumo: number, cantidad: number) {
    this.idArticuloInsumo = idArticuloInsumo;
    this.cantidad = cantidad;
  }

  // Getter y Setter para idArticuloInsumo
  public getIdArticuloInsumo(): number {
    return this.idArticuloInsumo;
  }

  public setIdArticuloInsumo(idArticuloInsumo: number): void {
    this.idArticuloInsumo = idArticuloInsumo;
  }

  // Getter y Setter para cantidad
  public getCantidad(): number {
    return this.cantidad;
  }

  public setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }
}
