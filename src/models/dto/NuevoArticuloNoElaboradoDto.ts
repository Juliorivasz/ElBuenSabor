import { NuevoArticuloNoElaboradoDtoJson } from "../interface/NuevoArticuloNoElaboradoDtoJson";

export class NuevoArticuloNoElaboradoDto {
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private dadoDeAlta: boolean;
  private idCategoria: number;
  private imagenUrl?: string;

  constructor(
    nombre: string,
    descripcion: string,
    precioVenta: number,
    dadoDeAlta: boolean,
    idCategoria: number,
    imagenUrl?: string,
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.dadoDeAlta = dadoDeAlta;
    this.idCategoria = idCategoria;
    this.imagenUrl = imagenUrl;
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

  public getImagenUrl(): string | undefined {
    return this.imagenUrl;
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

  public setImagenUrl(imagenUrl: string): void {
    this.imagenUrl = imagenUrl;
  }

  public toJSON(): NuevoArticuloNoElaboradoDtoJson {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precioVenta: this.precioVenta,
      dadoDeAlta: this.dadoDeAlta,
      idCategoria: this.idCategoria,
      imagenUrl: this.imagenUrl,
    };
  }

  public static fromJSON(json: NuevoArticuloNoElaboradoDtoJson): NuevoArticuloNoElaboradoDto {
    return new NuevoArticuloNoElaboradoDto(
      json.nombre,
      json.descripcion,
      json.precioVenta,
      json.dadoDeAlta,
      json.idCategoria,
      json.imagenUrl,
    );
  }
}
