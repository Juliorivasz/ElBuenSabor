"use client"

import { Edit, Eye, UserCheck, UserX } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { EmpleadoResponseDto } from "../../models/dto/Empleado/EmpleadoResponseDto"
import { empleadoServicio } from "../../services/empleadoServicio"
import { NotificationService } from "../../utils/notifications"

interface IEmpleadosTableProps {
  empleados: EmpleadoResponseDto[]
  onEmpleadoEditado: () => void
}

export const EmpleadosTable: React.FC<IEmpleadosTableProps> = ({ empleados, onEmpleadoEditado }) => {
  const navigate = useNavigate()
  const [empleadoCargando, setEmpleadoCargando] = useState<number | null>(null)

  const manejarToggleEstado = async (empleado: EmpleadoResponseDto) => {
    const estaActivo = esEmpleadoActivo(empleado)
    const nombreCompleto = `${empleado.getNombre()} ${empleado.getApellido()}`

    try {
      // Mostrar confirmación
      const confirmacion = estaActivo
        ? await NotificationService.confirm(
            "¿Desactivar empleado?",
            `¿Estás seguro de que deseas desactivar a ${nombreCompleto}? Esta acción se puede revertir.`,
          )
        : await NotificationService.confirm(
            "¿Activar empleado?",
            `¿Estás seguro de que deseas activar a ${nombreCompleto}?`,
          )

      if (!confirmacion) {
        return
      }

      setEmpleadoCargando(empleado.getIdUsuario())
      await empleadoServicio.toggleAltaBaja(empleado.getIdUsuario())

      // Mostrar notificación de éxito
      if (estaActivo) {
        await NotificationService.success(
          "¡Empleado desactivado!",
          `${nombreCompleto} ha sido desactivado del sistema.`,
        )
      } else {
        await NotificationService.success("¡Empleado activado!", `${nombreCompleto} ha sido activado en el sistema.`)
      }

      onEmpleadoEditado() // Recargar la lista
    } catch (error) {
      console.error("Error al cambiar estado del empleado:", error)
      await NotificationService.error("Error", "No se pudo cambiar el estado del empleado")
    } finally {
      setEmpleadoCargando(null)
    }
  }

  const manejarEditar = (empleado: EmpleadoResponseDto) => {
    navigate(`/admin/empleados/editar/${empleado.getIdUsuario()}`)
  }

  const obtenerUrlImagen = (empleado: EmpleadoResponseDto): string => {
    const imagen = empleado.getImagen()
    if (imagen && imagen.trim() !== "") {
      return imagen
    }
    return "/placeholder.svg?height=40&width=40"
  }

  const esEmpleadoActivo = (empleado: EmpleadoResponseDto): boolean => {
    const fechaBaja = empleado.getFechaBaja()
    return fechaBaja === null || new Date(fechaBaja).getTime() === 0
  }

  const getRolColor = (rol: string | null): string => {
    if (!rol) return "bg-gray-100 text-gray-800"

    switch (rol.toUpperCase()) {
      case "ADMINISTRADOR":
        return "bg-purple-100 text-purple-800"
      case "COCINERO":
        return "bg-orange-100 text-orange-800"
      case "REPARTIDOR":
        return "bg-blue-100 text-blue-800"
      case "CAJERO":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (empleados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empleados</h3>
        <p className="text-sm text-gray-500">No se encontraron empleados con los filtros aplicados.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Vista móvil - Cards */}
      <div className="block lg:hidden space-y-4">
        {empleados.map((empleado) => {
          const estaActivo = esEmpleadoActivo(empleado)
          const estaCargando = empleadoCargando === empleado.getIdUsuario()
          const nombreCompleto = `${empleado.getNombre()} ${empleado.getApellido()}`

          return (
            <div
              key={`empleado-mobile-${empleado.getIdUsuario()}`}
              className="bg-white rounded-lg shadow-sm border p-4 space-y-4"
            >
              {/* Header con imagen y nombre */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={obtenerUrlImagen(empleado) || "/placeholder.svg"}
                    alt={nombreCompleto}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=48&width=48"
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{nombreCompleto}</h3>
                  <p className="text-sm text-gray-500">ID: {empleado.getIdUsuario()}</p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      estaActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {estaActivo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              {/* Información del empleado */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900 break-all">{empleado.getEmail()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Teléfono:</span>
                  <p className="text-gray-900">{empleado.getTelefono()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Rol:</span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRolColor(
                      empleado.getRol(),
                    )}`}
                  >
                    {empleado.getRol() || "Sin rol"}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => manejarEditar(empleado)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  disabled={estaCargando}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => manejarToggleEstado(empleado)}
                  disabled={estaCargando}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    estaActivo
                      ? "text-red-600 bg-red-50 hover:bg-red-100 focus:ring-red-500"
                      : "text-green-600 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {estaCargando ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                  ) : estaActivo ? (
                    <UserX className="h-4 w-4 mr-1" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-1" />
                  )}
                  {estaCargando ? "..." : estaActivo ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Vista desktop - Tabla */}
      <div className="hidden lg:block bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {empleados.map((empleado) => {
                const estaActivo = esEmpleadoActivo(empleado)
                const estaCargando = empleadoCargando === empleado.getIdUsuario()
                const nombreCompleto = `${empleado.getNombre()} ${empleado.getApellido()}`

                return (
                  <tr key={`empleado-desktop-${empleado.getIdUsuario()}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={obtenerUrlImagen(empleado) || "/placeholder.svg"}
                            alt={nombreCompleto}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=40&width=40"
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{nombreCompleto}</div>
                          <div className="text-sm text-gray-500">ID: {empleado.getIdUsuario()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{empleado.getEmail()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{empleado.getTelefono()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRolColor(
                          empleado.getRol(),
                        )}`}
                      >
                        {empleado.getRol() || "Sin rol"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          estaActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {estaActivo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => manejarEditar(empleado)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          disabled={estaCargando}
                          title="Editar empleado"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => manejarToggleEstado(empleado)}
                          disabled={estaCargando}
                          className={`p-2 rounded-full transition-colors ${
                            estaActivo
                              ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                              : "text-green-600 hover:text-green-800 hover:bg-green-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={estaActivo ? "Desactivar empleado" : "Activar empleado"}
                        >
                          {estaCargando ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          ) : estaActivo ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
