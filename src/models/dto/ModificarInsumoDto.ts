export class ModificarInsumoDto {
  private nombre: string
  private stockMinimo: number
  private stockMaximo: number
  private dadoDeAlta: boolean
  private idRubroInsumo: number
  private idUnidadDeMedida: number
  private costo: number

  constructor(
    nombre: string,
    stockMinimo: number,
    stockMaximo: number,
    dadoDeAlta: boolean,
    idRubroInsumo: number,
    idUnidadDeMedida: number,
    costo: number,
  ) {
    this.nombre = nombre
    this.stockMinimo = stockMinimo
    this.stockMaximo = stockMaximo
    this.dadoDeAlta = dadoDeAlta
    this.idRubroInsumo = idRubroInsumo
    this.idUnidadDeMedida = idUnidadDeMedida
    this.costo = costo
  }

  public getNombre(): string {
    return this.nombre
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre
  }

  public getStockMinimo(): number {
    return this.stockMinimo
  }

  public setStockMinimo(stockMinimo: number): void {
    this.stockMinimo = stockMinimo
  }

  public getStockMaximo(): number {
    return this.stockMaximo
  }

  public setStockMaximo(stockMaximo: number): void {
    this.stockMaximo = stockMaximo
  }

  public isDadoDeAlta(): boolean {
    return this.dadoDeAlta
  }

  public setDadoDeAlta(dadoDeAlta: boolean): void {
    this.dadoDeAlta = dadoDeAlta
  }

  public getIdRubroInsumo(): number {
    return this.idRubroInsumo
  }

  public setIdRubroInsumo(idRubroInsumo: number): void {
    this.idRubroInsumo = idRubroInsumo
  }

  public getIdUnidadDeMedida(): number {
    return this.idUnidadDeMedida
  }

  public setIdUnidadDeMedida(idUnidadDeMedida: number): void {
    this.idUnidadDeMedida = idUnidadDeMedida
  }

  public getCosto(): number {
    return this.costo
  }

  public setCosto(costo: number): void {
    this.costo = costo
  }
}
