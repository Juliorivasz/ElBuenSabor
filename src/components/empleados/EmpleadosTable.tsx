"use client"

import { Download, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import { useState } from "react"
import type { Empleado } from "../../services/empleadoServicio"
import { exportarEmpleadosAExcel } from "../../utils/exportUtils"

interface EmpleadosTableProps {
  empleados: Empleado[]
  onEditar: (id: number) => void
  onToggleEstado: (id: number) => void
  actionLoading: number | null
}

export const EmpleadosTable = ({ empleados, onEditar, onToggleEstado, actionLoading }: EmpleadosTableProps) => {
  const [exportLoading, setExportLoading] = useState(false)

  const formatearDireccion = (empleado: Empleado) => {
    if (!empleado.calle || !empleado.numero) {
      return "Sin dirección"
    }

    let direccion = `${empleado.calle} ${empleado.numero}`

    if (empleado.piso || empleado.dpto) {
      const detalles = []
      if (empleado.piso) detalles.push(`Piso ${empleado.piso}`)
      if (empleado.dpto) detalles.push(`Dpto ${empleado.dpto}`)
      direccion += `, ${detalles.join(", ")}`
    }

    direccion += `, ${empleado.departamentoNombre}`

    return direccion
  }

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "ADMINISTRADOR":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "COCINERO":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "REPARTIDOR":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CAJERO":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleExportarExcel = async () => {
    try {
      setExportLoading(true)
      await exportarEmpleadosAExcel(empleados)
    } catch (error) {
      console.error("Error al exportar:", error)
      alert("Error al exportar el archivo Excel")
    } finally {
      setExportLoading(false)
    }
  }

  if (empleados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay empleados</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se encontraron empleados que coincidan con los filtros aplicados.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header con botón de exportar */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Lista de Empleados</h3>
            <p className="text-sm text-gray-500">
              {empleados.length} empleado{empleados.length !== 1 ? "s" : ""} encontrado
              {empleados.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleExportarExcel}
            disabled={exportLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {exportLoading ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Exportando...
              </>
            ) : (
              <>
                <Download className="-ml-1 mr-2 h-4 w-4" />
                Exportar Excel
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {empleados.map((empleado) => (
              <tr
                key={empleado.id}
                className={`transition-colors hover:bg-gray-50 ${
                  empleado.activo ? "bg-green-50 bg-opacity-30" : "bg-red-50 bg-opacity-30"
                }`}
              >
                {/* Nombre y Apellido */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {empleado.nombre} {empleado.apellido}
                  </div>
                </td>

                {/* Contacto */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>{empleado.telefono}</div>
                    <div className="text-gray-500">{empleado.email}</div>
                  </div>
                </td>

                {/* Dirección */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">{formatearDireccion(empleado)}</div>
                </td>

                {/* Rol */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRolColor(empleado.rol)}`}
                  >
                    {empleado.rol}
                  </span>
                </td>

                {/* Estado */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                      empleado.activo
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {empleado.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Botón Editar */}
                    <button
                      onClick={() => onEditar(empleado.id)}
                      className="text-orange-600 hover:text-orange-900 p-1 rounded-md hover:bg-orange-50 transition-colors"
                      title="Editar empleado"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Botón Toggle Estado */}
                    <button
                      onClick={() => onToggleEstado(empleado.id)}
                      disabled={actionLoading === empleado.id}
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-md
                        text-gray-500
                        transition-colors
                        hover:bg-gray-100
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${empleado.activo ? "hover:text-green-600" : "hover:text-red-600"}
                      `}
                    >
                      {actionLoading === empleado.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
                      ) : empleado.activo ? (
                        <ToggleRight size={16} />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
