import axios from "axios"
import { Rol } from "../models/enum/Rol"

// Interfaz para la dirección en el DTO
export interface DireccionDto {
  calle: string
  numero: string
  piso?: string
  dpto?: string
  idDepartamento: number
}

// DTO para crear nuevo empleado (POST /empleado/nuevo)
export interface NuevoEmpleadoDto {
  nombre: string
  apellido: string
  email: string
  telefono: string
  password: string
  rol: Rol
  direccion: DireccionDto
}

// DTO para actualizar empleado (PUT /empleado/{id})
export interface ActualizarEmpleadoDto {
  nombre: string
  apellido: string
  email: string
  telefono: string
  password: string
  rol: Rol
  direccion: DireccionDto
}

// Interfaz para departamentos (GET /api/departamentos/mendoza)
export interface Departamento {
  id: number
  nombre: string
}

// Interfaz que representa la respuesta del backend (GET /empleado)
export interface EmpleadoResponseDto {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  rol: Rol
  activo: boolean
  departamentoNombre: string
  calle: string
  numero: string
  piso?: string
  dpto?: string
}

// Interfaz para uso interno del frontend (mantiene compatibilidad)
export interface Empleado {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  rol: Rol
  activo: boolean
  departamento: string
  calle: string
  numero: string
  piso?: string
  dpto?: string
  departamentoNombre: string
  direccion: {
    calle: string
    numero: string
    piso?: string
    dpto?: string
    departamento: string
  }
}

// Interfaz para el formulario (formato plano)
export interface EmpleadoFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  rol: Rol
  calle: string
  numero: string
  piso?: string
  dpto?: string
  idDepartamento: number
  password?: string
}
const empleadosData: EmpleadoResponseDto[] = []
// Funciones adaptadoras para transformar entre formatos

// Transformar datos del formulario plano a DTO con dirección anidada (CREAR)
export const transformarEmpleadoFormData = (data: EmpleadoFormData): NuevoEmpleadoDto => ({
  nombre: data.nombre.trim(),
  apellido: data.apellido.trim(),
  telefono: data.telefono.trim(),
  email: data.email.trim().toLowerCase(),
  password: data.password?.trim() || "",
  rol: data.rol,
  direccion: {
    calle: data.calle.trim(),
    numero: data.numero.trim(),
    piso: data.piso?.trim() || undefined,
    dpto: data.dpto?.trim() || undefined,
    idDepartamento: data.idDepartamento,
  },
})

// Transformar datos del formulario para actualización (EDITAR)
export const transformarEmpleadoFormDataParaActualizar = (data: EmpleadoFormData): ActualizarEmpleadoDto => ({
  nombre: data.nombre.trim(),
  apellido: data.apellido.trim(),
  telefono: data.telefono.trim(),
  email: data.email.trim().toLowerCase(),
  password: "", // No se actualiza la contraseña en edición
  rol: data.rol,
  direccion: {
    calle: data.calle.trim(),
    numero: data.numero.trim(),
    piso: data.piso?.trim() || undefined,
    dpto: data.dpto?.trim() || undefined,
    idDepartamento: data.idDepartamento,
  },
})

// Transformar DTO del backend a formato plano para el formulario
export const transformarDtoAFormData = (dto: EmpleadoResponseDto): EmpleadoFormData => ({
  nombre: dto.nombre || "",
  apellido: dto.apellido || "",
  telefono: dto.telefono || "",
  email: dto.email || "",
  password: "", // Siempre vacío en edición
  rol: dto.rol,
  calle: dto.calle || "",
  numero: dto.numero || "",
  piso: dto.piso || "",
  dpto: dto.dpto || "",
  idDepartamento: 0, // Se establecerá después al cargar departamentos
})

class EmpleadoServicio {
  private baseUrl = "http://localhost:8080/empleado"
  private departamentosUrl = "http://localhost:8080/api/departamentos/mendoza"
  private useMockData = false // Flag para usar datos mock

