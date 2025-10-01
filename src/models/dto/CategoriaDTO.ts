export class CategoriaDTO {
  private idCategoria: number;
  private nombre: string;
  private idCategoriaPadre: number;
  private fechaBaja?: Date;
  private margenGanancia: number;

  constructor(idCategoria: number, nombre: string, idCategoriaPadre: number, margenGanancia: number, fechaBaja?: Date) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.idCategoriaPadre = idCategoriaPadre;
    this.margenGanancia = margenGanancia;
    this.fechaBaja = fechaBaja;
  }

  // Getter y Setter para idCategoria
  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public setIdCategoria(idCategoria: number): void {
    this.idCategoria = idCategoria;
  }

  // Getter y Setter para nombre
  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  // Getter y Setter para idCategoriaPadre
  public getIdCategoriaPadre(): number {
    return this.idCategoriaPadre;
  }

  public setIdCategoriaPadre(idCategoriaPadre: number): void {
    this.idCategoriaPadre = idCategoriaPadre;
  }
  
  public getMargenGanancia(): number {
    return this.margenGanancia;
  }

  public setMargenGanancia(margenGanancia: number): void {
    this.margenGanancia = margenGanancia;
  }
  
  public getFechaBaja(): Date | undefined {
    return this.fechaBaja;
  }

  public setFechaBaja(fechaBaja: Date | undefined): void {
    this.fechaBaja = fechaBaja;
  }

}
