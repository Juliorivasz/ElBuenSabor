export class InsumoAbmDTO {
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
  private costo?: number

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
    costo?: number,
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

  // Getters
  public getIdArticuloInsumo(): number {
    return this.idArticuloInsumo
  }

  public getNombre(): string {
    return this.nombre
  }

  public getStockActual(): number {
    return this.stockActual
  }

  public getStockMinimo(): number {
    return this.stockMinimo
  }

  public getStockMaximo(): number {
    return this.stockMaximo
  }

  public isDadoDeAlta(): boolean {
    return this.dadoDeAlta
  }

  public getIdRubro(): number {
    return this.idRubro
  }

  public getNombreRubro(): string {
    return this.nombreRubro
  }

  public getIdUnidadDeMedida(): number {
    return this.idUnidadDeMedida
  }

  public getUnidadDeMedida(): string {
    return this.unidadDeMedida
  }

  public getCosto(): number | undefined {
    return this.costo
  }

  // Setters
  public setIdArticuloInsumo(idArticuloInsumo: number): void {
    this.idArticuloInsumo = idArticuloInsumo
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre
  }

  public setStockActual(stockActual: number): void {
    this.stockActual = stockActual
  }

  public setStockMinimo(stockMinimo: number): void {
    this.stockMinimo = stockMinimo
  }

  public setStockMaximo(stockMaximo: number): void {
    this.stockMaximo = stockMaximo
  }

  public setDadoDeAlta(dadoDeAlta: boolean): void {
    this.dadoDeAlta = dadoDeAlta
  }

  public setIdRubro(idRubro: number): void {
    this.idRubro = idRubro
  }

  public setNombreRubro(nombreRubro: string): void {
    this.nombreRubro = nombreRubro
  }

  public setIdUnidadDeMedida(idUnidadDeMedida: number): void {
    this.idUnidadDeMedida = idUnidadDeMedida
  }

  public setUnidadDeMedida(unidadDeMedida: string): void {
    this.unidadDeMedida = unidadDeMedida
  }

  public setCosto(costo: number): void {
    this.costo = costo
  }
}
