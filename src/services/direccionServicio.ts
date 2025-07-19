import type { Direccion } from "../models/Direccion"
import type { Departamento } from "../models/Departamento"
import type { DireccionDTO } from "../models/dto/DireccionDTO"
import type { DireccionesResponseDTO } from "../models/dto/DireccionesResponseDTO"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"

export const direccionServicio = {
  // Obtener direcciones del cliente
  async obtenerDireccionesCliente(): Promise<Direccion[]> {
    try {
      const response = await interceptorsApiClient.get<DireccionesResponseDTO>(`/direccion/obtenerDireccionesCliente`)
      return response.data.direcciones
    } catch (error) {
      console.error("Error al obtener direcciones:", error)
      throw error
    }
  },

  // Obtener departamentos de Mendoza
  async obtenerDepartamentosMendoza(): Promise<Departamento[]> {
    try {
      const response = await interceptorsApiClient.get<Departamento[]>(`/api/departamentos/mendoza`)
      return response.data
    } catch (error) {
      console.error("Error al obtener departamentos:", error)
      throw error
    }
  },

  // Crear nueva dirección
  async crearDireccion(direccion: DireccionDTO): Promise<void> {
    try {
      await interceptorsApiClient.post(`/direccion/nueva`, direccion)
    } catch (error) {
      console.error("Error al crear dirección:", error)
      throw error
    }
  },

  // Modificar dirección existente
  async modificarDireccion(idDireccion: number, direccion: DireccionDTO): Promise<void> {
    try {
      await interceptorsApiClient.put(`/direccion/modificar/${idDireccion}`, direccion)
    } catch (error) {
      console.error("Error al modificar dirección:", error)
      throw error
    }
  },

  // Eliminar dirección
  async eliminarDireccion(idDireccion: number): Promise<void> {
    try {
      await interceptorsApiClient.delete(`/direccion/eliminar/${idDireccion}`)
    } catch (error) {
      console.error("Error al eliminar dirección:", error)
      throw error
    }
  },
}
