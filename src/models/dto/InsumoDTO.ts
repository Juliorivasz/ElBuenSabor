export class InsumoDTO {
  private idArticuloInsumo: number;
  private unidadDeMedida: string;
  private nombre: string;
  private costo: number;

  constructor(idArticuloInsumo: number, unidadDeMedida: string, nombre: string, costo: number) {
    this.idArticuloInsumo = idArticuloInsumo;
    this.unidadDeMedida = unidadDeMedida;
    this.nombre = nombre;
    this.costo = costo;
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

  public getCosto(): number {
    return this.costo;
  }

  public setCosto(nuevoCosto: number): void {
    this.costo = nuevoCosto;
  }
}
