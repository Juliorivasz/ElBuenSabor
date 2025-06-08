import { NuevoArticuloManufacturadoDtoJson } from "../interface/NuevoArticuloManufacturadoDtoJson";
import { ArticuloManufacturadoDetalleDto } from "./ArticuloManufacturadoDetalleDto";
import { ImagenDTO } from "./ImagenDTO";

export class NuevoArticuloManufacturadoDto {
  private nombre: string;
  private descripcion: string;
  private receta: string;
  private precioVenta: number;
  private tiempoDeCocina: number;
  private dadoDeAlta: boolean;
  private idCategoria: number;
  private imagenDto: ImagenDTO;
  private detalles: ArticuloManufacturadoDetalleDto[];

  constructor(
    nombre: string,
    descripcion: string,
    receta: string,
    precioVenta: number,
    tiempoDeCocina: number,
    dadoDeAlta: boolean,
    idCategoria: number,
    imagenDto: ImagenDTO,
    detalles: ArticuloManufacturadoDetalleDto[],
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.receta = receta;
    this.precioVenta = precioVenta;
    this.tiempoDeCocina = tiempoDeCocina;
    this.dadoDeAlta = dadoDeAlta;
    this.idCategoria = idCategoria;
    this.imagenDto = imagenDto;
    this.detalles = detalles;
  }

  public getNombre(): string {
    return this.nombre;
  }
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
  public getDescripcion(): string {
    return this.descripcion;
  }
  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  public getReceta(): string {
    return this.receta;
  }
  public setReceta(receta: string): void {
    this.receta = receta;
  }

  public getPrecioVenta(): number | undefined {
    return this.precioVenta;
  }
  public setPrecioVenta(precio: number): void {
    this.precioVenta = precio;
  }

  public getTiempoDeCocina(): number {
    return this.tiempoDeCocina;
  }
  public setTiempoDeCocina(tiempoDeCocina: number): void {
    this.tiempoDeCocina = tiempoDeCocina;
  }
  public getDetalles(): ArticuloManufacturadoDetalleDto[] {
    return this.detalles;
  }
  public setDetalles(detalles: ArticuloManufacturadoDetalleDto[]): void {
    this.detalles = detalles;
  }
  public getDadoDeAlta(): boolean {
    return this.dadoDeAlta;
  }
  public setDadoDeAlta(dadoDeAlta: boolean): void {
    this.dadoDeAlta = dadoDeAlta;
  }

  public getIdCategoria(): number {
    return this.idCategoria;
  }
  public setIdCategoria(idCategoria: number): void {
    this.idCategoria = idCategoria;
  }

  public getImagenDto(): ImagenDTO {
    return this.imagenDto;
  }
  public setImagenDto(imagenDto: ImagenDTO): void {
    this.imagenDto = imagenDto;
  }

  public toJSON(): NuevoArticuloManufacturadoDtoJson {
    return {
      nombre: this.getNombre(),
      descripcion: this.getDescripcion(),
      receta: this.getReceta(),
      precioVenta: this.getPrecioVenta()!,
      tiempoDeCocina: this.getTiempoDeCocina(),
      dadoDeAlta: this.getDadoDeAlta(),
      idCategoria: this.getIdCategoria(),
      imagenDto: this.getImagenDto().toJSON(),
      detalles: this.getDetalles().map((detalle) => detalle.toJSON()),
    };
  }
}
