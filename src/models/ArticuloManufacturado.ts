import { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle";
import { Categoria } from "./Categoria";

export class ArticuloManufacturado {
  private idArticulo: number;
  private nombre: string;
  private descripcion: string;
  private precioVenta: number;
  private receta: string;
  private tiempoDeCocina: number;
  private detalles: ArticuloManufacturadoDetalle[];
  private categoria: Categoria;
  private urlImagen: string;

  constructor(
    idArticulo: number,
    nombre: string,
    descripcion: string,
    precioVenta: number,
    receta: string,
    tiempoDeCocina: number,
    detalles: ArticuloManufacturadoDetalle[],
    categoria: Categoria,
    urlImagen: string,
  ) {
    this.idArticulo = idArticulo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioVenta = precioVenta;
    this.receta = receta;
    this.tiempoDeCocina = tiempoDeCocina;
    this.detalles = detalles;
    this.categoria = categoria;
    this.urlImagen = urlImagen;
  }

  public getIdArticulo(): number {
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
  public getPrecioVenta(): number {
    return this.precioVenta;
  }
  public setPrecioVenta(precioVenta: number): void {
    this.precioVenta = precioVenta;
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
  public getDetalles(): ArticuloManufacturadoDetalle[] {
    return this.detalles;
  }
  public setDetalles(detalles: ArticuloManufacturadoDetalle[]): void {
    this.detalles = detalles;
  }
  public addDetalle(detalle: ArticuloManufacturadoDetalle): void {
    this.detalles.push(detalle);
  }
  public removeDetalle(detalle: ArticuloManufacturadoDetalle): void {
    this.detalles = this.detalles.filter((d) => d !== detalle);
  }
  public clearDetalles(): void {
    this.detalles = [];
  }
  public getDetalleById(id: number): ArticuloManufacturadoDetalle | undefined {
    return this.detalles.find((detalle) => detalle.getIdArticuloManufacturadoDetalle() === id);
  }
  public getDetallesByInsumo(insumoId: number): ArticuloManufacturadoDetalle[] {
    return this.detalles.filter((detalle) => detalle.getArticuloInsumo().getIdInsumo() === insumoId);
  }
  public getCategoria(): Categoria {
    return this.categoria;
  }
  public setCategoria(categoria: Categoria): void {
    this.categoria = categoria;
  }
  public getUrlImagen(): string {
    return this.urlImagen;
  }
  public setUrlImagen(urlImagen: string): void {
    this.urlImagen = urlImagen;
  }
}
