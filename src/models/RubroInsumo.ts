import { ArticuloInsumo } from "./ArticuloInsumo";

export class RubroInsumo {
  private idRubroInsumo: number;
  private nombre: string;
  private fechaBaja: Date;
  private listaInsumos: ArticuloInsumo[];
  private rubroInsumoPadre: RubroInsumo | null;

  constructor(
    idRubroInsumo: number,
    nombre: string,
    fechaBaja: Date,
    listaInsumos: ArticuloInsumo[],
    rubroInsumoPadre: RubroInsumo | null,
  ) {
    this.idRubroInsumo = idRubroInsumo;
    this.nombre = nombre;
    this.fechaBaja = fechaBaja;
    this.listaInsumos = listaInsumos;
    this.rubroInsumoPadre = rubroInsumoPadre;
  }
  public getIdRubroInsumo(): number {
    return this.idRubroInsumo;
  }
  public setIdRubroInsumo(idRubroInsumo: number): void {
    this.idRubroInsumo = idRubroInsumo;
  }
  public getNombre(): string {
    return this.nombre;
  }
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
  public getFechaBaja(): Date {
    return this.fechaBaja;
  }
  public setFechaBaja(fechaBaja: Date): void {
    this.fechaBaja = fechaBaja;
  }
  public getListaInsumos(): ArticuloInsumo[] {
    return this.listaInsumos;
  }
  public setListaInsumos(listaInsumos: ArticuloInsumo[]): void {
    this.listaInsumos = listaInsumos;
  }
  public getRubroInsumoPadre(): RubroInsumo | null {
    return this.rubroInsumoPadre;
  }
  public setRubroInsumoPadre(rubroInsumoPadre: RubroInsumo | null): void {
    this.rubroInsumoPadre = rubroInsumoPadre;
  }
  public addInsumo(insumo: ArticuloInsumo): void {
    this.listaInsumos.push(insumo);
  }
  public removeInsumo(insumo: ArticuloInsumo): void {
    this.listaInsumos = this.listaInsumos.filter((i) => i !== insumo);
  }
}
