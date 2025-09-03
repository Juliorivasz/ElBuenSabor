import { Group } from "@mui/icons-material"
import * as React from "react"
import { ClientesFilters } from "../../../components/Admin/clientes/ClientesFilters"
import { ClientesTable } from "../../../components/Admin/clientes/ClientesTable"
import type { ClienteGestion } from "../../../models/ClienteGestion"
import type { PageResponse } from "../../../models/PageResponse"
import { ClienteGestionServicio } from "../../../services/clienteGestionServicio"

export function Clientes() {
  const [clientesData, setClientesData] = React.useState<PageResponse<ClienteGestion> | null>(null)
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
        if (data) {
          setClientesFiltrados(data.content)
        }
      } catch (err) {
        console.error("Failed to fetch clients:", err)
        setError("Error al cargar los clientes. Intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [currentPage, pageSize])

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

      {!loading && !error && clientesData && (
        <div className="mt-6">
          <ClientesFilters clientes={clientesData.content} onFiltrar={handleFiltrar} />
        </div>
      )}

      <div className="mt-6">
        {loading && <div>Cargando clientes...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && filteredClientesData && (
          <ClientesTable
            data={filteredClientesData}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  )
}
