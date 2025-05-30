import { ImagenDTO } from "./ImagenDTO";

export class ArticuloManufacturadoDTO {
  private idArticuloManufacturado: number;
  private nombre: string;
  private precioVenta: number;
  private dadoDeAlta: boolean;
  private imagenDto: ImagenDTO;
  private;

  constructor(
    idArticuloManufacturado: number,
    nombre: string,
    precioVenta: number,
    dadoDeAlta: boolean,
    ImagenDTO: ImagenDTO,
  ) {
    this.idArticuloManufacturado = idArticuloManufacturado;
    this.nombre = nombre;
    this.precioVenta = precioVenta;
    this.dadoDeAlta = dadoDeAlta;
    this.imagenDto = ImagenDTO;
  }

  public getIdArticuloManufacturado(): number {
    return this.idArticuloManufacturado;
  }

  public setIdArticuloManufacturado(id: number): void {
    this.idArticuloManufacturado = id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }

  public setPrecioVenta(precio: number): void {
    this.precioVenta = precio;
  }

  public getDadoDeAlta(): boolean {
    return this.dadoDeAlta;
  }

  public setDadoDeAlta(dadoDeAlta: boolean): void {
    this.dadoDeAlta = dadoDeAlta;
  }

  public getImagenDto(): ImagenDTO {
    return this.imagenDto;
  }

  public setImagenDto(imagenDto: ImagenDTO): void {
    this.imagenDto = imagenDto;
  }
}
