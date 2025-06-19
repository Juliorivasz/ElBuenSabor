import { ImagenDTO } from "./ImagenDTO";
import { NuevoArticuloNoElaboradoDtoJson } from "../interface/NuevoArticuloNoElaboradoDtoJson";

export class NuevoArticuloNoElaboradoDto {
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private dadoDeAlta: boolean;
  private idCategoria: number;
  private imagenDto: ImagenDTO;

  constructor(
    nombre: string,
    descripcion: string,
    precioVenta: number,
    dadoDeAlta: boolean,
    idCategoria: number,
    imagenDto: ImagenDTO,
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.dadoDeAlta = dadoDeAlta;
    this.idCategoria = idCategoria;
    this.imagenDto = imagenDto;
  }
  // Getters
  public getNombre(): string {
    return this.nombre;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }

  public isDadoDeAlta(): boolean {
    return this.dadoDeAlta;
  }

  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public getImagenDto(): ImagenDTO {
    return this.imagenDto;
  }

  // Setters
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  public setPrecioVenta(precioVenta: number): void {
    this.precioVenta = precioVenta;
  }

  public setDadoDeAlta(dadoDeAlta: boolean): void {
    this.dadoDeAlta = dadoDeAlta;
  }

  public setIdCategoria(idCategoria: number): void {
    this.idCategoria = idCategoria;
  }

  public setImagenDto(imagenDto: ImagenDTO): void {
    this.imagenDto = imagenDto;
  }

  public toJSON(): NuevoArticuloNoElaboradoDtoJson {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precioVenta: this.precioVenta,
      dadoDeAlta: this.dadoDeAlta,
      idCategoria: this.idCategoria,
      imagenDto: this.imagenDto.toJSON(),
    };
  }

  public static fromJSON(json: NuevoArticuloNoElaboradoDtoJson): NuevoArticuloNoElaboradoDto {
    const imagenDto = ImagenDTO.fromJSON(json.imagenDto);
    if (!imagenDto) {
      throw new Error("imagenDto no puede ser null");
    }
    return new NuevoArticuloNoElaboradoDto(
      json.nombre,
      json.descripcion,
      json.precioVenta,
      json.dadoDeAlta,
      json.idCategoria,
      imagenDto,
    );
  }
}
