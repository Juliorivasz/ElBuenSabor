import { IInformacionArticuloNoElaboradoDtoJson } from "../interface/InformacionArticuloNoElaboradoDtoJson";

export class InformacionArticuloNoElaboradoDto {
  private idArticulo: number;
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private precioModificado: boolean;
  private dadoDeAlta: boolean;
  private idCategoria: number;
  private nombreCategoria: string;
  private imagenUrl: string | null;

  constructor(
    idArticulo: number,
    nombre: string,
    descripcion: string,
    precioVenta: number,
    precioModificado: boolean,
    dadoDeAlta: boolean,
    idCategoria: number,
    nombreCategoria: string,
    imagenUrl: string | null,
  ) {
    this.idArticulo = idArticulo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.precioModificado = precioModificado;
    this.dadoDeAlta = dadoDeAlta;
    this.idCategoria = idCategoria;
    this.nombreCategoria = nombreCategoria;
    this.imagenUrl = imagenUrl;
  }

  // Getters y setters si los necesitas
  public getIdArticulo(): number {
    return this.idArticulo;
  }

  public setIdArticulo(value: number): void {
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

  public getImagenUrl(): string | null {
    return this.imagenUrl;
  }

  public setImagenUrl(value: string): void {
    this.imagenUrl = value;
  }

  public toJSON(): IInformacionArticuloNoElaboradoDtoJson {
    return {
      idArticulo: this.idArticulo,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precioVenta: this.precioVenta,
      precioModificado: this.precioModificado,
      dadoDeAlta: this.dadoDeAlta,
      idCategoria: this.idCategoria,
      nombreCategoria: this.nombreCategoria,
      imagenUrl: this.imagenUrl || null,
    };
  }

  public static fromJSON(json: IInformacionArticuloNoElaboradoDtoJson): InformacionArticuloNoElaboradoDto {
    return new InformacionArticuloNoElaboradoDto(
      json.idArticulo,
      json.nombre,
      json.descripcion,
      json.precioVenta,
      json.precioModificado,
      json.dadoDeAlta,
      json.idCategoria,
      json.nombreCategoria,
      json.imagenUrl,
    );
  }
}
