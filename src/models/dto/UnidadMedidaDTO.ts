export class UnidadMedidaDTO {
  private idUnidadDeMedida: number
  private denominacion: string

  constructor(idUnidadDeMedida: number, denominacion: string) {
    this.idUnidadDeMedida = idUnidadDeMedida
    this.denominacion = denominacion
  }

  public getIdUnidadDeMedida(): number {
    return this.idUnidadDeMedida
  }

  public getDenominacion(): string {
    return this.denominacion
  }

  public setIdUnidadDeMedida(idUnidadDeMedida: number): void {
    this.idUnidadDeMedida = idUnidadDeMedida
  }

  public setDenominacion(denominacion: string): void {
    this.denominacion = denominacion
  }
}
