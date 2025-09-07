import { ArticuloManufacturado } from "./ArticuloManufacturado";
import { Pedido } from "./Pedido";

export class DetallePedido {
  private idDetallePedido: number;
  private cantidad: number;
  private pedido: Pedido;
  private articuloManufacturado: ArticuloManufacturado;

  constructor(idDetallePedido: number, cantidad: number, pedido: Pedido, articuloManufacturado: ArticuloManufacturado) {
    this.idDetallePedido = idDetallePedido;
    this.cantidad = cantidad;
    this.pedido = pedido;
    this.articuloManufacturado = articuloManufacturado;
  }

  public getIdDetallePedido(): number {
    return this.idDetallePedido;
  }
  public getCantidad(): number {
    return this.cantidad;
  }
  public getPedido(): Pedido {
    return this.pedido;
  }
  public getArticuloManufacturado(): ArticuloManufacturado {
    return this.articuloManufacturado;
  }
  public setIdDetallePedido(idDetallePedido: number): void {
    this.idDetallePedido = idDetallePedido;
  }
  public setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }
  public setPedido(pedido: Pedido): void {
    this.pedido = pedido;
  }
  public setArticuloManufacturado(articuloManufacturado: ArticuloManufacturado): void {
    this.articuloManufacturado = articuloManufacturado;
  }
}
