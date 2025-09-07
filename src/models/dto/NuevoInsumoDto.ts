export class NuevoInsumoDto {
  private nombre: string
  private stockActual: number
  private stockMinimo: number
  private stockMaximo: number
  private dadoDeAlta: boolean
  private idUnidadDeMedida: number
  private idRubroInsumo: number
  private costo: number

  constructor(
    nombre: string,
    stockActual: number,
    stockMinimo: number,
    stockMaximo: number,
    dadoDeAlta: boolean,
    idUnidadDeMedida: number,
    idRubroInsumo: number,
    costo: number,
  ) {
    this.nombre = nombre
    this.stockActual = stockActual
    this.stockMinimo = stockMinimo
    this.stockMaximo = stockMaximo
    this.dadoDeAlta = dadoDeAlta
    this.idUnidadDeMedida = idUnidadDeMedida
    this.idRubroInsumo = idRubroInsumo
    this.costo = costo
  }

  public getNombre(): string {
    return this.nombre
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre
  }

  public getStockActual(): number {
    return this.stockActual
  }

  public setStockActual(stockActual: number): void {
    this.stockActual = stockActual
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

  public getIdUnidadDeMedida(): number {
    return this.idUnidadDeMedida
  }

  public setIdUnidadDeMedida(idUnidadDeMedida: number): void {
    this.idUnidadDeMedida = idUnidadDeMedida
  }

  public getIdRubroInsumo(): number {
    return this.idRubroInsumo
  }

  public setIdRubroInsumo(idRubroInsumo: number): void {
    this.idRubroInsumo = idRubroInsumo
  }

  public getCosto(): number {
    return this.costo
  }

  public setCosto(costo: number): void {
    this.costo = costo
  }
}
