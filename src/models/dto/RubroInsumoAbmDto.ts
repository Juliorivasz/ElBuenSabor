export class RubroInsumoAbmDto {
  private idRubroInsumo: number
  private nombre: string
  private dadoDeAlta: boolean
  private idRubroPadre: number | null
  private rubroPadre: string | null
  private cantInsumos: number
  private insumos: string[]

  constructor(
    idRubroInsumo: number,
    nombre: string,
    dadoDeAlta: boolean,
    idRubroPadre: number | null,
    rubroPadre: string | null,
    cantInsumos: number,
    insumos: string[],
  ) {
    this.idRubroInsumo = idRubroInsumo
    this.nombre = nombre
    this.dadoDeAlta = dadoDeAlta
    this.idRubroPadre = idRubroPadre
    this.rubroPadre = rubroPadre
    this.cantInsumos = cantInsumos
    this.insumos = insumos
  }

  public getIdRubroInsumo(): number {
    return this.idRubroInsumo
  }

  public setIdRubroInsumo(idRubroInsumo: number): void {
    this.idRubroInsumo = idRubroInsumo
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

  public getIdRubroPadre(): number | null {
    return this.idRubroPadre
  }

  public setIdRubroPadre(idRubroPadre: number | null): void {
    this.idRubroPadre = idRubroPadre
  }

  public getRubroPadre(): string | null {
    return this.rubroPadre
  }

  public setRubroPadre(rubroPadre: string | null): void {
    this.rubroPadre = rubroPadre
  }

  public getCantInsumos(): number {
    return this.cantInsumos
  }

  public setCantInsumos(cantInsumos: number): void {
    this.cantInsumos = cantInsumos
  }

  public getInsumos(): string[] {
    return this.insumos
  }

  public setInsumos(insumos: string[]): void {
    this.insumos = insumos
  }

  public esRubroPadre(): boolean {
    return this.idRubroPadre === null || this.idRubroPadre === 0
  }
}

