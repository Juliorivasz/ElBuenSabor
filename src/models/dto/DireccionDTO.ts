export class DireccionDTO {
  nombre: string
  calle: string
  numero: string
  piso: string
  dpto: string
  idDepartamento: number

  constructor(nombre = "", calle = "", numero = "", piso = "", dpto = "", idDepartamento = 0) {
    this.nombre = nombre
    this.calle = calle
    this.numero = numero
    this.piso = piso
    this.dpto = dpto
    this.idDepartamento = idDepartamento
  }
}
