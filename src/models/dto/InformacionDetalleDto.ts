import { InformacionDetalleDtoJson } from "../interface/InformacionManufacturadoDtoJson";

export class InformacionDetalleDto {
  private idArticuloInsumo: number;
  private nombreInsumo: string;
  private unidadDeMedida: string;
  private cantidad: number;

  constructor(idArticuloInsumo: number, nombreInsumo: string, unidadDeMedida: string, cantidad: number) {
    this.idArticuloInsumo = idArticuloInsumo;
    this.nombreInsumo = nombreInsumo;
    this.unidadDeMedida = unidadDeMedida;
    this.cantidad = cantidad;
  }

  // Getter y Setter para idArticuloInsumo
  public getIdArticuloInsumo(): number {
    return this.idArticuloInsumo;
  }

  public setIdArticuloInsumo(idArticuloInsumo: number): void {
    this.idArticuloInsumo = idArticuloInsumo;
  }

  public getNombreInsumo(): string {
    return this.nombreInsumo;
  }

  public setNombreInsumo(newNombreInsumo: string): void {
    this.nombreInsumo = newNombreInsumo;
  }

  public getUnidadDeMedida(): string {
    return this.unidadDeMedida;
  }

  public setUnidadDeMedida(newUnidad: string): void {
    this.unidadDeMedida = newUnidad;
  }

  // Getter y Setter para cantidad
  public getCantidad(): number {
    return this.cantidad;
  }

  public setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }
  public toJSON(): InformacionDetalleDtoJson {
    return {
      idArticuloInsumo: this.getIdArticuloInsumo(),
      nombreInsumo: this.getNombreInsumo(),
      unidadDeMedida: this.getUnidadDeMedida(),
      cantidad: this.getCantidad(),
    };
  }

  public static fromJson(json: InformacionDetalleDtoJson): InformacionDetalleDto {
    return new InformacionDetalleDto(json.idArticuloInsumo, json.nombreInsumo, json.unidadDeMedida, json.cantidad);
  }
}
