export class CategoriaDTO {
  private idCategoria: number;
  private nombre: string;
  private idCategoriaPadre: number;

  constructor(idCategoria: number, nombre: string, idCategoriaPadre: number) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.idCategoriaPadre = idCategoriaPadre;
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
}
