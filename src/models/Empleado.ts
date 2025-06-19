import { Rol } from "./enum/Rol";
import { Usuario } from "./Usuario";

export class Empleado extends Usuario {
  private rol: Rol;

  constructor(
    idUsuario: number,
    nombre: string,
    apellido: string,
    email: string,
    contrasena: string,
    rol: Rol,
    telefono: string,
    urlImagen: string,
  ) {
    super(idUsuario, nombre, apellido, email, contrasena, apellido, telefono, urlImagen);
    this.rol = rol;
  }
  public getRol(): Rol {
    return this.rol;
  }
  public setRol(rol: Rol): void {
    this.rol = rol;
  }
}
