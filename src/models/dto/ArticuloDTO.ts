import { ArticuloDTOJson } from "../interface/ArticuloDTOJson";

export class ArticuloDTO {
  private idArticulo: number;
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private tiempoDeCocina: number;
  private idCategoria: number;
  private imagenModel: string | null;
  private puedeElaborarse: boolean;

  constructor(
    idArticulo: number,
    nombre: string,
    descripcion: string,
    precioVenta: number,
    tiempoDeCocina: number,
    idCategoria: number,
    imagenModel: string | null,
    puedeElaborarse: boolean,
  ) {
    this.idArticulo = idArticulo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.tiempoDeCocina = tiempoDeCocina;
    this.idCategoria = idCategoria;
    this.imagenModel = imagenModel;
    this.puedeElaborarse = puedeElaborarse;
  }

  // Getters
  public getIdArticulo(): number {
    return this.idArticulo;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }

  public getTiempoDeCocina(): number {
    return this.tiempoDeCocina;
  }

  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public getImagenModel(): string | null {
    return this.imagenModel;
  }

  public getPuedeElaborarse(): boolean {
    return this.puedeElaborarse;
  }

  // Setters
  public setIdArticulo(idArticulo: number): void {
    this.idArticulo = idArticulo;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  public setPrecioVenta(precioVenta: number): void {
    this.precioVenta = precioVenta;
  }

  public setTiempoDeCocina(tiempoDeCocina: number): void {
    this.tiempoDeCocina = tiempoDeCocina;
  }

  public setIdCategoria(idCategoria: number): void {
    this.idCategoria = idCategoria;
  }

  public setImagenModel(nuevoImagenModel: string): void {
    this.imagenModel = nuevoImagenModel;
  }

  public setPuedeElaborarse(puedeElaborarse: boolean): void {
    this.puedeElaborarse = puedeElaborarse;
  }

  // Convertir a JSON plano
  public toJSON(): ArticuloDTOJson {
    return {
      idArticulo: this.idArticulo,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precioVenta: this.precioVenta,
      tiempoDeCocina: this.tiempoDeCocina,
      idCategoria: this.idCategoria,
      imagenModel: this.imagenModel || null,
      puedeElaborarse: this.puedeElaborarse,
    };
  }

  // Crear desde un JSON plano
  public static fromJSON(json: ArticuloDTOJson): ArticuloDTO {
    return new ArticuloDTO(
      json.idArticulo,
      json.nombre,
      json.descripcion,
      json.precioVenta,
      json.tiempoDeCocina,
      json.idCategoria,
      json.imagenModel,
      json.puedeElaborarse,
    );
  }
}
