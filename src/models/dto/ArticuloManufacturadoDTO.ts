import { ImagenDTO } from "./ImagenDTO";

export class ArticuloManufacturadoDTO {
  private idArticuloManufacturado: number;
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private tiempoDeCocina: number;
  private idCategoria: number;
  private puedeElaborarse: boolean;
  private imagenDto: ImagenDTO;

  constructor(
    idArticuloManufacturado: number,
    nombre: string,
    descripcion: string,
    precioVenta: number,
    tiempoDeCocina: number,
    idCategoria: number,
    puedeElaborarse: boolean,
    ImagenDTO: ImagenDTO,
  ) {
    this.idArticuloManufacturado = idArticuloManufacturado;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.tiempoDeCocina = tiempoDeCocina;
    this.idCategoria = idCategoria;
    this.puedeElaborarse = puedeElaborarse;
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
  public getDescripcion(): string {
    return this.descripcion;
  }

  public setDescripcion(descrip: string): void {
    this.descripcion = descrip;
  }

  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public setIdCategoria(id: number): void {
    this.idCategoria = id;
  }

  public getTiempoDeCocina(): number {
    return this.tiempoDeCocina;
  }

  public setTiempoDeCocina(tiempoCocina: number): void {
    this.tiempoDeCocina = tiempoCocina;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }

  public setPrecioVenta(precio: number): void {
    this.precioVenta = precio;
  }

  public getpuedeElaborarse(): boolean {
    return this.puedeElaborarse;
  }

  public setpuedeElaborarse(puedeElaborarse: boolean): void {
    this.puedeElaborarse = puedeElaborarse;
  }

  public getImagenDto(): ImagenDTO {
    return this.imagenDto;
  }

  public setImagenDto(imagenDto: ImagenDTO): void {
    this.imagenDto = imagenDto;
  }
}
