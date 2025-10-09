export interface IPromocionItemDto {
  cantidad: number;
  nombreArticulo: string;
}

export interface IDetallePedidoCocineroDTO {
  cantidad: number;
  nombreArticulo: string | null;
  tituloPromocion: string | null;
  detallesPromocion: PromocionItemDto | null;
}

export class PromocionItemDto implements IPromocionItemDto {
  cantidad: number;
  nombreArticulo: string;
  

  constructor(cantidad = 0, nombreArticulo = "") {
    this.cantidad = cantidad;
    this.nombreArticulo = nombreArticulo;
  }
}
export class DetallePedidoCocineroDTO implements IDetallePedidoCocineroDTO {
  cantidad: number;
  nombreArticulo: string | null;
  tituloPromocion: string | null;
  detallesPromocion: PromocionItemDto | null;

  constructor(cantidad = 0, nombreArticulo = "", tituloPromocion = null, detallesPromocion = null) {
    this.cantidad = cantidad;
    this.nombreArticulo = nombreArticulo;
    this.tituloPromocion = tituloPromocion;
    this.detallesPromocion = detallesPromocion;
  }
}


export class PedidoCocineroDTO {
  idPedido: number;
  horaEntrega: string;
  tipoEnvio: string;
  estadoPedido: string;
  detalles: DetallePedidoCocineroDTO[];

  constructor(
    idPedido = 0,
    horaEntrega = "",
    tipoEnvio = "",
    estadoPedido = "",
    detalles: DetallePedidoCocineroDTO[] = [],
  ) {
    this.idPedido = idPedido;
    this.horaEntrega = horaEntrega;
    this.tipoEnvio = tipoEnvio;
    this.estadoPedido = estadoPedido;
    this.detalles = detalles;
  }
}

export interface PedidosCocineroResponse {
  pedidos: PedidoCocineroDTO[];
}
