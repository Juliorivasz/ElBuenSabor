export interface DetallePedidoDTO {
  idDetallePedido: number
  cantidad: number
  subtotal: number
  nombreArticulo: string
}

export class DetallePedidoDTO implements DetallePedidoDTO {
  idDetallePedido: number
  cantidad: number
  subtotal: number
  nombreArticulo: string

  constructor(idDetallePedido = 0, cantidad = 0, subtotal = 0, nombreArticulo = "") {
    this.idDetallePedido = idDetallePedido
    this.cantidad = cantidad
    this.subtotal = subtotal
    this.nombreArticulo = nombreArticulo
  }
}

export class PedidoDTO {
  idPedido: number
  fechaYHora: string
  estadoPedido: string
  tipoEnvio: string
  emailCliente: string
  detalles: DetallePedidoDTO[]

  constructor(
    idPedido = 0,
    fechaYHora = "",
    estadoPedido = "",
    tipoEnvio = "",
    emailCliente = "",
    detalles: DetallePedidoDTO[] = [],
  ) {
    this.idPedido = idPedido
    this.fechaYHora = fechaYHora
    this.estadoPedido = estadoPedido
    this.tipoEnvio = tipoEnvio
    this.emailCliente = emailCliente
    this.detalles = detalles
  }
}

export interface PedidosPaginadosDTO {
  content: PedidoDTO[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
