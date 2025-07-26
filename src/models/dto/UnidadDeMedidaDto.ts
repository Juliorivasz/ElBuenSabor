export class UnidadDeMedidaDto {
  private idUnidadDeMedida: number
  private nombre: string

  constructor(idUnidadDeMedida: number, nombre: string) {
    this.idUnidadDeMedida = idUnidadDeMedida
    this.nombre = nombre
  }

  public getIdUnidadDeMedida(): number {
    return this.idUnidadDeMedida
  }

  public setIdUnidadDeMedida(idUnidadDeMedida: number): void {
    this.idUnidadDeMedida = idUnidadDeMedida
  }

  public getNombre(): string {
    return this.nombre
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre
  }
}
