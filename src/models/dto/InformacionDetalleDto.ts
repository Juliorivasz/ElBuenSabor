export class InformacionDetalleDto {
  private idArticuloInsumo: number;
  private nombreInsumo: string;
  private cantidad: number;

  constructor(idArticuloInsumo: number, nombreInsumo: string, cantidad: number) {
    this.idArticuloInsumo = idArticuloInsumo;
    this.nombreInsumo = nombreInsumo;
    this.cantidad = cantidad;
  }

  // Getter y Setter para idArticuloInsumo
  public getIdArticuloInsumo(): number {
    return this.idArticuloInsumo;
  }

  public setIdArticuloInsumo(idArticuloInsumo: number): void {
    this.idArticuloInsumo = idArticuloInsumo;
  }

  public getNombreInsumo(): string {
    return this.nombreInsumo;
  }

  public setNombreInsumo(newNombreInsumo: string): void {
    this.nombreInsumo = newNombreInsumo;
  }

  // Getter y Setter para cantidad
  public getCantidad(): number {
    return this.cantidad;
  }

  public setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }
}
