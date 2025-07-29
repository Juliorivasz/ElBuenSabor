export class ClienteGestion {
  idUsuario: number
  nombreYApellido: string
  email: string
  telefono: string
  cantidadPedidos: number

  constructor(idUsuario: number, nombreYApellido: string, email: string, telefono: string, cantidadPedidos: number) {
    this.idUsuario = idUsuario
    this.nombreYApellido = nombreYApellido
    this.email = email
    this.telefono = telefono
    this.cantidadPedidos = cantidadPedidos
  }
}
