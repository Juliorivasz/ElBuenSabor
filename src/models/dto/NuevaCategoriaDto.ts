export class NuevaCategoriaDto {
  nombre: string;
  margenGanancia: number;
  dadoDeAlta: boolean;
  idCategoriaPadre: number | null;

  constructor(nombre: string, margenGanancia: number, dadoDeAlta: boolean, idCategoriaPadre: number | null) {
    this.nombre = nombre;
    this.margenGanancia = margenGanancia;
    this.dadoDeAlta = dadoDeAlta;
    this.idCategoriaPadre = idCategoriaPadre;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      margenGanancia: this.margenGanancia,
      dadoDeAlta: this.dadoDeAlta,
      idCategoriaPadre: this.idCategoriaPadre,
    };
  }
}
