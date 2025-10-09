"use client"

import * as React from "react"
import { Group } from "@mui/icons-material"
import { Download } from "lucide-react"
import { ClientesTable } from "../../../components/Admin/clientes/ClientesTable"
import { ClientesFilters } from "../../../components/Admin/clientes/ClientesFilters"
import { ClienteGestionServicio } from "../../../services/clienteGestionServicio"
import { NotificationService } from "../../../utils/notifications"
import { exportarClientesAExcel } from "../../../utils/exportUtils"
import type { PageResponse } from "../../../models/PageResponse"
import type { ClienteGestion } from "../../../models/ClienteGestion"

export function Clientes() {
  const [clientesData, setClientesData] = React.useState<PageResponse<ClienteGestion> | null>(null)
  const [clientesFiltrados, setClientesFiltrados] = React.useState<ClienteGestion[]>([])
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [exportando, setExportando] = React.useState(false)

  React.useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await ClienteGestionServicio.getClientesPaginados(currentPage, pageSize)
        setClientesData(data)
        setClientesFiltrados(data.content)
      } catch (err) {
        console.error("Failed to fetch clients:", err)
        setError("Error al cargar los clientes. Intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [currentPage, pageSize])

  const handleFiltrar = React.useCallback((clientesFiltrados: ClienteGestion[]) => {
    setClientesFiltrados(clientesFiltrados)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0) // Reset to first page when page size changes
  }

  const exportarClientes = async () => {
    try {
      setExportando(true)

      // Fetch all clients for export (without pagination)
      const todosLosClientes = await ClienteGestionServicio.obtenerTodosLosClientes()

      if (todosLosClientes.length === 0) {
        await NotificationService.warning("Sin datos", "No hay clientes para exportar")
        return
      }

      const nombreArchivo = exportarClientesAExcel(todosLosClientes)
      await NotificationService.success(
        "¡Exportación exitosa!",
        `El archivo ${nombreArchivo} se ha descargado correctamente.`,
      )
    } catch (error) {
      console.error("Error al exportar clientes:", error)
      await NotificationService.error("Error", "No se pudo exportar el archivo")
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div>
        <div className="flex items-center mb-1">
          <Group className="text-black mr-3" fontSize="large" />
          <h1 className="text-3xl font-bold text-gray-800">Estadísticas del negocio</h1>
        </div>
        <p className="text-gray-600">Gestiona tus clientes de manera eficiente</p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={exportarClientes}
          disabled={exportando || !clientesData || clientesData.page.totalElements === 0}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {!loading && !error && clientesData && (
        <div className="mt-6">
          <ClientesFilters
            clientes={clientesData.content}
            onFiltrar={handleFiltrar}
            totalClientes={clientesData.page.totalElements}
          />
        </div>
      )}

      <div className="mt-6">
        {loading && <div>Cargando clientes...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && clientesData && (
          <ClientesTable
            data={{
              ...clientesData,
              content: clientesFiltrados,
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  )
}
