import { Sucursal } from "./Sucursal";

export class Empresa {
  private idEmpresa: number;
  private nombre: string;
  private razonsocial: string;
  private cuil: string;
  private sucursales: Sucursal[];

  constructor(idEmpresa: number, nombre: string, razonsocial: string, cuil: string, sucursales: Sucursal[]) {
    this.idEmpresa = idEmpresa;
    this.nombre = nombre;
    this.razonsocial = razonsocial;
    this.cuil = cuil;
    this.sucursales = sucursales;
  }

  getIdEmpresa(): number {
    return this.idEmpresa;
  }
  getNombre(): string {
    return this.nombre;
  }
  getRazonsocial(): string {
    return this.razonsocial;
  }
  getCuil(): string {
    return this.cuil;
  }
  getSucursales(): Sucursal[] {
    return this.sucursales;
  }
  setIdEmpresa(idEmpresa: number): void {
    this.idEmpresa = idEmpresa;
  }
  setNombre(nombre: string): void {
    this.nombre = nombre;
  }
  setRazonsocial(razonsocial: string): void {
    this.razonsocial = razonsocial;
  }
  setCuil(cuil: string): void {
    this.cuil = cuil;
  }
  setSucursales(sucursales: Sucursal[]): void {
    this.sucursales = sucursales;
  }
}
