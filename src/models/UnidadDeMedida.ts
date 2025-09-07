export class UnidadDeMedida {
  private idUnidadMedida: number;
  private nombre: string;

  constructor(idUnidadMedida: number, nombre: string) {
    this.idUnidadMedida = idUnidadMedida;
    this.nombre = nombre;
  }

  public getIdUnidadMedida(): number {
    return this.idUnidadMedida;
  }
  public setIdUnidadMedida(idUnidadMedida: number): void {
    this.idUnidadMedida = idUnidadMedida;
  }
  public getNombre(): string {
    return this.nombre;
  }
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
}
