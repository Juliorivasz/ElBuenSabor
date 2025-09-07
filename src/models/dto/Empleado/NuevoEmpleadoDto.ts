export interface INuevoEmpleadoDto {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  nickName: string;
  rolesAuth0Ids: string[];
}

export class NuevoEmpleadoDto {
  private email: string;
  private password: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private nickName: string;
  private rolesAuth0Ids: string[];

  constructor(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    telefono: string,
    nickName: string,
    rolesAuth0Ids: string[],
  ) {
    this.email = email;
    this.password = password;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.nickName = nickName;
    this.rolesAuth0Ids = rolesAuth0Ids;
  }

  // Getters
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

  public getNickName(): string {
    return this.nickName;
  }

  public getRolesAuth0Ids(): string[] {
    return this.rolesAuth0Ids;
  }

  // Setters
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

  public setNickName(nickName: string): void {
    this.nickName = nickName;
  }

  public setRolesAuth0Ids(rolesAuth0Ids: string[]): void {
    this.rolesAuth0Ids = rolesAuth0Ids;
  }

  // Método para convertir a JSON para enviar al backend
  public toJson(): INuevoEmpleadoDto {
    return {
      email: this.email,
      password: this.password,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      nickName: this.nickName,
      rolesAuth0Ids: this.rolesAuth0Ids,
    };
  }

  // Método estático para crear desde JSON
  public static fromJson(data: INuevoEmpleadoDto): NuevoEmpleadoDto {
    return new NuevoEmpleadoDto(
      data.email,
      data.password,
      data.nombre,
      data.apellido,
      data.telefono,
      data.nickName,
      data.rolesAuth0Ids,
    );
  }
}
