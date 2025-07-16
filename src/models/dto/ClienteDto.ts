export class ClienteDto {
  private idAuth0: number;
  private email: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private imagen: string;

  constructor(idAuth0: number, email: string, nombre: string, apellido: string, telefono: string, imagen: string) {
    this.idAuth0 = idAuth0;
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.imagen = imagen;
  }
  // Getters
  public getidAuth0(): number {
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

  public getImagen(): string {
    return this.imagen;
  }

  // Setters
  public setidAuth0(idAuth0: number): void {
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

  public setImagen(imagen: string): void {
    this.imagen = imagen;
  }
}
