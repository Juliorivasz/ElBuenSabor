export interface DetallePedidoCocineroDTO {
  cantidad: number
  nombreArticulo: string
}

export class DetallePedidoCocineroDTO implements DetallePedidoCocineroDTO {
  cantidad: number
  nombreArticulo: string

  constructor(cantidad = 0, nombreArticulo = "") {
    this.cantidad = cantidad
    this.nombreArticulo = nombreArticulo
  }
}

export class PedidoCocineroDTO {
  idPedido: number
  horaEntrega: string
  tipoEnvio: string
  estadoPedido: string
  detalles: DetallePedidoCocineroDTO[]

  constructor(
    idPedido = 0,
    horaEntrega = "",
    tipoEnvio = "",
    estadoPedido = "",
    detalles: DetallePedidoCocineroDTO[] = [],
  ) {
    this.idPedido = idPedido
    this.horaEntrega = horaEntrega
    this.tipoEnvio = tipoEnvio
    this.estadoPedido = estadoPedido
    this.detalles = detalles
  }
}

export interface PedidosCocineroResponse {
  pedidos: PedidoCocineroDTO[]
}
