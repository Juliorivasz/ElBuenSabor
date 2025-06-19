import { Categoria } from "./Categoria";
import { Empresa } from "./Empresa";

export class Sucursal {
  private idSucursal: number;
  private nombre: string;
  private horarioApertura: Date;
  private horarioCierre: Date;
  private empresa: Empresa;
  private categorias: Categoria[];

  constructor(
    idSucursal: number,
    nombre: string,
    horarioApertura: Date,
    horarioCierre: Date,
    empresa: Empresa,
    categorias: Categoria[],
  ) {
    this.idSucursal = idSucursal;
    this.nombre = nombre;
    this.horarioApertura = horarioApertura;
    this.horarioCierre = horarioCierre;
    this.empresa = empresa;
    this.categorias = categorias;
  }

  getIdSucursal(): number {
    return this.idSucursal;
  }
  getNombre(): string {
    return this.nombre;
  }
  getHorarioApertura(): Date {
    return this.horarioApertura;
  }
  getHorarioCierre(): Date {
    return this.horarioCierre;
  }
  getEmpresa(): Empresa {
    return this.empresa;
  }
  getCategorias(): Categoria[] {
    return this.categorias;
  }
  setIdSucursal(idSucursal: number): void {
    this.idSucursal = idSucursal;
  }
  setNombre(nombre: string): void {
    this.nombre = nombre;
  }
  setHorarioApertura(horarioApertura: Date): void {
    this.horarioApertura = horarioApertura;
  }
  setHorarioCierre(horarioCierre: Date): void {
    this.horarioCierre = horarioCierre;
  }
  setEmpresa(empresa: Empresa): void {
    this.empresa = empresa;
  }
  setCategorias(categorias: Categoria[]): void {
    this.categorias = categorias;
  }
}
