import { ArticuloManufacturado } from "./ArticuloManufacturado";
import { Factura } from "./Factura";

export class DetalleFactura {
  private idDetalleFactura: number;
  private cantidad: number;
  private subtotal: number;
  private factura: Factura;
  private articuloManufacturado: ArticuloManufacturado;

  constructor(
    idDetalleFactura: number,
    cantidad: number,
    subtotal: number,
    factura: Factura,
    articuloManufacturado: ArticuloManufacturado,
  ) {
    this.idDetalleFactura = idDetalleFactura;
    this.cantidad = cantidad;
    this.subtotal = subtotal;
    this.factura = factura;
    this.articuloManufacturado = articuloManufacturado;
  }

  public getIdDetalleFactura(): number {
    return this.idDetalleFactura;
  }
  public setIdDetalleFactura(idDetalleFactura: number): void {
    this.idDetalleFactura = idDetalleFactura;
  }
  public getCantidad(): number {
    return this.cantidad;
  }
  public setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }
  public getSubtotal(): number {
    return this.subtotal;
  }
  public setSubtotal(subtotal: number): void {
    this.subtotal = subtotal;
  }
  public getFactura(): Factura {
    return this.factura;
  }
  public setFactura(factura: Factura): void {
    this.factura = factura;
  }
  public getArticuloManufacturado(): ArticuloManufacturado {
    return this.articuloManufacturado;
  }
  public setArticuloManufacturado(articuloManufacturado: ArticuloManufacturado): void {
    this.articuloManufacturado = articuloManufacturado;
  }
}
