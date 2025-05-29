"use client"

import React from "react"
import type { ArticuloManufacturado } from "../../../models/ArticuloManufacturado"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import BlockIcon from "@mui/icons-material/Block"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { Pagination } from "./Pagination"

interface ProductsTableProps {
  products: ArticuloManufacturado[]
  onEdit: (product: ArticuloManufacturado) => void
  onDelete: (product: ArticuloManufacturado) => void
  onViewDetails: (product: ArticuloManufacturado) => void
  onToggleStatus: (product: ArticuloManufacturado) => void
  loading: boolean
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleStatus,
  loading,
}) => {
  // Estados para la paginación
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  // Calcular productos paginados
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return products.slice(startIndex, endIndex)
  }, [products, currentPage, itemsPerPage])

  // Calcular información de paginación
  const totalPages = Math.ceil(products.length / itemsPerPage)

  // Handlers para la paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    // Ajustar la página actual si es necesario
    const newTotalPages = Math.ceil(products.length / newItemsPerPage)
    if (currentPage > newTotalPages) {
      setCurrentPage(1)
    }
  }

  // Resetear página cuando cambian los productos
  React.useEffect(() => {
    setCurrentPage(1)
  }, [products.length])

  // Función auxiliar para obtener el estado del producto
  const getProductStatus = (product: ArticuloManufacturado): boolean => {
    return (product as any).esParaElaborar ?? true
  }

  // Función auxiliar para obtener el nombre de la categoría
  const getCategoryName = (product: ArticuloManufacturado): string => {
    try {
      const categoria = product.getCategoria()
      if (!categoria) return "Sin categoría"
      return categoria.getcategoriaNombre()
    } catch (error) {
      console.warn("Error obteniendo nombre de categoría:", error)
      return "Sin categoría"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No hay productos manufacturados registrados</div>
          <p className="text-gray-400 mt-2">Agrega tu primer producto para comenzar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header con información de resultados */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Productos Manufacturados</h3>
          <div className="text-sm text-gray-500">
            {products.length} producto{products.length !== 1 ? "s" : ""} total{products.length !== 1 ? "es" : ""}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((product) => {
              const isActive = getProductStatus(product)
              const categoryName = getCategoryName(product)

              return (
                <tr key={product.getIdArticulo()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.getUrlImagen() && (
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.getUrlImagen() || "/placeholder.svg"}
                            alt={product.getNombre()}
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                            }}
                          />
                        </div>
                      )}
                      <div className={product.getUrlImagen() ? "ml-4" : ""}>
                        <div className="text-sm font-medium text-gray-900">{product.getNombre()}</div>
                        <div className="text-sm text-gray-500">{categoryName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{product.getDescripcion()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${product.getPrecioVenta().toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* Ver detalles */}
                      <button
                        onClick={() => onViewDetails(product)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                        title="Ver detalles"
                      >
                        <VisibilityIcon fontSize="small" />
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => onEdit(product)}
                        className="text-orange-600 hover:text-orange-900 p-2 rounded-md hover:bg-orange-50 transition-colors"
                        title="Editar"
                      >
                        <EditIcon fontSize="small" />
                      </button>

                      {/* Toggle estado */}
                      <button
                        onClick={() => onToggleStatus(product)}
                        className={`p-2 rounded-md transition-colors ${
                          isActive
                            ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                            : "text-green-600 hover:text-green-900 hover:bg-green-50"
                        }`}
                        title={isActive ? "Dar de baja" : "Dar de alta"}
                      >
                        {isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={products.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={[5, 10, 25, 50]}
      />
    </div>
  )
}
