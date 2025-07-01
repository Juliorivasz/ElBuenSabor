"use client"

import { Add } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pagination } from "../../../components/Admin/products/Pagination"
import { EmpleadosFilters } from "../../../components/empleados/EmpleadosFilters"
import { EmpleadosTable } from "../../../components/empleados/EmpleadosTable"
import { empleadoServicio, type Empleado } from "../../../services/empleadoServicio"

export const Employees = () => {
  const navigate = useNavigate()

  // Estados principales
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // Estados de filtros
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activos" | "inactivos">("todos")
  const [busqueda, setBusqueda] = useState("")

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Cargar empleados
  const cargarEmpleados = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await empleadoServicio.obtenerEmpleados()
      setEmpleados(data)
    } catch (err) {
      setError("Error al cargar los empleados")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar empleados
  const empleadosFiltrados = empleados.filter((empleado) => {
    // Filtro por estado
    let pasaFiltroEstado = true
    if (filtroEstado === "activos") {
      pasaFiltroEstado = empleado.activo
    } else if (filtroEstado === "inactivos") {
      pasaFiltroEstado = !empleado.activo
    }

    // Filtro por búsqueda
    const pasaFiltroBusqueda =
      busqueda === "" || `${empleado.nombre} ${empleado.apellido}`.toLowerCase().includes(busqueda.toLowerCase())

    return pasaFiltroEstado && pasaFiltroBusqueda
  })

  // Paginación
  const totalItems = empleadosFiltrados.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const empleadosPaginados = empleadosFiltrados.slice(startIndex, endIndex)

  // Estadísticas
  const totalEmpleados = empleados.length
  const empleadosActivos = empleados.filter((emp) => emp.activo).length
  const empleadosInactivos = empleados.filter((emp) => !emp.activo).length

  // Handlers
  const handleToggleEstado = async (id: number) => {
    try {
      setActionLoading(id)
      setError(null)
      await empleadoServicio.toggleAltaBaja(id)
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  const handleFiltroChange = (filtro: "todos" | "activos" | "inactivos") => {
    setFiltroEstado(filtro)
    setCurrentPage(1)
  }

  const handleBusquedaChange = (busquedaValue: string) => {
    setBusqueda(busquedaValue)
    setCurrentPage(1)
  }

  // Efectos
  useEffect(() => {
    cargarEmpleados()
  }, [])

  // Reset página cuando cambian los filtros
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2 text-gray-600">Cargando empleados...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
              <p className="text-gray-600 mt-1">Administra los empleados del sistema</p>
            </div>
            <button
              onClick={() => navigate("/admin/empleados/nuevo")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium flex items-center gap-2"
            >
              <Add />
              Nuevo Empleado
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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
        )}

        {/* Filtros */}
        <EmpleadosFilters
          totalEmpleados={totalEmpleados}
          empleadosActivos={empleadosActivos}
          empleadosInactivos={empleadosInactivos}
          filtroActual={filtroEstado}
          onFiltroChange={handleFiltroChange}
          busqueda={busqueda}
          onBusquedaChange={handleBusquedaChange}
        />

        {/* Tabla */}
        <EmpleadosTable
          empleados={empleadosPaginados}
          onEditar={handleEditar}
          onToggleEstado={handleToggleEstado}
          actionLoading={actionLoading}
        />

        {/* Paginación */}
        {totalItems > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 25, 50]}
            />
          </div>
        )}
      </div>
    </div>
  )
}
