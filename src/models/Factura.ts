import { DetalleFactura } from "./DetalleFactura";
import { MetodoDePago } from "./enum/MetodoDePago";
import { Pedido } from "./Pedido";

export class Factura {
  private idFactura: number;
  private nroComprobante: string;
  private fechaYHora: Date;
  private total: number;
  private detalles: DetalleFactura[];
  private metodoDePago: MetodoDePago;
  private pedido: Pedido;

  constructor(
    idFactura: number,
    nroComprobante: string,
    fechaYHora: Date,
    total: number,
    detalles: DetalleFactura[],
    metodoDePago: MetodoDePago,
    pedido: Pedido,
  ) {
    this.idFactura = idFactura;
    this.nroComprobante = nroComprobante;
    this.fechaYHora = fechaYHora;
    this.total = total;
    this.detalles = detalles;
    this.metodoDePago = metodoDePago;
    this.pedido = pedido;
  }

  public getIdFactura(): number {
    return this.idFactura;
  }
  public setIdFactura(idFactura: number): void {
    this.idFactura = idFactura;
  }
  public getNroComprobante(): string {
    return this.nroComprobante;
  }
  public setNroComprobante(nroComprobante: string): void {
    this.nroComprobante = nroComprobante;
  }
  public getFechaYHora(): Date {
    return this.fechaYHora;
  }
  public setFechaYHora(fechaYHora: Date): void {
    this.fechaYHora = fechaYHora;
  }
  public getTotal(): number {
    return this.total;
  }
  public setTotal(total: number): void {
    this.total = total;
  }
  public getDetalles(): DetalleFactura[] {
    return this.detalles;
  }
  public setDetalles(detalles: DetalleFactura[]): void {
    this.detalles = detalles;
  }
  public getMetodoDePago(): MetodoDePago {
    return this.metodoDePago;
  }
  public setMetodoDePago(metodoDePago: MetodoDePago): void {
    this.metodoDePago = metodoDePago;
  }
  public getPedido(): Pedido {
    return this.pedido;
  }
  public setPedido(pedido: Pedido): void {
    this.pedido = pedido;
  }
}
