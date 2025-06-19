import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManufacturado } from "./ArticuloManufacturado";

export class ArticuloManufacturadoDetalle {
  private idArticuloManufacturadoDetalle: number;
  private cantidad: number;
  private articuloManufacturado: ArticuloManufacturado;
  private articuloInsumo: ArticuloInsumo;

  constructor(
    idArticuloManufacturadoDetalle: number,
    cantidad: number,
    articuloManufacturado: ArticuloManufacturado,
    articuloInsumo: ArticuloInsumo,
  ) {
    this.idArticuloManufacturadoDetalle = idArticuloManufacturadoDetalle;
    this.cantidad = cantidad;
    this.articuloManufacturado = articuloManufacturado;
    this.articuloInsumo = articuloInsumo;
  }

  public getIdArticuloManufacturadoDetalle(): number {
    return this.idArticuloManufacturadoDetalle;
  }
  public setIdArticuloManufacturadoDetalle(idArticuloManufacturadoDetalle: number): void {
    this.idArticuloManufacturadoDetalle = idArticuloManufacturadoDetalle;
  }
  public getCantidad(): number {
    return this.cantidad;
  }
  public setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }
  public getArticuloManufacturado(): ArticuloManufacturado {
    return this.articuloManufacturado;
  }
  public setArticuloManufacturado(articuloManufacturado: ArticuloManufacturado): void {
    this.articuloManufacturado = articuloManufacturado;
  }
  public getArticuloInsumo(): ArticuloInsumo {
    return this.articuloInsumo;
  }
  public setArticuloInsumo(articuloInsumo: ArticuloInsumo): void {
    this.articuloInsumo = articuloInsumo;
  }
}
