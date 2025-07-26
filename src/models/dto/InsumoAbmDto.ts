export class InsumoAbmDto {
  private idArticuloInsumo: number
  private nombre: string
  private stockActual: number
  private stockMinimo: number
  private stockMaximo: number
  private dadoDeAlta: boolean
  private idRubro: number
  private nombreRubro: string
  private idUnidadDeMedida: number
  private unidadDeMedida: string
  private costo: number

  constructor(
    idArticuloInsumo: number,
    nombre: string,
    stockActual: number,
    stockMinimo: number,
    stockMaximo: number,
    dadoDeAlta: boolean,
    idRubro: number,
    nombreRubro: string,
    idUnidadDeMedida: number,
    unidadDeMedida: string,
    costo = 0,
  ) {
    this.idArticuloInsumo = idArticuloInsumo
    this.nombre = nombre
    this.stockActual = stockActual
    this.stockMinimo = stockMinimo
    this.stockMaximo = stockMaximo
    this.dadoDeAlta = dadoDeAlta
    this.idRubro = idRubro
    this.nombreRubro = nombreRubro
    this.idUnidadDeMedida = idUnidadDeMedida
    this.unidadDeMedida = unidadDeMedida
    this.costo = costo
  }

  public getIdArticuloInsumo(): number {
    return this.idArticuloInsumo
  }

  public setIdArticuloInsumo(idArticuloInsumo: number): void {
    this.idArticuloInsumo = idArticuloInsumo
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

  public getIdRubro(): number {
    return this.idRubro
  }

  public setIdRubro(idRubro: number): void {
    this.idRubro = idRubro
  }

  public getNombreRubro(): string {
    return this.nombreRubro
  }

  public setNombreRubro(nombreRubro: string): void {
    this.nombreRubro = nombreRubro
  }

  public getIdUnidadDeMedida(): number {
    return this.idUnidadDeMedida
  }

  public setIdUnidadDeMedida(idUnidadDeMedida: number): void {
    this.idUnidadDeMedida = idUnidadDeMedida
  }

  public getUnidadDeMedida(): string {
    return this.unidadDeMedida
  }

  public setUnidadDeMedida(unidadDeMedida: string): void {
    this.unidadDeMedida = unidadDeMedida
  }

  public getCosto(): number {
    return this.costo
  }

  public setCosto(costo: number): void {
    this.costo = costo
  }

  // Método helper para calcular el porcentaje de stock
  public getStockPercentage(): number {
    if (this.stockMaximo <= this.stockMinimo) return 0
    const range = this.stockMaximo - this.stockMinimo
    const current = this.stockActual - this.stockMinimo
    return Math.max(0, Math.min(100, (current / range) * 100))
  }
}