  // Función para mapear los datos del backend a nuestra interfaz interna
  private mapearEmpleado(empleadoBackend: EmpleadoResponseDto): Empleado {
    return {
      id: empleadoBackend.id,
      nombre: empleadoBackend.nombre,
      apellido: empleadoBackend.apellido,
      email: empleadoBackend.email,
      telefono: empleadoBackend.telefono,
      rol: empleadoBackend.rol,
      activo: empleadoBackend.activo,
      departamento: empleadoBackend.departamentoNombre || "Sin departamento",
      calle: empleadoBackend.calle || "",
      numero: empleadoBackend.numero || "",
      piso: empleadoBackend.piso || "",
      dpto: empleadoBackend.dpto || "",
      departamentoNombre: empleadoBackend.departamentoNombre || "Sin departamento",
      direccion: {
        calle: empleadoBackend.calle || "",
        numero: empleadoBackend.numero || "",
        piso: empleadoBackend.piso || "",
        dpto: empleadoBackend.dpto || "",
        departamento: empleadoBackend.departamentoNombre || "Sin departamento",
      },
    }
  }

  // Función para formatear la dirección según las especificaciones
  public formatearDireccion(empleado: EmpleadoResponseDto | Empleado): string {
    let calle: string, numero: string, piso: string | undefined, dpto: string | undefined, departamento: string

    // Determinar si es EmpleadoResponseDto o Empleado
    if (
      (empleado as EmpleadoResponseDto).departamentoNombre !== undefined &&
      (empleado as EmpleadoResponseDto).departamentoNombre !== null
    ) {
      // Es EmpleadoResponseDto (datos del backend)
      const emp = empleado as EmpleadoResponseDto
      calle = emp.calle
      numero = emp.numero
      piso = emp.piso
      dpto = emp.dpto
      departamento = emp.departamentoNombre
    } else {
      // Es Empleado (datos mapeados)
      const emp = empleado as Empleado
      calle = emp.calle || ""
      numero = emp.numero || ""
      piso = emp.piso
      dpto = emp.dpto
      departamento = emp.departamentoNombre || emp.departamento
    }

    // Validar que tengamos al menos calle y número
    if (!calle || !numero) {
      return "Sin dirección"
    }

    // Construir la dirección formateada
    let direccionFormateada = `${calle} ${numero}`

    // Agregar piso y/o departamento si existen
    const detalles = []
    if (piso && piso.trim()) {
      detalles.push(`Piso ${piso}`)
    }
    if (dpto && dpto.trim()) {
      detalles.push(`Dpto ${dpto}`)
    }

    if (detalles.length > 0) {
      direccionFormateada += `\n${detalles.join(" - ")}`
    }

    // Agregar departamento
    if (departamento && departamento.trim()) {
      direccionFormateada += `\n${departamento}`
    }

    return direccionFormateada
  }

  // 1. Obtener listado de empleados (GET /empleado)
  async obtenerEmpleados(): Promise<Empleado[]> {
    try {
      if (this.useMockData) {
        // Usar datos mock del JSON
        console.log("Usando datos mock de empleados")
        return empleadosData.map((empleado) => this.mapearEmpleado(empleado as EmpleadoResponseDto))
      }

      const response = await axios.get<EmpleadoResponseDto[]>(this.baseUrl)
      console.log("Respuesta del backend - empleados:", response.data)

      // Mapear cada empleado del backend a nuestra interfaz interna
      return response.data.map((empleado) => this.mapearEmpleado(empleado))
    } catch (error) {
      console.error("Error al obtener empleados:", error)
      // Fallback a datos mock en caso de error
      console.log("Fallback a datos mock debido a error")
      return empleadosData.map((empleado) => this.mapearEmpleado(empleado as EmpleadoResponseDto))
    }
  }

