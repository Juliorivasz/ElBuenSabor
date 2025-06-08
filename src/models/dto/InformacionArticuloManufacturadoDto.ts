import {
  InformacionArticuloManufacturadoDtoJson,
  InformacionDetalleDtoJson,
} from "../interface/InformacionManufacturadoDtoJson";
import { ImagenDTO } from "./ImagenDTO";
import { InformacionDetalleDto } from "./InformacionDetalleDto";

export class InformacionArticuloManufacturadoDto {
  private idArticulo: number;
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private precioModificado: boolean;
  private receta: string;
  private tiempoDeCocina: number;
  private dadoDeAlta: boolean;
  private idCategoria: number;
  private nombreCategoria: string;
  private imagenDto: ImagenDTO | null;
  private detalles: InformacionDetalleDto[];

  constructor(
    idArticulo: number,
    nombre: string,
    descripcion: string,
    precioVenta: number,
    precioModificado: boolean,
    receta: string,
    tiempoDeCocina: number,
    dadoDeAlta: boolean,
    idCategoria: number,
    nombreCategoria: string,
    imagenDto: ImagenDTO | null,
    detalles: InformacionDetalleDto[],
  ) {
    this.idArticulo = idArticulo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.precioModificado = precioModificado;
    this.receta = receta;
    this.tiempoDeCocina = tiempoDeCocina;
    this.dadoDeAlta = dadoDeAlta;
    this.idCategoria = idCategoria;
    this.nombreCategoria = nombreCategoria;
    this.imagenDto = imagenDto;
    this.detalles = detalles;
  }

  public getidArticulo(): number {
    return this.idArticulo;
  }

  public setidArticulo(value: number): void {
    this.idArticulo = value;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(value: string): void {
    this.nombre = value;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public setDescripcion(value: string): void {
    this.descripcion = value;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }

  public setPrecioVenta(value: number): void {
    this.precioVenta = value;
  }

  public getPrecioModificado(): boolean {
    return this.precioModificado;
  }

  public setPrecioModificado(value: boolean): void {
    this.precioModificado = value;
  }

  public getReceta(): string {
    return this.receta;
  }

  public setReceta(value: string): void {
    this.receta = value;
  }

  public getTiempoDeCocina(): number {
    return this.tiempoDeCocina;
  }

  public setTiempoDeCocina(value: number): void {
    this.tiempoDeCocina = value;
  }

  public isDadoDeAlta(): boolean {
    return this.dadoDeAlta;
  }

  public setDadoDeAlta(value: boolean): void {
    this.dadoDeAlta = value;
  }

  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public setIdCategoria(value: number): void {
    this.idCategoria = value;
  }

  public getNombreCategoria(): string {
    return this.nombreCategoria;
  }

  public setNombreCategoria(value: string): void {
    this.nombreCategoria = value;
  }

  public getImagenDto(): ImagenDTO | null {
    return this.imagenDto;
  }

  public setImagenDto(value: ImagenDTO): void {
    this.imagenDto = value;
  }

  public getDetalles(): InformacionDetalleDto[] {
    return this.detalles;
  }

  public setDetalles(value: InformacionDetalleDto[]): void {
    this.detalles = value;
  }
  public toJSON(): InformacionArticuloManufacturadoDtoJson {
    return {
      idArticulo: this.getidArticulo(),
      nombre: this.getNombre(),
      descripcion: this.getDescripcion(),
      precioVenta: this.getPrecioVenta(),
      precioModificado: this.getPrecioModificado(),
      receta: this.getReceta(),
      tiempoDeCocina: this.getTiempoDeCocina(),
      dadoDeAlta: this.isDadoDeAlta(),
      idCategoria: this.getIdCategoria(),
      nombreCategoria: this.getNombreCategoria(),
      imagenDto: this.getImagenDto() ? this.getImagenDto()!.toJSON() : null,
      detalles: this.getDetalles().map((detalle) => detalle.toJSON()),
    };
  }

  public static fromJson(json: InformacionArticuloManufacturadoDtoJson): InformacionArticuloManufacturadoDto {
    return new InformacionArticuloManufacturadoDto(
      json.idArticulo,
      json.nombre,
      json.descripcion,
      json.precioVenta,
      json.precioModificado,
      json.receta,
      json.tiempoDeCocina,
      json.dadoDeAlta,
      json.idCategoria,
      json.nombreCategoria,
      ImagenDTO.fromJSON(json.imagenDto),
      json.detalles.map((detalleJson: InformacionDetalleDtoJson) => InformacionDetalleDto.fromJson(detalleJson)),
    );
  }
}
