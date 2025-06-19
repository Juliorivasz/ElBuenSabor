export class InsumoDTO {
  private idArticuloInsumo: number;
  private unidadDeMedida: string;
  private nombre: string;

  constructor(idArticuloInsumo: number, unidadDeMedida: string, nombre: string) {
    this.idArticuloInsumo = idArticuloInsumo;
    this.unidadDeMedida = unidadDeMedida;
    this.nombre = nombre;
  }

  // Getter y Setter para idArticuloInsumo
  public getIdArticuloInsumo(): number {
    return this.idArticuloInsumo;
  }

  public setIdArticuloInsumo(idArticuloInsumo: number): void {
    this.idArticuloInsumo = idArticuloInsumo;
  }

  public getUnidadDeMedida(): string {
    return this.unidadDeMedida;
  }

  public setUnidadDeMedida(unidadDeMedida: string): void {
    this.unidadDeMedida = unidadDeMedida;
  }

  // Getter y Setter para nombre
  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
}
