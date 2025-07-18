import { Imagen } from "./Imagen";
import { Rol } from "./Rol";
import { Usuario } from "./Usuario";

export class Empleado extends Usuario {
  private fechaBaja: Date;

  constructor(
    idUsuario: number,
    auth0Id: string,
    email: string,
    nombre: string,
    apellido: string,
    telefono: string,
    imagen: Imagen,
    rol: Rol,
    fechaBaja: Date,
  ) {
    super(idUsuario, auth0Id, email, nombre, apellido, telefono, imagen, rol);
    this.fechaBaja = fechaBaja;
  }

  public getFechaBaja(): Date {
    return this.fechaBaja;
  }

  public setFechaBaja(fecha: Date): void {
    this.fechaBaja = fecha;
  }
}
