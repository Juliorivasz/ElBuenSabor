import { ImagenDTO } from "./ImagenDTO";
import { InformacionDetalleDto } from "./InformacionDetalleDto";

export class InformacionArticuloManufacturadoDto {
  private idArticuloManufacturado: number;
  private nombre: string;
  private descripcion: string;
  private receta: string;
  private tiempoDeCocina: number;
  private imagenDto: ImagenDTO;
  private idCategoria: number;
  private dadoDeAlta: boolean;
  private precioVenta: number;
  private detalles: InformacionDetalleDto[];

  constructor(
    idArticuloManufacturado: number,
    nombre: string,
    descripcion: string,
    receta: string,
    tiempoDeCocina: number,
    imagenDto: ImagenDTO,
    idCategoria: number,
    dadoDeAlta: boolean,
    precioVenta: number,
    detalles: InformacionDetalleDto[],
  ) {
    this.idArticuloManufacturado = idArticuloManufacturado;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.receta = receta;
    this.tiempoDeCocina = tiempoDeCocina;
    this.imagenDto = imagenDto;
    this.idCategoria = idCategoria;
    this.dadoDeAlta = dadoDeAlta;
    this.precioVenta = precioVenta;
    this.detalles = detalles;
  }

  public getIdArticuloManufacturado(): number {
    return this.idArticuloManufacturado;
  }

  public setIdArticuloManufacturado(id: number): void {
    this.idArticuloManufacturado = id;
  }

  // Getter y Setter para nombre
  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  // Getter y Setter para descripcion
  public getDescripcion(): string {
    return this.descripcion;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  // Getter y Setter para receta
  public getReceta(): string {
    return this.receta;
  }

  public setReceta(receta: string): void {
    this.receta = receta;
  }

  // Getter y Setter para tiempoDeCocina
  public getTiempoDeCocina(): number {
    return this.tiempoDeCocina;
  }

  public setTiempoDeCocina(tiempoDeCocina: number): void {
    this.tiempoDeCocina = tiempoDeCocina;
  }

  // Getter y Setter para imagenDto
  public getImagenDto(): ImagenDTO {
    return this.imagenDto;
  }

  public setImagenDto(imagenDto: ImagenDTO): void {
    this.imagenDto = imagenDto;
  }

  // Getter y Setter para idCategoria
  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public setIdCategoria(idCategoria: number): void {
    this.idCategoria = idCategoria;
  }

  public getDadoDeAlta(): boolean {
    return this.dadoDeAlta;
  }

  public setDadoDeAlta(nuevoDadoDeAlta: boolean): void {
    this.dadoDeAlta = nuevoDadoDeAlta;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }

  public setPrecioVenta(newPrecioVenta: number): void {
    this.precioVenta = newPrecioVenta;
  }

  // Getter y Setter para detalles
  public getDetalles(): InformacionDetalleDto[] {
    return this.detalles;
  }

  public setDetalles(detalles: InformacionDetalleDto[]): void {
    this.detalles = detalles;
  }
}
