"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Download } from "lucide-react"
import { PageHeader } from "../../../components/shared/PageHeader"
import { EmpleadosFilters } from "../../../components/empleados/EmpleadosFilters"
import { EmpleadosTable } from "../../../components/empleados/EmpleadosTable"
import { Pagination } from "../../../components/Admin/products/Pagination"
import type { EmpleadoResponseDto } from "../../../models/dto/Empleado/EmpleadoResponseDto"
import { empleadoServicio } from "../../../services/empleadoServicio"
import { NotificationService } from "../../../utils/notifications"
import { exportarEmpleadosAExcel } from "../../../utils/exportUtils"
import { PeopleAlt as PeopleIcon } from "@mui/icons-material"

export const Employees: React.FC = () => {
  const navigate = useNavigate()
  const [empleados, setEmpleados] = useState<EmpleadoResponseDto[]>([])
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState<EmpleadoResponseDto[]>([])
  const [cargando, setCargando] = useState(true)
  const [exportando, setExportando] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Cargar empleados al montar el componente y cuando cambie la paginación
  useEffect(() => {
    cargarEmpleados()
  }, [currentPage, itemsPerPage])

  const cargarEmpleados = async () => {
    try {
      setCargando(true)
      // Backend uses 0-based page indexing
      const response = await empleadoServicio.obtenerEmpleadosPaginados(currentPage - 1, itemsPerPage)

      setEmpleados(response.content)
      setEmpleadosFiltrados(response.content)
      setTotalPages(response.page.totalPages)
      setTotalItems(response.page.totalElements)
    } catch (error) {
      console.error("Error al cargar empleados:", error)
      await NotificationService.error("Error", "No se pudieron cargar los empleados")
    } finally {
      setCargando(false)
    }
  }

  const manejarFiltrar = useCallback((empleadosFiltrados: EmpleadoResponseDto[]) => {
    setEmpleadosFiltrados(empleadosFiltrados)
  }, [])

  const manejarEmpleadoEditado = () => {
    cargarEmpleados() // Recargar la lista después de editar
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const navegarANuevoEmpleado = () => {
    navigate("/admin/empleados/nuevo")
  }

  const exportarEmpleados = async () => {
    try {
      setExportando(true)

      // Fetch all employees for export (without pagination)
      const todosLosEmpleados = await empleadoServicio.obtenerTodosLosEmpleados()

      if (todosLosEmpleados.length === 0) {
        await NotificationService.warning("Sin datos", "No hay empleados para exportar")
        return
      }

      const nombreArchivo = exportarEmpleadosAExcel(todosLosEmpleados)
      await NotificationService.success(
        "¡Exportación exitosa!",
        `El archivo ${nombreArchivo} se ha descargado correctamente.`,
      )
    } catch (error) {
      console.error("Error al exportar empleados:", error)
      await NotificationService.error("Error", "No se pudo exportar el archivo")
    } finally {
      setExportando(false)
    }
  }

  if (cargando && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando empleados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navegación móvil */}
        <PageHeader
          title="Gestión de Empleados"
          subtitle="Administra los empleados del sistema"
          showBackButton={true}
          backTo="/admin/dashboard"
          icon={<PeopleIcon className="text-black mr-3" fontSize="large" />}
          breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Empleados" }]}
        />

        {/* Botones de acción - Mobile First */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div className="order-2 sm:order-1">
            <button
              onClick={navegarANuevoEmpleado}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </button>
          </div>

          <div className="order-1 sm:order-2">
            <button
              onClick={exportarEmpleados}
              disabled={exportando || totalItems === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exportando ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full mr-2" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Todos
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filtros */}
        <EmpleadosFilters empleados={empleados} onFiltrar={manejarFiltrar} totalEmpleados={totalItems} />

        {/* Tabla de empleados */}
        {cargando ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando empleados...</p>
            </div>
          </div>
        ) : (
          <>
            <EmpleadosTable empleados={empleadosFiltrados} onEmpleadoEditado={manejarEmpleadoEditado} />

            {totalItems > 0 && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
          </>
        )}

        {/* Información adicional - Solo desktop */}
        <div className="hidden lg:block">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Información</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Usa los filtros para encontrar empleados específicos en la página actual</li>
                    <li>Los empleados desactivados pueden ser reactivados en cualquier momento</li>
                    <li>La exportación incluye todos los empleados del sistema</li>
                    <li>Los cambios se reflejan inmediatamente en el sistema</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
