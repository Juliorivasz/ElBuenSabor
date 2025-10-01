import { ActualizarEmpleadoDto } from "../models/dto/Empleado/ActualizarEmpleadoDto"
import { NuevoEmpleadoDto } from "../models/dto/Empleado/NuevoEmpleadoDto"
import { EmpleadoResponseDto, type IEmpleadoResponseDto } from "../models/dto/Empleado/EmpleadoResponseDto"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"
import type { PaginatedEmpleadosResponse, PaginatedEmpleadosResponseApi } from "./types/employees/employeesApi"

// Interfaces para el servicio
export interface INuevoEmpleadoDto {
  email: string
  password: string
  nombre: string
  apellido: string
  telefono: string
  nickName: string
  rolesAuth0Ids: string[]
}

export interface IActualizarEmpleadoDto {
  auth0Id: string
  email: string
  nombre: string
  apellido: string
  telefono: string
  nickName: string
  rolesAuth0Ids: string[]
}

export interface IEmpleadoFormData {
  email: string
  password?: string
  nombre: string
  apellido: string
  telefono: string
  rol: string
}

export interface IImagenUploadResponse {
  publicId: string
  message: string
  status: string
  imageUrl: string
}

// Funciones de transformación
export const transformarEmpleadoFormData = (data: IEmpleadoFormData): NuevoEmpleadoDto => {
  return new NuevoEmpleadoDto(
    data.email.trim().toLowerCase(),
    data.password?.trim() || "",
    data.nombre.trim(),
    data.apellido.trim(),
    data.telefono.trim(),
    `${data.nombre.trim()}.${data.apellido.trim()}`.toLowerCase(),
    [data.rol], // El rol ya viene como Auth0 ID desde el formulario
  )
}

export const transformarEmpleadoFormDataParaActualizar = (
  data: IEmpleadoFormData,
  auth0Id: string,
): ActualizarEmpleadoDto => {
  return new ActualizarEmpleadoDto(
    auth0Id,
    data.email.trim().toLowerCase(),
    data.nombre.trim(),
    data.apellido.trim(),
    data.telefono.trim(),
    `${data.nombre.trim()}.${data.apellido.trim()}`.toLowerCase(),
    [data.rol],
  )
}

export const transformarEmpleadoAFormData = (empleado: EmpleadoResponseDto): IEmpleadoFormData => {
  return {
    email: empleado.getEmail(),
    nombre: empleado.getNombre(),
    apellido: empleado.getApellido(),
    telefono: empleado.getTelefono(),
    rol: empleado.getRol() || "",
  }
}

class EmpleadoServicio {
  private baseUrl = "/empleado"

  // Mapear respuesta del backend a EmpleadoResponseDto
  private mapearEmpleadoDesdeBackend(empleadoBackend: IEmpleadoResponseDto): EmpleadoResponseDto {
    return new EmpleadoResponseDto(
      empleadoBackend.idUsuario,
      empleadoBackend.auth0Id,
      empleadoBackend.nombre,
      empleadoBackend.apellido,
      empleadoBackend.email,
      empleadoBackend.rol || "",
      empleadoBackend.telefono,
      empleadoBackend.fechaBaja,
      empleadoBackend.imagen || "",
    )
  }

  // 1. Obtener listado de empleados paginados (GET /empleado)
  async obtenerEmpleadosPaginados(page = 0, size = 10): Promise<PaginatedEmpleadosResponse> {
    try {
      const response = await interceptorsApiClient.get<PaginatedEmpleadosResponseApi>(
        `${this.baseUrl}?page=${page}&size=${size}`,
      )

      // Map the content to EmpleadoResponseDto instances
      const mappedContent = response.data.content.map((empleadoData) => this.mapearEmpleadoDesdeBackend(empleadoData))

      return {
        content: mappedContent,
        page: response.data.page,
      }
    } catch (error) {
      console.error("Error al obtener empleados paginados:", error)
      throw error
    }
  }

  // 2. Obtener todos los empleados (GET /empleado) - for export functionality
  async obtenerTodosLosEmpleados(): Promise<EmpleadoResponseDto[]> {
    try {
      // Fetch with a large page size to get all employees
      const response = await interceptorsApiClient.get<PaginatedEmpleadosResponseApi>(
        `${this.baseUrl}?page=0&size=10000`,
      )

      return response.data.content.map((empleadoData) => this.mapearEmpleadoDesdeBackend(empleadoData))
    } catch (error) {
      console.error("Error al obtener todos los empleados:", error)
      throw error
    }
  }

  // 3. Obtener empleado por ID (GET /empleado/{id})
  async obtenerEmpleadoPorId(id: number): Promise<EmpleadoResponseDto> {
    try {
      const response = await interceptorsApiClient.get<IEmpleadoResponseDto>(`${this.baseUrl}/${id}`)
      return this.mapearEmpleadoDesdeBackend(response.data)
    } catch (error) {
      console.error("Error al obtener empleado por ID:", error)
      throw error
    }
  }

  // 4. Crear nuevo empleado (POST /empleado/nuevo) - Solo devuelve status
  async crearEmpleado(nuevoEmpleadoDto: NuevoEmpleadoDto): Promise<void> {
    try {
      await interceptorsApiClient.post(`${this.baseUrl}/nuevo`, nuevoEmpleadoDto.toJson())
    } catch (error) {
      console.error("Error al crear empleado:", error)
      throw error
    }
  }

  // 5. Actualizar empleado (PUT /empleado/{id}) - Solo devuelve status
  async actualizarEmpleado(id: number, actualizarEmpleadoDto: ActualizarEmpleadoDto): Promise<void> {
    console.log("Actualizar empleado DTO:", actualizarEmpleadoDto)
    try {
      await interceptorsApiClient.put(`${this.baseUrl}/${id}`, actualizarEmpleadoDto.toJson())
    } catch (error) {
      console.error("Error al actualizar empleado:", error)
      throw error
    }
  }

  // 6. Alta/Baja lógica (POST /empleado/altaBaja/{id}) - Solo devuelve status
  async toggleAltaBaja(id: number): Promise<void> {
    try {
      await interceptorsApiClient.post(`${this.baseUrl}/altaBaja/${id}`)
    } catch (error) {
      console.error("Error en toggle alta/baja:", error)
      throw error
    }
  }

  // 7. Subir imagen del empleado (POST /empleado/{id}/imagen/upload) - Devuelve JSON con imageUrl
  async subirImagenEmpleado(id: number, file: File): Promise<IImagenUploadResponse> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await interceptorsApiClient.post<IImagenUploadResponse>(
        `${this.baseUrl}/${id}/imagen/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )

      return response.data
    } catch (error) {
      console.error("Error al subir imagen del empleado:", error)
      throw error
    }
  }
}

export const empleadoServicio = new EmpleadoServicio()

// Tipos exportados para usar en componentes
export type EmpleadoType = EmpleadoResponseDto
export type NuevoEmpleadoDtoType = NuevoEmpleadoDto
export type ActualizarEmpleadoDtoType = ActualizarEmpleadoDto
export type EmpleadoFormDataType = IEmpleadoFormData
export type ImagenUploadResponseType = IImagenUploadResponse
