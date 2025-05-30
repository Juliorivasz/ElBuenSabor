import { ArticuloManufacturadoDetalleDto } from "./ArticuloManufacturadoDetalleDto";
import { ImagenDTO } from "./ImagenDTO";

export class NuevoArticuloManufacturadoDto {
  private idArticulo?: number;
  private nombre: string;
  private descripcion: string;
  private receta: string;
  private tiempoDeCocina: number;
  private dadoDeBaja: boolean;
  private idCategoria: number;
  private imagenDto: ImagenDTO;
  private detalles: ArticuloManufacturadoDetalleDto[];

  constructor(
    idArticulo: number,
    nombre: string,
    descripcion: string,
    receta: string,
    tiempoDeCocina: number,
    dadoDeBaja: boolean,
    idCategoria: number,
    imagenDto: ImagenDTO,
    detalles: ArticuloManufacturadoDetalleDto[],
  ) {
    this.idArticulo = idArticulo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.receta = receta;
    this.tiempoDeCocina = tiempoDeCocina;
    this.dadoDeBaja = dadoDeBaja;
    this.idCategoria = idCategoria;
    this.imagenDto = imagenDto;
    this.detalles = detalles;
  }

  public getIdArticulo(): number | undefined {
    return this.idArticulo;
  }
  public setIdArticulo(idArticulo: number): void {
    this.idArticulo = idArticulo;
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
  public getDadoDeBaja(): boolean {
    return this.dadoDeBaja;
  }
  public setDadoDeBaja(dadoDeBaja: boolean): void {
    this.dadoDeBaja = dadoDeBaja;
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
}
