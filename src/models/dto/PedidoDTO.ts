export interface IDetallePedidoDTO {
  idDetallePedido: number;
  cantidad: number;
  subtotal: number;
  nombreArticulo: string;
}

export class DetallePedidoDTO implements IDetallePedidoDTO {
  idDetallePedido: number;
  cantidad: number;
  subtotal: number;
  nombreArticulo: string;

  constructor(idDetallePedido = 0, cantidad = 0, subtotal = 0, nombreArticulo = "") {
    this.idDetallePedido = idDetallePedido;
    this.cantidad = cantidad;
    this.subtotal = subtotal;
    this.nombreArticulo = nombreArticulo;
  }
}

export class PedidoDTO {
  idPedido: number;
  fechaYHora: string;
  horaEntrega: string;
  estadoPedido: string;
  tipoEnvio: string;
  metodoDePago: string;
  emailCliente: string;
  detalles: DetallePedidoDTO[];

  constructor(
    idPedido = 0,
    fechaYHora = "",
    estadoPedido = "",
    tipoEnvio = "",
    emailCliente = "",
    detalles: DetallePedidoDTO[] = [],
    horaEntrega = "",
    metodoDePago = "",
  ) {
    this.idPedido = idPedido;
    this.fechaYHora = fechaYHora;
    this.estadoPedido = estadoPedido;
    this.tipoEnvio = tipoEnvio;
    this.emailCliente = emailCliente;
    this.detalles = detalles;
    this.horaEntrega = horaEntrega;
    this.metodoDePago = metodoDePago;
  }
}

export interface PedidosPaginadosDTO {
  content: PedidoDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// DTO para recibir actualizaciones de estado de pedidos vía WebSocket
export interface PedidoStatusUpdateDto {
  idPedido: number;
  estadoPedido: string; // Enum EstadoPedido
  clienteId: number; // Para que el frontend del cliente pueda filtrar
  horaEntrega?: string; // LocalDateTime, opcional ya que no siempre se actualiza
  mensajeActualizacion?: string; // Mensaje descriptivo del cambio
  nombreRepartidor?: string; // Nuevo: Nombre del repartidor asignado
  cantidadProductos?: number; // Nuevo: Cantidad total de productos en el pedido
}
