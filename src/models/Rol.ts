import { Usuario } from "./Usuario";

export class Rol {
  private idRol: number;
  private nombre: string;
  private auth0RoleId: string;
  private usuarios: Usuario[] = [];

  constructor(idRol: number, nombre: string, auth0RoleId: string, usuarios: Usuario[]) {
    this.idRol = idRol;
    this.nombre = nombre;
    this.auth0RoleId = auth0RoleId;
    this.usuarios = usuarios;
  }

  // Getters
  public getIdRol(): number {
    return this.idRol;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getAuth0RoleId(): string {
    return this.auth0RoleId;
  }

  public getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  // Setters
  public setId(idRol: number): void {
    this.idRol = idRol;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setAuth0RoleId(auth0RoleId: string): void {
    this.auth0RoleId = auth0RoleId;
  }

  public setUsuarios(usuarios: Usuario[]): void {
    this.usuarios = usuarios;
  }
}
