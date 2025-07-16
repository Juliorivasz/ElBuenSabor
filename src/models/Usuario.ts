import { Imagen } from "./Imagen";
import { Rol } from "./Rol";

export class Usuario {
  private idUsuario: number;
  private idAuth0: string;
  private email: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private imagen: Imagen;
  private rol: Rol;

  constructor(
    idUsuario: number,
    idAuth0: string,
    email: string,
    nombre: string,
    apellido: string,
    telefono: string,
    imagen: Imagen,
    rol: Rol,
  ) {
    this.idUsuario = idUsuario;
    this.idAuth0 = idAuth0;
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.imagen = imagen;
    this.rol = rol;
  }

  // Getters
  public getIdUsuario(): number {
    return this.idUsuario;
  }

  public getauth0Id(): string {
    return this.idAuth0;
  }

  public getEmail(): string {
    return this.email;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getApellido(): string {
    return this.apellido;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public getImagen(): Imagen {
    return this.imagen;
  }

  public getRol(): Rol {
    return this.rol;
  }

  // Setters
  public setIdUsuario(idUsuario: number): void {
    this.idUsuario = idUsuario;
  }

  public setauth0Id(auth0Id: string): void {
    this.idAuth0 = auth0Id;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  public setImagen(imagen: Imagen): void {
    this.imagen = imagen;
  }

  public setRol(rol: Rol): void {
    this.rol = rol;
  }
}
