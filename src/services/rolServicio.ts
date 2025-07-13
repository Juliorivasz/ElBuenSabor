import { RolDto } from "../models/dto/Rol/RolDto";
import { interceptorsApiClient } from "./interceptors/axios.interceptors";

// Interfaz para el rol (según la estructura real del backend)
export interface IRolDto {
  idRol: number;
  nombre: string;
  auth0RoleId: string;
}

export const irolDtoToRolDto = (irol: IRolDto): RolDto => {
  return new RolDto(irol.idRol, irol.nombre, irol.auth0RoleId);
};

export class RolServicio {
  private baseUrl = "/usuario";

  // Obtener todos los roles
  async obtenerRoles(): Promise<RolDto[]> {
    try {
      const response = await interceptorsApiClient.get<IRolDto[]>(`${this.baseUrl}/todosRoles`);
      return response.data.map(irolDtoToRolDto);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      throw error;
    }
  }

  // Obtener solo roles activos (excluyendo CLIENTE)
  async obtenerRolesActivos(): Promise<RolDto[]> {
    try {
      const roles = await this.obtenerRoles();
      // Filtrar roles que no sean CLIENTE
      return roles.filter((rol) => rol.getNombre() !== "CLIENTE");
    } catch (error) {
      console.error("Error al obtener roles activos:", error);
      throw error;
    }
  }

  // Obtener rol por ID
  async obtenerRolPorId(idRol: number): Promise<RolDto> {
    try {
      const response = await interceptorsApiClient.get<IRolDto>(`${this.baseUrl}/${idRol}`);
      return irolDtoToRolDto(response.data);
    } catch (error) {
      console.error("Error al obtener rol por ID:", error);
      throw error;
    }
  }
}

export const rolServicio = new RolServicio();
