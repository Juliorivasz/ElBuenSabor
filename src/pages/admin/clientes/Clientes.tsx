"use client"

import * as React from "react"
import { Group } from "@mui/icons-material"
import { ClientesTable } from "../../../components/Admin/clientes/ClientesTable"
import { ClienteGestionServicio } from "../../../services/clienteGestionServicio"
import type { PageResponse } from "../../../models/PageResponse"
import type { ClienteGestion } from "../../../models/ClienteGestion"


export function Clientes() {
  const [clientesData, setClientesData] = React.useState<PageResponse<ClienteGestion> | null>(null)
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await ClienteGestionServicio.getClientesPaginados(currentPage, pageSize)
        setClientesData(data)
      } catch (err) {
        console.error("Failed to fetch clients:", err)
        setError("Error al cargar los clientes. Intente de nuevo más tarde.")
        // toast({
        //   title: "Error",
        //   description: "No se pudieron cargar los clientes.",
        //   variant: "destructive",
        // })
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

  return (
    <div className="p-4 sm:p-6">

      <div>
        <div className="flex items-center mb-1">
          <Group className="text-black mr-3" fontSize="large" />
          <h1 className="text-3xl font-bold text-gray-800">Estadísticas del negocio</h1>
        </div>
        <p className="text-gray-600">Gestiona tus clientes de manera eficiente</p>
      </div>

      <div className="mt-6">
        {loading && <div>Cargando clientes...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && clientesData && (
          <ClientesTable data={clientesData} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
        )}
      </div>
    </div>
  )
}
