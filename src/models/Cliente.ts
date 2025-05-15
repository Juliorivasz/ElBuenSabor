import { Pedido } from "./Pedido";
import { Usuario } from "./Usuario";

export class Cliente extends Usuario {
  private direccion: string;
  private pedidos: Pedido[];

  constructor(
    idUsuario: number,
    nombre: string,
    apellido: string,
    email: string,
    contrasena: string,
    telefono: string,
    urlImagen: string,
    direccion: string,
    pedidos: Pedido[],
  ) {
    super(idUsuario, nombre, apellido, email, contrasena, apellido, telefono, urlImagen);
    this.direccion = direccion;
    this.pedidos = pedidos;
  }
  public getDireccion(): string {
    return this.direccion;
  }
  public setDireccion(direccion: string): void {
    this.direccion = direccion;
  }
  public getPedidos(): Pedido[] {
    return this.pedidos;
  }
  public setPedidos(pedidos: Pedido[]): void {
    this.pedidos = pedidos;
  }
  public agregarPedido(pedido: Pedido): void {
    this.pedidos.push(pedido);
  }
  public eliminarPedido(idPedido: number): void {
    this.pedidos = this.pedidos.filter((pedido) => pedido.getIdPedido() !== idPedido);
  }
  public buscarPedido(idPedido: number): Pedido | undefined {
    return this.pedidos.find((pedido) => pedido.getIdPedido() === idPedido);
  }
  public modificarPedido(idPedido: number, nuevoPedido: Pedido): void {
    const index = this.pedidos.findIndex((pedido) => pedido.getIdPedido() === idPedido);
    if (index !== -1) {
      this.pedidos[index] = nuevoPedido;
    }
  }
}
