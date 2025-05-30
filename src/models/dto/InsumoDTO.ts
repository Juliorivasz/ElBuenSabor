export class InsumoDTO {
  private idArticuloInsumo: number;
  private nombre: string;

  constructor(idArticuloInsumo: number, nombre: string) {
    this.idArticuloInsumo = idArticuloInsumo;
    this.nombre = nombre;
  }

  // Getter y Setter para idArticuloInsumo
  public getIdArticuloInsumo(): number {
    return this.idArticuloInsumo;
  }

  public setIdArticuloInsumo(idArticuloInsumo: number): void {
    this.idArticuloInsumo = idArticuloInsumo;
  }

  // Getter y Setter para nombre
  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
}
