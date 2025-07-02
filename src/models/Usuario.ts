import { Imagen } from "./Imagen";
import { Roles } from "./Roles";

export class Usuario {
  private idUsuario: number;
  private idAuth0: string;
  private email: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private imagen: Imagen;
  private activo: boolean;
  private fechaCreacion: Date;
  private fechaActualizacion: Date;
  private roles: Roles[];

  constructor(
    idUsuario: number,
    idAuth0: string,
    email: string,
    nombre: string,
    apellido: string,
    telefono: string,
    imagen: Imagen,
    activo: boolean,
    fechaCreacion: Date,
    fechaActualizacion: Date,
    roles: Roles[],
  ) {
    this.idUsuario = idUsuario;
    this.idAuth0 = idAuth0;
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.imagen = imagen;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
    this.roles = roles;
  }

  // Getters
  public getIdUsuario(): number {
    return this.idUsuario;
  }

  public getIdAuth0(): string {
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

  public getActivo(): boolean {
    return this.activo;
  }

  public getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  public getFechaActualizacion(): Date {
    return this.fechaActualizacion;
  }

  public getRoles(): Roles[] {
    return this.roles;
  }

  // Setters
  public setIdUsuario(idUsuario: number): void {
    this.idUsuario = idUsuario;
  }

  public setIdAuth0(idAuth0: string): void {
    this.idAuth0 = idAuth0;
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

  public setActivo(activo: boolean): void {
    this.activo = activo;
  }

  public setFechaCreacion(fechaCreacion: Date): void {
    this.fechaCreacion = fechaCreacion;
  }

  public setFechaActualizacion(fechaActualizacion: Date): void {
    this.fechaActualizacion = fechaActualizacion;
  }

  public setRoles(roles: Roles[]): void {
    this.roles = roles;
  }
}
