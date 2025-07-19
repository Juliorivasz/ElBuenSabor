export class RubroInsumoDTO {
  private idRubroInsumo: number
  private nombre: string

  constructor(idRubroInsumo: number, nombre: string) {
    this.idRubroInsumo = idRubroInsumo
    this.nombre = nombre
  }

  public getIdRubroInsumo(): number {
    return this.idRubroInsumo
  }

  public getNombre(): string {
    return this.nombre
  }

  public setIdRubroInsumo(idRubroInsumo: number): void {
    this.idRubroInsumo = idRubroInsumo
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre
  }
}
