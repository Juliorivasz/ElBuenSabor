import { RubroInsumo } from "./RubroInsumo";
import { UnidadDeMedida } from "./UnidadDeMedida";

export class ArticuloInsumo {
  private idInsumo: number;
  private nombre: string;
  private stockActual: number;
  private stockMinimo: number;
  private stockMaximo: number;
  private fechaBaja: Date;
  private unidadMedida: UnidadDeMedida;
  private rubroInsumo: RubroInsumo;

  constructor(
    idInsumo: number,
    nombre: string,
    stockActual: number,
    stockMinimo: number,
    stockMaximo: number,
    fechaBaja: Date,
    unidadMedida: UnidadDeMedida,
    rubroInsumo: RubroInsumo,
  ) {
    this.idInsumo = idInsumo;
    this.nombre = nombre;
    this.stockActual = stockActual;
    this.stockMinimo = stockMinimo;
    this.stockMaximo = stockMaximo;
    this.fechaBaja = fechaBaja;
    this.unidadMedida = unidadMedida;
    this.rubroInsumo = rubroInsumo;
  }

  public getIdInsumo(): number {
    return this.idInsumo;
  }
  public setIdInsumo(idInsumo: number): void {
    this.idInsumo = idInsumo;
  }
  public getNombre(): string {
    return this.nombre;
  }
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
  public getStockActual(): number {
    return this.stockActual;
  }
  public setStockActual(stockActual: number): void {
    this.stockActual = stockActual;
  }
  public getStockMinimo(): number {
    return this.stockMinimo;
  }
  public setStockMinimo(stockMinimo: number): void {
    this.stockMinimo = stockMinimo;
  }
  public getStockMaximo(): number {
    return this.stockMaximo;
  }
  public setStockMaximo(stockMaximo: number): void {
    this.stockMaximo = stockMaximo;
  }
  public getFechaBaja(): Date {
    return this.fechaBaja;
  }
  public setFechaBaja(fechaBaja: Date): void {
    this.fechaBaja = fechaBaja;
  }
  public getUnidadMedida(): UnidadDeMedida {
    return this.unidadMedida;
  }
  public setUnidadMedida(unidadMedida: UnidadDeMedida): void {
    this.unidadMedida = unidadMedida;
  }
  public getRubroInsumo(): RubroInsumo {
    return this.rubroInsumo;
  }
  public setRubroInsumo(rubroInsumo: RubroInsumo): void {
    this.rubroInsumo = rubroInsumo;
  }
}
