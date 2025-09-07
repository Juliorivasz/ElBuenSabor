export interface IEmpleadoResponseDto {
  idUsuario: number;
  auth0Id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  telefono: string;
  fechaBaja: Date;
  imagen: string;
}

export class EmpleadoResponseDto {
  private idUsuario: number;
  private auth0Id: string;
  private nombre: string;
  private apellido: string;
  private email: string;
  private rol: string;
  private telefono: string;
  private fechaBaja: Date;
  private imagen: string;

  constructor(
    idUsuario: number,
    auth0Id: string,
    nombre: string,
    apellido: string,
    email: string,
    rol: string,
    telefono: string,
    fechaBaja: Date,
    imagen: string,
  ) {
    this.idUsuario = idUsuario;
    this.auth0Id = auth0Id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.rol = rol;
    this.telefono = telefono;
    this.fechaBaja = fechaBaja;
    this.imagen = imagen;
  }

  // Getters
  public getIdUsuario(): number {
    return this.idUsuario;
  }

  public getAuth0Id(): string {
    return this.auth0Id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getApellido(): string {
    return this.apellido;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRol(): string {
    return this.rol;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public getFechaBaja(): Date {
    return this.fechaBaja;
  }

  public getImagen(): string {
    return this.imagen;
  }

  // Setters
  public setIdUsuario(idUsuario: number): void {
    this.idUsuario = idUsuario;
  }

  public setAuth0Id(auth0Id: string): void {
    this.auth0Id = auth0Id;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setRol(rol: string): void {
    this.rol = rol;
  }

  public setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  public setFechaBaja(fechaBaja: Date): void {
    this.fechaBaja = fechaBaja;
  }

  public setImagen(imagen: string): void {
    this.imagen = imagen;
  }

  // Método para convertir a JSON
  public toJson(): IEmpleadoResponseDto {
    return {
      idUsuario: this.idUsuario,
      auth0Id: this.auth0Id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      rol: this.rol,
      telefono: this.telefono,
      fechaBaja: this.fechaBaja,
      imagen: this.imagen,
    };
  }

  // Método estático para crear desde JSON
  public static fromJson(data: IEmpleadoResponseDto): EmpleadoResponseDto {
    return new EmpleadoResponseDto(
      data.idUsuario,
      data.auth0Id,
      data.nombre,
      data.apellido,
      data.email,
      data.rol,
      data.telefono,
      data.fechaBaja,
      data.imagen,
    );
  }
}
