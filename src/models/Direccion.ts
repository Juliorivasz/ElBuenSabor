export class Direccion {
  idDireccion: number
  nombre: string
  calle: string
  numero: string
  piso: string
  dpto: string
  nombreDepartamento: string
  idDepartamento: number

  constructor(
    idDireccion = 0,
    nombre = "",
    calle = "",
    numero = "",
    piso = "",
    dpto = "",
    nombreDepartamento = "",
    idDepartamento = 0,
  ) {
    this.idDireccion = idDireccion
    this.nombre = nombre
    this.calle = calle
    this.numero = numero
    this.piso = piso
    this.dpto = dpto
    this.nombreDepartamento = nombreDepartamento
    this.idDepartamento = idDepartamento
  }
}
