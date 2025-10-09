import { DetallePromocionDTO } from "./DetallePromocionDto";

export class PromocionCatalogoDto {
  private idPromocion: number;
  private titulo: string;
  private descripcion: string;
  private url: string;
  private horarioInicio: string;
  private horarioFin: string;
  private detalles: DetallePromocionDTO[];
  private precioPromocion: number;
  private precioBase: number;
  private descuento: number;

  constructor(
    idPromocion: number,
    titulo: string,
    descripcion: string,
    url: string,
    horarioInicio: string,
    horarioFin: string,
    detalles: DetallePromocionDTO[],
    precioPromocion: number,
    precioBase: number,
    descuento: number,
  ) {
    this.idPromocion = idPromocion;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.url = url;
    this.horarioInicio = horarioInicio;
    this.horarioFin = horarioFin;
    this.detalles = detalles;
    this.precioPromocion = precioPromocion;
    this.precioBase = precioBase;
    this.descuento = descuento;
  }
  getIdPromocion(): number {
    return this.idPromocion;
  }

  getTitulo(): string {
    return this.titulo;
  }
  getDescripcion(): string {
    return this.descripcion;
  }
  getUrl(): string {
    return this.url;
  }
  getHorarioInicio(): string {
    return this.horarioInicio;
  }
  getHorarioFin(): string {
    return this.horarioFin;
  }
  getDetalles(): DetallePromocionDTO[] {
    return this.detalles;
  }
  getPrecioPromocion(): number {
    return this.precioPromocion;
  }
  getPrecioBase(): number {
    return this.precioBase;
  }
  getDescuento(): number {
    return this.descuento;
  }
  setIdPromocion(idPromocion: number): void {
    this.idPromocion = idPromocion;
  }
  setTitulo(titulo: string): void {
    this.titulo = titulo;
  }
  setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }
  setUrl(url: string): void {
    this.url = url;
  }
  setHorarioInicio(horarioInicio: string): void {
    this.horarioInicio = horarioInicio;
  }
  setHorarioFin(horarioFin: string): void {
    this.horarioFin = horarioFin;
  }
  setDetalles(detalles: DetallePromocionDTO[]): void {
    this.detalles = detalles;
  }
  setPrecioPromocion(precioPromocion: number): void {
    this.precioPromocion = precioPromocion;
  }
  setPrecioBase(precioBase: number): void {
    this.precioBase = precioBase;
  }
  setDescuento(descuento: number): void {
    this.descuento = descuento;
  }
}
