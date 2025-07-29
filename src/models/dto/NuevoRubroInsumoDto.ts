export class NuevoRubroInsumoDto {
  private nombre: string
  private dadoDeAlta: boolean
  private idRubroInsumoPadre: number | null

  constructor(nombre: string, dadoDeAlta: boolean, idRubroInsumoPadre: number | null) {
    this.nombre = nombre
    this.dadoDeAlta = dadoDeAlta
    this.idRubroInsumoPadre = idRubroInsumoPadre
  }

  public getNombre(): string {
    return this.nombre
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre
  }

  public isDadoDeAlta(): boolean {
    return this.dadoDeAlta
  }

  public setDadoDeAlta(dadoDeAlta: boolean): void {
    this.dadoDeAlta = dadoDeAlta
  }

  public getIdRubroInsumoPadre(): number | null {
    return this.idRubroInsumoPadre
  }

  public setIdRubroInsumoPadre(idRubroInsumoPadre: number | null): void {
    this.idRubroInsumoPadre = idRubroInsumoPadre
  }
}
