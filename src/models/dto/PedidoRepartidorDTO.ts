export interface DireccionDTO {
  calle: string
  numero: string
  piso: string
  dpto: string
  idDepartamento: number
  nombreDepartamento: string
}

export class DireccionDTO implements DireccionDTO {
  calle: string
  numero: string
  piso: string
  dpto: string
  idDepartamento: number
  nombreDepartamento: string

  constructor(calle = "", numero = "", piso = "", dpto = "", idDepartamento = 0, nombreDepartamento = "") {
    this.calle = calle
    this.numero = numero
    this.piso = piso
    this.dpto = dpto
    this.idDepartamento = idDepartamento
    this.nombreDepartamento = nombreDepartamento
  }
}

export class PedidoRepartidorDTO {
  idPedido: number
  horaEntrega: string
  estadoPedido: string
  direccion: DireccionDTO

  constructor(idPedido = 0, horaEntrega = "", estadoPedido = "", direccion: DireccionDTO = new DireccionDTO()) {
    this.idPedido = idPedido
    this.horaEntrega = horaEntrega
    this.estadoPedido = estadoPedido
    this.direccion = direccion
  }
}

export interface PedidosRepartidorResponse {
  pedidos: PedidoRepartidorDTO[]
}
