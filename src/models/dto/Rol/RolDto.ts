export class RolDto {
  private idRol: number;
  private nombre: string;
  private auth0RoleId: string;

  constructor(idRol: number, nombre: string, auth0RoleId: string) {
    this.idRol = idRol;
    this.nombre = nombre;
    this.auth0RoleId = auth0RoleId;
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

  // Setters
  public setIdRol(idRol: number): void {
    this.idRol = idRol;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setAuth0RoleId(auth0RoleId: string): void {
    this.auth0RoleId = auth0RoleId;
  }
}
