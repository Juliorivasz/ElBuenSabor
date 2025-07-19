export class NuevoInsumoDTO {
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

  // Getters
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

  public getIdUnidadDeMedida(): number {
    return this.idUnidadDeMedida
  }

  public getIdRubroInsumo(): number {
    return this.idRubroInsumo
  }

  public getCosto(): number {
    return this.costo
  }

  // Método para convertir a JSON
  public toJSON() {
    return {
      nombre: this.nombre,
      stockActual: this.stockActual,
      stockMinimo: this.stockMinimo,
      stockMaximo: this.stockMaximo,
      dadoDeAlta: this.dadoDeAlta,
      idUnidadDeMedida: this.idUnidadDeMedida,
      idRubroInsumo: this.idRubroInsumo,
      costo: this.costo,
    }
  }
}
