import { ArticuloManufacturado } from "./ArticuloManufacturado";

export class Promocion {
  private idPromocion: number;
  private nombre: string;
  private titulo: string;
  private descripcion: string;
  private descuento: number;
  private fechaInicio: Date;
  private fechaFin: Date;
  private url: string;
  private articuloManufacturado: ArticuloManufacturado;

  constructor(
    idPromocion: number,
    nombre: string,
    titulo: string,
    descripcion: string,
    descuento: number,
    fechaInicio: Date,
    fechaFin: Date,
    url: string,
    articuloManufacturado: ArticuloManufacturado,
  ) {
    this.idPromocion = idPromocion;
    this.nombre = nombre;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.descuento = descuento;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.url = url;
    this.articuloManufacturado = articuloManufacturado;
  }

  getIdPromocion(): number {
    return this.idPromocion;
  }
  getNombre(): string {
    return this.nombre;
  }
  getTitulo(): string {
    return this.titulo;
  }
  getDescripcion(): string {
    return this.descripcion;
  }
  getDescuento(): number {
    return this.descuento;
  }
  getFechaInicio(): Date {
    return this.fechaInicio;
  }
  getFechaFin(): Date {
    return this.fechaFin;
  }
  getUrl(): string {
    return this.url;
  }
  getArticuloManufacturado(): ArticuloManufacturado {
    return this.articuloManufacturado;
  }
  setIdPromocion(idPromocion: number): void {
    this.idPromocion = idPromocion;
  }
  setNombre(nombre: string): void {
    this.nombre = nombre;
  }
  setTitulo(titulo: string): void {
    this.titulo = titulo;
  }
  setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }
  setDescuento(descuento: number): void {
    this.descuento = descuento;
  }
  setFechaInicio(fechaInicio: Date): void {
    this.fechaInicio = fechaInicio;
  }
  setFechaFin(fechaFin: Date): void {
    this.fechaFin = fechaFin;
  }
  setUrl(url: string): void {
    this.url = url;
  }
  setArticuloManufacturado(articuloManufacturado: ArticuloManufacturado): void {
    this.articuloManufacturado = articuloManufacturado;
  }
}
