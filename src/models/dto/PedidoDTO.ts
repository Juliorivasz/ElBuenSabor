import { PedidosCajeroDto } from "./Pedido/PedidoCajeroDto";

export interface IDetallePedidoDTO {
  idDetallePedido: number;
  cantidad: number;
  subtotal: number;
  idArticulo?: number | null;
  nombreArticulo?: string | null;
  idPromocion?: number | null;
  tituloPromocion?: string | null;
}

export class DetallePedidoDTO implements IDetallePedidoDTO {
  idDetallePedido: number;
  cantidad: number;
  subtotal: number;
  idArticulo?: number | null;
  nombreArticulo?: string | null;
  idPromocion?: number | null;
  tituloPromocion?: string | null;


  constructor(idDetallePedido = 0, cantidad = 0, subtotal = 0, idArticulo?: number | null, nombreArticulo?: string | null, tituloPromocion?: string | null, idPromocion?: number | null) {
    this.idDetallePedido = idDetallePedido;
    this.cantidad = cantidad;
    this.subtotal = subtotal;
    this.idArticulo = idArticulo;
    this.nombreArticulo = nombreArticulo;
    this.tituloPromocion = tituloPromocion;
    this.idPromocion = idPromocion;
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
  total: number;

  constructor(
    idPedido = 0,
    fechaYHora = "",
    estadoPedido = "",
    tipoEnvio = "",
    emailCliente = "",
    detalles: DetallePedidoDTO[] = [],
    horaEntrega = "",
    metodoDePago = "",
    total = 0
  ) {
    this.idPedido = idPedido;
    this.fechaYHora = fechaYHora;
    this.estadoPedido = estadoPedido;
    this.tipoEnvio = tipoEnvio;
    this.emailCliente = emailCliente;
    this.detalles = detalles;
    this.horaEntrega = horaEntrega;
    this.metodoDePago = metodoDePago;
    this.total = total;
  }
}

export interface PedidosPaginadosDTO {
  content: PedidoDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PedidosCajeroPaginadosDTO {
  content: PedidosCajeroDto[];
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
