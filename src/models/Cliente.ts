import { Pedido } from "./Pedido";
import { Usuario } from "./Usuario";
import { Imagen } from "./Imagen";
import { Roles } from "./Roles";

export class Cliente extends Usuario {
  private direccion: string;
  private pedidos: Pedido[];

  constructor(
    idUsuario: number,
    idAuth0: string,
    email: string,
    nombre: string,
    apellido: string,
    telefono: string,
    imagen: Imagen,
    activo: boolean,
    fechaCreacion: Date,
    fechaActualizacion: Date,
    roles: Roles[],
    direccion: string,
    pedidos: Pedido[],
  ) {
    super(
      idUsuario,
      idAuth0,
      email,
      nombre,
      apellido,
      telefono,
      imagen,
      activo,
      fechaCreacion,
      fechaActualizacion,
      roles,
    );
    this.direccion = direccion;
    this.pedidos = pedidos;
  }

  // Getters
  public getDireccion(): string {
    return this.direccion;
  }

  public getPedidos(): Pedido[] {
    return this.pedidos;
  }

  // Setters
  public setDireccion(direccion: string): void {
    this.direccion = direccion;
  }

  public setPedidos(pedidos: Pedido[]): void {
    this.pedidos = pedidos;
  }

  // Métodos adicionales
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
