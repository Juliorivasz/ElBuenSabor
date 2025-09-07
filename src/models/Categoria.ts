import { Articulo } from "./Articulo";
import { ImagenCategoria } from "./ImagenCategoria";

export class Categoria {
  private idCategoria: number;
  private nombre: string;
  private margenGanancia: number;
  private fechaBaja: Date;
  private imagen: ImagenCategoria;
  private articulos: Articulo[];
  private categoriaPadre: Categoria | null;

  constructor(
    idCategoria: number,
    nombre: string,
    margenGanancia: number,
    fechaBaja: Date,
    imagen: ImagenCategoria,
    articulos: Articulo[],
    categoriaPadre: Categoria | null,
  ) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.margenGanancia = margenGanancia;
    this.fechaBaja = fechaBaja;
    this.imagen = imagen;
    this.articulos = articulos;
    this.categoriaPadre = categoriaPadre;
  }

  // Getters
  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getMargenGanancia(): number {
    return this.margenGanancia;
  }

  public getFechaBaja(): Date {
    return this.fechaBaja;
  }

  public getImagen(): ImagenCategoria {
    return this.imagen;
  }

  public getArticulos(): Articulo[] {
    return this.articulos;
  }

  public getCategoriaPadre(): Categoria | null {
    return this.categoriaPadre;
  }

  // Setters
  public setIdCategoria(idCategoria: number): void {
    this.idCategoria = idCategoria;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setMargenGanancia(margenGanancia: number): void {
    this.margenGanancia = margenGanancia;
  }

  public setFechaBaja(fechaBaja: Date): void {
    this.fechaBaja = fechaBaja;
  }

  public setImagen(imagen: ImagenCategoria): void {
    this.imagen = imagen;
  }

  public setArticulos(articulos: Articulo[]): void {
    this.articulos = articulos;
  }

  public setCategoriaPadre(categoriaPadre: Categoria | null): void {
    this.categoriaPadre = categoriaPadre;
  }
}
