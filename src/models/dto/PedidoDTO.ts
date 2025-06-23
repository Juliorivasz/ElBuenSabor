export interface DetallePedidoDTO {
  idArticulo: number
  nombreArticulo: string
  cantidad: number
  subtotal: number
}

export interface PedidoDTO {
  idPedido: number
  fechaYHora: string
  tipoEnvio: string
  metodoDePago: string
  estadoPedido: string
  emailCliente: string
  detalles: DetallePedidoDTO[]
}

export interface PedidosPaginadosDTO {
  totalElements: number
  totalPages: number
  size: number
  content: PedidoDTO[]
  number: number
  sort: Array<{
    direction: string
    nullHandling: string
    ascending: boolean
    property: string
    ignoreCase: boolean
  }>
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: {
    offset: number
    sort: Array<{
      direction: string
      nullHandling: string
      ascending: boolean
      property: string
      ignoreCase: boolean
    }>
    pageNumber: number
    paged: boolean
    pageSize: number
    unpaged: boolean
  }
  empty: boolean
}
