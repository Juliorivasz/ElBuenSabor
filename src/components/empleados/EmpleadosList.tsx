"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Rol } from "../../models/enum/Rol"
import { empleadoServicio, type Empleado } from "../../services/empleadoServicio"

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const navigate = useNavigate()

  const [filtroNombre, setFiltroNombre] = useState("")
  const [filtroRol, setFiltroRol] = useState<Rol | "">("")

  const cargarEmpleados = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await empleadoServicio.obtenerEmpleados()
      console.log("Empleados cargados:", data)
      setEmpleados(data)
    } catch (err) {
      setError("Error al cargar los empleados")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEstado = async (id: number) => {
    try {
      setActionLoading(id)
      setError(null)

      console.log("Cambiando estado del empleado ID:", id)
      await empleadoServicio.toggleAltaBaja(id)

      // Recargar automáticamente la lista completa desde el backend
      await cargarEmpleados()
    } catch (err) {
      setError("Error al cambiar el estado del empleado")
      console.error("Error:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditar = (id: number) => {
    navigate(`/admin/empleados/editar/${id}`)
  }

  const empleadosFiltrados = empleados.filter((empleado) => {
    const coincideNombre =
      filtroNombre === "" ||
      `${empleado.nombre} ${empleado.apellido}`.toLowerCase().includes(filtroNombre.toLowerCase())

    const coincideRol = filtroRol === "" || empleado.rol === filtroRol

    return coincideNombre && coincideRol
  })

  // Función para recargar empleados (será llamada desde otras páginas)
  const recargarEmpleados = () => {
    cargarEmpleados()
  }

  // Exponer la función de recarga globalmente
  useEffect(() => {
    // @ts-ignore
    window.recargarEmpleados = recargarEmpleados
    return () => {
      // @ts-ignore
      delete window.recargarEmpleados
    }
  }, [])

  useEffect(() => {
    cargarEmpleados()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <span className="ml-2 text-gray-600">Cargando empleados...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={cargarEmpleados}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  ;<div className="mb-6 bg-white p-4 rounded-lg shadow">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Filtro por nombre */}
      <div>
        <label htmlFor="filtro-nombre" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar por nombre
        </label>
        <input
          id="filtro-nombre"
          type="text"
          placeholder="Ingrese nombre o apellido..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Filtro por rol */}
      <div>
        <label htmlFor="filtro-rol" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por rol
        </label>
        <select
          id="filtro-rol"
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value as Rol | "")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Todos los roles</option>
          <option value={Rol.ADMINISTRADOR}>Administrador</option>
          <option value={Rol.COCINERO}>Cocinero</option>
          <option value={Rol.REPARTIDOR}>Repartidor</option>
          <option value={Rol.CAJERO}>Cajero</option>
        </select>
      </div>
    </div>

    {/* Mostrar resultados */}
    <div className="mt-3 text-sm text-gray-600">
      Mostrando {empleadosFiltrados.length} de {empleados.length} empleados
    </div>
  </div>

  if (empleadosFiltrados.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay empleados</h3>
        <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo empleado al sistema.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
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
        <tbody className="bg-white divide-y divide-gray-200">
          {empleadosFiltrados.map((empleado) => (
            <tr
              key={empleado.id}
              className={`hover:bg-gray-50 transition-colors ${!empleado.activo ? "opacity-60 bg-gray-50" : ""}`}
            >
              {/* Columna Empleado */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {empleado.nombre} {empleado.apellido}
                  </div>
                  <div className="text-sm text-gray-500">{empleado.email}</div>
                </div>
              </td>

              {/* Columna Contacto */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{empleado.telefono}</div>
              </td>

              {/* Columna Dirección - Usando campos directos del empleado */}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {empleado.calle && empleado.numero ? (
                    <div className="space-y-1">
                      {/* Línea 1: Calle y Número */}
                      <div className="font-medium">
                        {empleado.calle} {empleado.numero}
                      </div>

                      {/* Línea 2: Piso y/o Departamento (si existen) */}
                      {(empleado.piso || empleado.dpto) && (
                        <div className="text-gray-600 text-xs">
                          {empleado.piso && `Piso ${empleado.piso}`}
                          {empleado.piso && empleado.dpto && " - "}
                          {empleado.dpto && `Dpto ${empleado.dpto}`}
                        </div>
                      )}

                      {/* Línea 3: Departamento */}
                      <div className="text-gray-500 text-xs">{empleado.departamentoNombre}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">Sin dirección</span>
                  )}
                </div>
              </td>

              {/* Columna Rol */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                  {empleado.rol}
                </span>
              </td>

              {/* Columna Estado */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    empleado.activo
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {empleado.activo ? "Activo" : "Inactivo"}
                </span>
              </td>

              {/* Columna Acciones */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEditar(empleado.id)}
                  className="text-orange-600 hover:text-orange-900 font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleEstado(empleado.id)}
                  disabled={actionLoading === empleado.id}
                  className={`font-medium transition-colors ${
                    empleado.activo ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {actionLoading === empleado.id ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                      Procesando...
                    </span>
                  ) : empleado.activo ? (
                    "Desactivar"
                  ) : (
                    "Activar"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmpleadosList
