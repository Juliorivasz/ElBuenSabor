export class CategoriaExtendidaDto {
  private idCategoria: number;
  private nombre: string;
  private idCategoriaPadre: number;
  private margenGanancia: number;
  private fechaBaja: Date | null;
  private subcategorias: CategoriaExtendidaDto[];

  constructor(
    idCategoria: number,
    nombre: string,
    idCategoriaPadre: number,
    margenGanancia = 0,
    fechaBaja: Date | null = null,
  ) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.idCategoriaPadre = idCategoriaPadre;
    this.margenGanancia = margenGanancia;
    this.fechaBaja = fechaBaja;
    this.subcategorias = [];
  }

  // Getters
  public getIdCategoria(): number {
    return this.idCategoria;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getIdCategoriaPadre(): number {
    return this.idCategoriaPadre;
  }

  public getMargenGanancia(): number {
    return this.margenGanancia;
  }

  public getFechaBaja(): Date | null {
    return this.fechaBaja;
  }

  public getSubcategorias(): CategoriaExtendidaDto[] {
    return this.subcategorias;
  }

  // Setters
  public setSubcategorias(subcategorias: CategoriaExtendidaDto[]): void {
    this.subcategorias = subcategorias;
  }

  // Métodos de utilidad
  public isActiva(): boolean {
    return this.fechaBaja === null;
  }

  public esCategoriaPadre(): boolean {
    return this.idCategoriaPadre === 0 || this.idCategoriaPadre === null;
  }

  public tieneSubcategorias(): boolean {
    return this.subcategorias.length > 0;
  }

  public getNombreCategoriaPadre(categorias: CategoriaExtendidaDto[]): string {
    if (this.esCategoriaPadre()) return "Categoría Principal";

    const padre = categorias.find((cat) => cat.getIdCategoria() === this.idCategoriaPadre);
    return padre ? padre.getNombre() : "Sin categoría padre";
  }
}
