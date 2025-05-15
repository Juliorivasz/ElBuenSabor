export class Usuario {
  private idUsuario: number;
  private idAuth0: string;
  private email: string;
  private password: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private urlImagen: string;

  constructor(
    idUsuario: number,
    idAuth0: string,
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    telefono: string,
    urlImagen: string,
  ) {
    this.idUsuario = idUsuario;
    this.idAuth0 = idAuth0;
    this.email = email;
    this.password = password;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.urlImagen = urlImagen;
  }
  public getIdUsuario(): number {
    return this.idUsuario;
  }
  public getIdAuth0(): string {
    return this.idAuth0;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
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
  public getUrlImagen(): string {
    return this.urlImagen;
  }
  public setIdUsuario(idUsuario: number): void {
    this.idUsuario = idUsuario;
  }
  public setIdAuth0(idAuth0: string): void {
    this.idAuth0 = idAuth0;
  }
  public setEmail(email: string): void {
    this.email = email;
  }
  public setPassword(password: string): void {
    this.password = password;
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
  public setUrlImagen(urlImagen: string): void {
    this.urlImagen = urlImagen;
  }
}
