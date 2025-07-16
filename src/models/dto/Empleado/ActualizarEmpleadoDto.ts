export interface IActualizarEmpleadoDto {
  auth0Id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  nickName: string;
  rolesAuth0Ids: string[];
}

export class ActualizarEmpleadoDto {
  private auth0Id: string;
  private email: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private nickName: string;
  private rolesAuth0Ids: string[];

  constructor(
    auth0Id: string,
    email: string,
    nombre: string,
    apellido: string,
    telefono: string,
    nickName: string,
    rolesAuth0Ids: string[],
  ) {
    this.auth0Id = auth0Id;
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.nickName = nickName;
    this.rolesAuth0Ids = rolesAuth0Ids;
  }

  // Getters
  public getAuth0Id(): string {
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

  public getNickName(): string {
    return this.nickName;
  }

  public getRolesAuth0Ids(): string[] {
    return this.rolesAuth0Ids;
  }

  // Setters
  public setAuth0Id(auth0Id: string): void {
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

  public setNickName(nickName: string): void {
    this.nickName = nickName;
  }

  public setRolesAuth0Ids(rolesAuth0Ids: string[]): void {
    this.rolesAuth0Ids = rolesAuth0Ids;
  }

  // Método para convertir a JSON para enviar al backend
  public toJson(): IActualizarEmpleadoDto {
    return {
      auth0Id: this.auth0Id,
      email: this.email,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      nickName: this.nickName,
      rolesAuth0Ids: this.rolesAuth0Ids,
    };
  }

  // Método estático para crear desde JSON
  public static fromJson(data: IActualizarEmpleadoDto): ActualizarEmpleadoDto {
    return new ActualizarEmpleadoDto(
      data.auth0Id,
      data.email,
      data.nombre,
      data.apellido,
      data.telefono,
      data.nickName,
      data.rolesAuth0Ids,
    );
  }
}
