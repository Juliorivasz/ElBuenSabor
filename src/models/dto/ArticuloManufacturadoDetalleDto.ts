import { ArticuloManufacturadoDetalleDtoJson } from "../interface/ArticuloManufacturadoDetalleDtoJson";

export class ArticuloManufacturadoDetalleDto {
  private idArticuloInsumo: number;
  private cantidad: number;

  constructor(idArticuloInsumo: number, cantidad: number) {
    this.idArticuloInsumo = idArticuloInsumo;
    this.cantidad = cantidad;
  }

  public getIdArticuloInsumo() {
    return this.idArticuloInsumo;
  }
  public getCantidad() {
    return this.cantidad;
  }
  public setIdArticuloInsumo(newIdArticuloInsumo: number) {
    this.idArticuloInsumo = newIdArticuloInsumo;
  }
  public setCantidad(newCantidad: number) {
    this.idArticuloInsumo = newCantidad;
  }
  public toJSON(): ArticuloManufacturadoDetalleDtoJson {
    return {
      idArticuloInsumo: this.idArticuloInsumo,
      cantidad: this.cantidad,
    };
  }
}
