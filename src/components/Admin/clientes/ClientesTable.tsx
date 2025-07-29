import type { ClienteGestion } from "../../../models/ClienteGestion"
import type { PageResponse } from "../../../models/PageResponse"
import { Pagination } from "../../../components/Admin/products/Pagination" // Reusing existing Pagination component

interface ClientesTableProps {
  data: PageResponse<ClienteGestion> | null
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function ClientesTable({ data, onPageChange, onPageSizeChange }: ClientesTableProps) {
  if (!data) {
    return <div>Cargando clientes...</div>
  }

  const { content, number, size, totalPages, totalElements } = data;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre y Apellido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de Pedidos</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.length ? (
              content.map((cliente) => (
                <tr key={cliente.idUsuario}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.idUsuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.nombreYApellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.telefono}</td>
                  <td className="pl-20 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {cliente.cantidadPedidos}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No hay clientes para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={number}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalElements}     // <--- Aquí va la cantidad total, no el size
        itemsPerPage={size}             // <--- Este es el tamaño real de página
        onItemsPerPageChange={onPageSizeChange}
      />
    </div>
  )
}
