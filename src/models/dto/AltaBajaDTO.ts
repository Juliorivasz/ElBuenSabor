export class AltaBajaDTO {
  private id: number;
  private dadoDeAlta: boolean;

  constructor(id: number, dadoDeAlta: boolean) {
    this.id = id;
    this.dadoDeAlta = dadoDeAlta;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getDadoDeAlta(): boolean {
    return this.dadoDeAlta;
  }

  public setDadoDeAlta(dadoAlta: boolean): void {
    this.dadoDeAlta = dadoAlta;
  }
}
