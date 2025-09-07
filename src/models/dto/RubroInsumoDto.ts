export class RubroInsumoDto {
  private idRubroInsumo: number;
  private nombre: string;
  private dadoDeAlta: boolean;
  private idRubroInsumoPadre: number | null;
  private subrubros: RubroInsumoDto[];

  constructor(idRubroInsumo: number, nombre: string, dadoDeAlta: boolean, idRubroInsumoPadre: number | null = null) {
    this.idRubroInsumo = idRubroInsumo;
    this.nombre = nombre;
    this.dadoDeAlta = dadoDeAlta;
    this.idRubroInsumoPadre = idRubroInsumoPadre;
    this.subrubros = [];
  }

  // Getters
  public getIdRubroInsumo(): number {
    return this.idRubroInsumo;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public isDadoDeAlta(): boolean {
    return this.dadoDeAlta;
  }

  public getIdRubroInsumoPadre(): number | null {
    return this.idRubroInsumoPadre;
  }

  public getSubrubros(): RubroInsumoDto[] {
    return this.subrubros;
  }

  // Setters
  public setSubrubros(subrubros: RubroInsumoDto[]): void {
    this.subrubros = subrubros;
  }

  // Métodos de utilidad
  public isActivo(): boolean {
    return this.dadoDeAlta;
  }

  public esRubroPadre(): boolean {
    return this.idRubroInsumoPadre === null || this.idRubroInsumoPadre === 0;
  }

  public tieneSubrubros(): boolean {
    return this.subrubros.length > 0;
  }

  public getNombreRubroPadre(rubros: RubroInsumoDto[]): string {
    if (this.esRubroPadre()) return "Rubro Principal";

    const padre = rubros.find((rubro) => rubro.getIdRubroInsumo() === this.idRubroInsumoPadre);
    return padre ? padre.getNombre() : "Sin rubro padre";
  }
}
