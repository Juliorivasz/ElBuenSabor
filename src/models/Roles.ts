import { Usuario } from "./Usuario";

export class Roles {
  private id: number;
  private name: string;
  private auth0RoleId: string;
  private usuarios: Usuario[];

  constructor(id: number, name: string, auth0RoleId: string, usuarios: Usuario[]) {
    this.id = id;
    this.name = name;
    this.auth0RoleId = auth0RoleId;
    this.usuarios = usuarios;
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getAuth0RoleId(): string {
    return this.auth0RoleId;
  }

  public getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  // Setters
  public setId(id: number): void {
    this.id = id;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setAuth0RoleId(auth0RoleId: string): void {
    this.auth0RoleId = auth0RoleId;
  }

  public setUsuarios(usuarios: Usuario[]): void {
    this.usuarios = usuarios;
  }
}
