import { Group } from "@mui/icons-material"
import { Download } from "lucide-react"
import { ClientesTable } from "../../../components/Admin/clientes/ClientesTable"
import { ClienteGestionServicio } from "../../../services/clienteGestionServicio"
import { exportarClientesAExcel } from "../../../utils/exportUtils"
import { ClientesFilters } from "../../../components/Admin/clientes/ClientesFilters"
import type { PageResponse } from "../../../models/PageResponse"
import type { ClienteGestion } from "../../../models/ClienteGestion"

export function Clientes() {
  const [clientesData, setClientesData] = React.useState<PageResponse<ClienteGestion> | null>(null)
  const [clientesFiltrados, setClientesFiltrados] = React.useState<ClienteGestion[]>([])
  const [todosLosClientes, setTodosLosClientes] = React.useState<ClienteGestion[]>([])
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [clientesFiltrados, setClientesFiltrados] = React.useState<ClienteGestion[]>([])

  React.useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await ClienteGestionServicio.getClientesPaginados(currentPage, pageSize)
        setClientesData(data)
        setClientesFiltrados(data.content)
        setTodosLosClientes(data.content)
      } catch (err) {
        console.error("Failed to fetch clients:", err)
        setError("Error al cargar los clientes. Intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [currentPage, pageSize])

  const handleExportarExcel = () => {
    try {
      const nombreArchivo = exportarClientesAExcel(clientesFiltrados)
      console.log(`Archivo exportado: ${nombreArchivo}`)
    } catch (error) {
      console.error("Error al exportar a Excel:", error)
    }
  }

  const handleFiltrar = (clientesFiltradosNuevos: ClienteGestion[]) => {
    setClientesFiltrados(clientesFiltradosNuevos)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0) // Reset to first page when page size changes
  }

  const handleFiltrar = React.useCallback((clientes: ClienteGestion[]) => {
    setClientesFiltrados(clientes)
  }, [])

  const filteredClientesData = React.useMemo(() => {
    if (!clientesData) return null

    return {
      ...clientesData,
      content: clientesFiltrados,
      totalElements: clientesFiltrados.length,
      totalPages: Math.ceil(clientesFiltrados.length / pageSize),
    }
  }, [clientesData, clientesFiltrados, pageSize])

  return (
    <div className="p-4 sm:p-6">
      <div>
        <div className="flex items-center mb-1">
          <Group className="text-black mr-3" fontSize="large" />
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
        </div>
        <p className="text-gray-600">Gestiona tus clientes de manera eficiente</p>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleExportarExcel}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar a Excel
        </button>
      </div>

      {!loading && !error && todosLosClientes.length > 0 && (
        <div className="mb-6">
          <ClientesFilters clientes={todosLosClientes} onFiltrar={handleFiltrar} />
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
