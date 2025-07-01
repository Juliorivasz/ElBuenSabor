export interface ImagenModel {
  url: string
}

export class NuevaCategoriaDto {
  nombre: string
  margenGanancia: number
  dadoDeAlta: boolean
  idCategoriaPadre: number | null
  imagenModel: ImagenModel | null

  constructor(
    nombre: string,
    margenGanancia: number,
    dadoDeAlta: boolean,
    idCategoriaPadre: number | null,
    imagenModel: ImagenModel | null,
  ) {
    this.nombre = nombre
    this.margenGanancia = margenGanancia
    this.dadoDeAlta = dadoDeAlta
    this.idCategoriaPadre = idCategoriaPadre
    this.imagenModel = imagenModel
  }

  toJSON() {
    return {
      nombre: this.nombre,
      margenGanancia: this.margenGanancia,
      dadoDeAlta: this.dadoDeAlta,
      idCategoriaPadre: this.idCategoriaPadre,
      imagenModel: this.imagenModel,
    }
  }
}
