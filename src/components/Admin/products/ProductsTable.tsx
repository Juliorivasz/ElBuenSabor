"use client"

import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useState } from "react"
import { Pagination } from "./Pagination"
import { interceptorsApiClient } from "../../../services/interceptors/axios.interceptors"
import { NotificationService } from "../../../utils/notifications"

// Interfaz base para productos
interface BaseProduct {
  getIdArticulo?: () => number
  getidArticulo?: () => number
  getNombre: () => string
  getDescripcion?: () => string
  getPrecioVenta: () => number
  isDadoDeAlta: () => boolean
  getImagenUrl?: () => string | null
  getNombreCategoria?: () => string
  getPrecioModificado?: () => boolean
}

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface ProductsTableProps<T extends BaseProduct> {
  products: T[]
  loading: boolean
  pagination: PaginationState
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  onEdit: (product: T) => void
  onViewDetails: (product: T) => void
  onToggleStatus: (product: T) => void
  onRefresh?: () => void
  title?: string
  emptyMessage?: string
  emptyDescription?: string
}

export function ProductsTable<T extends BaseProduct>({
  products,
  loading,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onViewDetails,
  onToggleStatus,
  onRefresh,
  title = "Productos",
  emptyMessage = "No hay productos registrados",
  emptyDescription = "Agrega tu primer producto para comenzar",
}: ProductsTableProps<T>) {
  const [showUpdatePricesModal, setShowUpdatePricesModal] = useState(false)
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false)

  // Función helper para obtener el ID del producto
  const getProductId = (product: T): number => {
    return product.getIdArticulo?.() ?? product.getidArticulo?.() ?? 0
  }

  // Validar que products sea un array
  const validProducts = Array.isArray(products) ? products : []

  const handleUpdatePrices = async () => {
    setIsUpdatingPrices(true)
    try {
      await interceptorsApiClient.put("/articulo/actualizarPrecios")

      // Mostrar mensaje de éxito
      NotificationService.success("Los precios fueron actualizados de manera exitosa")

      // Refrescar la tabla si se proporciona la función
      if (onRefresh) {
        onRefresh()
      }
      setShowUpdatePricesModal(false)
    } catch (error) {
      console.error("Error al actualizar precios:", error)
      // Mostrar mensaje de error
      NotificationService.error("Error al actualizar los precios. Por favor, inténtelo de nuevo.")
    } finally {
      setIsUpdatingPrices(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (validProducts.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header con información de resultados */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="text-sm text-gray-500">
              {pagination.totalItems} producto{pagination.totalItems !== 1 ? "s" : ""} total
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validProducts.map((product) => (
                <tr key={getProductId(product)} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            (product.getImagenUrl ? product.getImagenUrl() : null) ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={product.getNombre()}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                          {product.getNombre()}
                        </div>
                        {product.getDescripcion && (
                          <div className="text-sm text-gray-500 truncate max-w-[250px]">{product.getDescripcion()}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.getNombreCategoria && (
                      <span className="inline-block max-w-[100px] truncate align-middle px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.getNombreCategoria()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">${product.getPrecioVenta().toFixed(2)}</span>
                      {product.getPrecioModificado?.() && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Modificado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(product as any).getStock ? (product as any).getStock() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isDadoDeAlta() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isDadoDeAlta() ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(product)}
                        className="text-gray-700 hover:cursor-pointer p-1 rounded-full hover:bg-blue-50"
                        title="Ver detalles"
                      >
                        <VisibilityIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="text-gray-700 hover:cursor-pointer p-1 rounded-full hover:bg-indigo-50"
                        title="Editar"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(product)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          product.isDadoDeAlta() ? "bg-green-500 focus:ring-green-500" : "bg-red-400 focus:ring-red-400"
                        }`}
                        title={product.isDadoDeAlta() ? "Desactivar" : "Activar"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.isDadoDeAlta() ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>

      {/* Sección del botón Actualizar precios */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-center">
          <button
            onClick={() => setShowUpdatePricesModal(true)}
            disabled={isUpdatingPrices}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdatingPrices ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Actualizando...
              </>
            ) : (
              <>
                <RefreshIcon className="mr-2" fontSize="small" />
                Actualizar precios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showUpdatePricesModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <RefreshIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Actualizar precios</h3>
                <div className="mt-4 px-2 py-3">
                  <p className="text-sm text-gray-500 text-left">
                    Al confirmar esta acción, se calcularán nuevamente los precios de venta de todos los productos en
                    base a su costo total y al margen de ganancia de la categoría correspondiente. Por lo tanto, los
                    precios que fueron establecidos manualmente puede que sean modificados.
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">¿Desea continuar?</p>
                  </div>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowUpdatePricesModal(false)}
                      disabled={isUpdatingPrices}
                      className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpdatePrices}
                      disabled={isUpdatingPrices}
                      className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
                    >
                      {isUpdatingPrices ? "Actualizando..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
