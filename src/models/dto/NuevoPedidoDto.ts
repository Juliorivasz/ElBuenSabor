export interface NuevoPedidoDto {
  tipoEnvio: "DELIVERY" | "TAKEAWAY"
  metodoDePago: "EFECTIVO" | "MERCADO_PAGO"
  idDireccion?: number // Opcional, solo requerido si tipoEnvio es DELIVERY
  detalles: DetallePedidoDto[]
}

export interface DetallePedidoDto {
  idArticulo: number
  cantidad: number
}

export interface PedidoResponseDto {
  idPedido: number
  estado: string
  total: number
  tipoEnvio: string
  metodoDePago: string
  fechaCreacion: string
}
