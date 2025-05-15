import { ArticuloManufacturado } from "./ArticuloManufacturado";

export class Categoria {
  private idCategoria: number;
  private nombre: string;
  private margenGanancia: number;
  private fechaBaja: Date;
  private listaManufacturados: ArticuloManufacturado[];
  private categoriaPadre: Categoria | null;
  private imagen: string | null;

  constructor(
    idCategoria: number,
    nombre: string,
    margenGanancia: number,
    fechaBaja: Date,
    listaManufacturados: ArticuloManufacturado[],
    categoriaPadre: Categoria | null,
    imagen: string | null = null,
  ) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.margenGanancia = margenGanancia;
    this.fechaBaja = fechaBaja;
    this.listaManufacturados = listaManufacturados;
    this.categoriaPadre = categoriaPadre;
    this.imagen = imagen;
  }

  public getcategoriaNombre(): string {
    return this.nombre;
  }

  public getcategoriaId(): number {
    return this.idCategoria;
  }
  public getcategoriaMargenGanancia(): number {
    return this.margenGanancia;
  }
  public getcategoriaFechaBaja(): Date {
    return this.fechaBaja;
  }
  public getcategoriaListaManufacturados(): ArticuloManufacturado[] {
    return this.listaManufacturados;
  }
  public getcategoriaPadre(): Categoria | null {
    return this.categoriaPadre;
  }
  public getcategoriaImagen(): string | null {
    return this.imagen;
  }
  public setcategoriaNombre(nombre: string): void {
    this.nombre = nombre;
  }
}
