export class ClienteDto {
  private auth0Id: number;
  private email: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private imagen: string;

  constructor(auth0Id: number, email: string, nombre: string, apellido: string, telefono: string, imagen: string) {
    this.auth0Id = auth0Id;
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.imagen = imagen;
  }
  // Getters
  public getauth0Id(): number {
    return this.auth0Id;
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

  public getImagen(): string {
    return this.imagen;
  }

  // Setters
  public setauth0Id(auth0Id: number): void {
    this.auth0Id = auth0Id;
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

  public setImagen(imagen: string): void {
    this.imagen = imagen;
  }
}
