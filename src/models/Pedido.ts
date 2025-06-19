import { Cliente } from "./Cliente";
import { DetallePedido } from "./DetallePedido";
import { Empleado } from "./Empleado";
import { EstadoPedido } from "./enum/EstadoPedido";
import { TipoEnvio } from "./enum/TipoEnvio";

export class Pedido {
  private idPedido: number;
  private fechaYHora: Date;
  private detalles: DetallePedido[];
  private tipoEnvio: TipoEnvio;
  private estadoPedido: EstadoPedido;
  private cliente: Cliente;
  private administrador: Empleado;
  private cajero: Empleado;
  private cocinero: Empleado;
  private repartidor: Empleado;

  constructor(
    idPedido: number,
    fechaYHora: Date,
    detalles: DetallePedido[],
    tipoEnvio: TipoEnvio,
    estadoPedido: EstadoPedido,
    cliente: Cliente,
    administrador: Empleado,
    cajero: Empleado,
    cocinero: Empleado,
    repartidor: Empleado,
  ) {
    this.idPedido = idPedido;
    this.fechaYHora = fechaYHora;
    this.detalles = detalles;
    this.tipoEnvio = tipoEnvio;
    this.estadoPedido = estadoPedido;
    this.cliente = cliente;
    this.administrador = administrador;
    this.cajero = cajero;
    this.cocinero = cocinero;
    this.repartidor = repartidor;
  }

  public getIdPedido(): number {
    return this.idPedido;
  }
  public setIdPedido(idPedido: number): void {
    this.idPedido = idPedido;
  }
  public getFechaYHora(): Date {
    return this.fechaYHora;
  }
  public setFechaYHora(fechaYHora: Date): void {
    this.fechaYHora = fechaYHora;
  }
  public getDetalles(): DetallePedido[] {
    return this.detalles;
  }
  public setDetalles(detalles: DetallePedido[]): void {
    this.detalles = detalles;
  }
  public getTipoEnvio(): TipoEnvio {
    return this.tipoEnvio;
  }
  public setTipoEnvio(tipoEnvio: TipoEnvio): void {
    this.tipoEnvio = tipoEnvio;
  }
  public getEstadoPedido(): EstadoPedido {
    return this.estadoPedido;
  }
  public setEstadoPedido(estadoPedido: EstadoPedido): void {
    this.estadoPedido = estadoPedido;
  }
  public getCliente(): Cliente {
    return this.cliente;
  }
  public setCliente(cliente: Cliente): void {
    this.cliente = cliente;
  }
  public getAdministrador(): Empleado {
    return this.administrador;
  }
  public setAdministrador(administrador: Empleado): void {
    this.administrador = administrador;
  }
  public getCajero(): Empleado {
    return this.cajero;
  }
  public setCajero(cajero: Empleado): void {
    this.cajero = cajero;
  }
  public getCocinero(): Empleado {
    return this.cocinero;
  }
  public setCocinero(cocinero: Empleado): void {
    this.cocinero = cocinero;
  }
  public getRepartidor(): Empleado {
    return this.repartidor;
  }
  public setRepartidor(repartidor: Empleado): void {
    this.repartidor = repartidor;
  }
}