  // 2. Alta de nuevo empleado (POST /empleado/nuevo)
  async crearEmpleado(empleado: NuevoEmpleadoDto): Promise<void> {
    try {
      if (this.useMockData) {
        console.log("Mock: Creando empleado:", empleado)
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return
      }

      console.log("Creando empleado:", empleado)
      const response = await axios.post(`${this.baseUrl}/nuevo`, empleado)
      console.log("Empleado creado exitosamente:", response.data)
    } catch (error) {
      console.error("Error al crear empleado:", error)
      throw error
    }
  }

  // 3. Obtener empleado por ID para edición (GET /empleado/{id})
  async obtenerEmpleadoPorId(id: number): Promise<Empleado> {
    try {
      if (this.useMockData) {
        const empleado = empleadosData.find((emp) => emp.id === id)
        if (!empleado) {
          throw new Error(`Empleado con ID ${id} no encontrado`)
        }
        return this.mapearEmpleado(empleado as EmpleadoResponseDto)
      }

      const response = await axios.get<EmpleadoResponseDto>(`${this.baseUrl}/${id}`)
      console.log("Empleado obtenido por ID:", response.data)
      return this.mapearEmpleado(response.data)
    } catch (error) {
      console.error("Error al obtener empleado por ID:", error)
      throw error
    }
  }

  // 3. Edición de empleado (PUT /empleado/{id})
  async actualizarEmpleado(id: number, empleado: ActualizarEmpleadoDto): Promise<void> {
    try {
      if (this.useMockData) {
        console.log("Mock: Actualizando empleado:", id, empleado)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return
      }

      console.log("Actualizando empleado:", id, empleado)
      const response = await axios.put(`${this.baseUrl}/${id}`, empleado)
      console.log("Empleado actualizado exitosamente:", response.data)
    } catch (error) {
      console.error("Error al actualizar empleado:", error)
      throw error
    }
  }

  // 4. Alta/Baja lógica (POST /empleado/altaBaja/{id})
  async toggleAltaBaja(id: number): Promise<void> {
    try {
      if (this.useMockData) {
        console.log(`Mock: Toggle alta/baja para empleado ID: ${id}`)
        await new Promise((resolve) => setTimeout(resolve, 500))
        return
      }

      console.log(`Ejecutando toggle alta/baja para empleado ID: ${id}`)
      const response = await axios.post(`${this.baseUrl}/altaBaja/${id}`)
      console.log("Toggle alta/baja ejecutado exitosamente:", response.data)
    } catch (error) {
      console.error("Error en toggle alta/baja:", error)
      throw error
    }
  }

  // 5. Obtener departamentos (GET /api/departamentos/mendoza)
  async obtenerDepartamentos(): Promise<Departamento[]> {
    try {
      if (this.useMockData) {
        // Datos mock de departamentos
        return [
          { id: 1, nombre: "Capital" },
          { id: 2, nombre: "Godoy Cruz" },
          { id: 3, nombre: "Las Heras" },
          { id: 4, nombre: "Maipú" },
          { id: 5, nombre: "Guaymallén" },
          { id: 6, nombre: "Luján de Cuyo" },
          { id: 7, nombre: "San Rafael" },
          { id: 8, nombre: "Mendoza" },
        ]
      }

      const response = await axios.get<Departamento[]>(this.departamentosUrl)
      console.log("Departamentos obtenidos:", response.data)
      return response.data
    } catch (error) {
      console.error("Error al obtener departamentos:", error)
      // Fallback a datos mock
      return [
        { id: 1, nombre: "Capital" },
        { id: 2, nombre: "Godoy Cruz" },
        { id: 3, nombre: "Las Heras" },
        { id: 4, nombre: "Maipú" },
        { id: 5, nombre: "Guaymallén" },
        { id: 6, nombre: "Luján de Cuyo" },
        { id: 7, nombre: "San Rafael" },
        { id: 8, nombre: "Mendoza" },
      ]
    }
  }
}

export const empleadoServicio = new EmpleadoServicio()
