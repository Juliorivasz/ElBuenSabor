import { Categoria } from "./Categoria";
import { ImagenArticulo } from "./ImagenArticulo";

export class Articulo {
  private idArticulo: number;
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private fechaBaja: Date | null;
  private esManufacturado: boolean;
  private imagen: ImagenArticulo;
  private categoria: Categoria;

  constructor(
    idArticulo: number,
    nombre: string,
    descripcion: string,
    precioVenta: number,
    fechaBaja: Date | null,
    esManufacturado: boolean,
    imagen: ImagenArticulo,
    categoria: Categoria,
  ) {
    this.idArticulo = idArticulo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.fechaBaja = fechaBaja;
    this.esManufacturado = esManufacturado;
    this.imagen = imagen;
    this.categoria = categoria;
  }

  // Getters
  public getIdArticulo(): number {
    return this.idArticulo;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }

  public getFechaBaja(): Date | null {
    return this.fechaBaja;
  }

  public getEsManufacturado(): boolean {
    return this.esManufacturado;
  }

  public getImagen(): ImagenArticulo {
    return this.imagen;
  }

  public getCategoria(): Categoria {
    return this.categoria;
  }

  // Setters
  public setIdArticulo(idArticulo: number): void {
    this.idArticulo = idArticulo;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  public setPrecioVenta(precioVenta: number): void {
    this.precioVenta = precioVenta;
  }

  public setFechaBaja(fechaBaja: Date | null): void {
    this.fechaBaja = fechaBaja;
  }

  public setEsManufacturado(esManufacturado: boolean): void {
    this.esManufacturado = esManufacturado;
  }

  public setImagen(imagen: ImagenArticulo): void {
    this.imagen = imagen;
  }

  public setCategoria(categoria: Categoria): void {
    this.categoria = categoria;
  }
}
