"use client"

import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import { Pagination } from "../Admin/products/Pagination"
import type { InsumoAbmDto } from "../../models/dto/InsumoAbmDto"

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface InsumosTableProps {
  insumos: InsumoAbmDto[]
  loading: boolean
  pagination: PaginationState
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  onEdit: (insumo: InsumoAbmDto) => void
  onViewDetails: (insumo: InsumoAbmDto) => void
  onToggleStatus: (insumo: InsumoAbmDto) => void
  onRefresh?: () => void
}

export function InsumosTable({
  insumos,
  loading,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onViewDetails,
  onToggleStatus,
  onRefresh,
}: InsumosTableProps) {
  // Validar que insumos sea un array
  const validInsumos = Array.isArray(insumos) ? insumos : []

  const getStockLevelStatus = (insumo: InsumoAbmDto) => {
    const percentage = insumo.getStockPercentage()
    if (percentage <= 25) {
      return { text: "Crítico", color: "bg-red-100 text-red-800" }
    }
    if (percentage <= 50) {
      return { text: "Bajo", color: "bg-orange-100 text-orange-800" }
    }
    if (percentage <= 75) {
      return { text: "Normal", color: "bg-yellow-100 text-yellow-800" }
    }
    return { text: "Óptimo", color: "bg-green-100 text-green-800" }
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

  if (validInsumos.length === 0) {
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay insumos registrados</h3>
          <p className="mt-1 text-sm text-gray-500">Agrega tu primer insumo para comenzar</p>
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
            <h3 className="text-lg font-medium text-gray-900">Insumos</h3>
            <div className="text-sm text-gray-500">
              {pagination.totalItems} insumo{pagination.totalItems !== 1 ? "s" : ""} total
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rubro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad de Medida
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validInsumos.map((insumo) => {
                const stockLevel = getStockLevelStatus(insumo)
                return (
                  <tr key={insumo.getIdArticuloInsumo()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {insumo.getNombre()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">${insumo.getCosto().toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block max-w-[120px] truncate align-middle px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {insumo.getNombreRubro()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="font-medium">{insumo.getStockActual()}</span>                        
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockLevel.color}`}
                      >
                        {stockLevel.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{insumo.getUnidadDeMedida()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewDetails(insumo)}
                          className="text-gray-700 hover:cursor-pointer p-1 rounded-full hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => onEdit(insumo)}
                          className="text-gray-700 hover:cursor-pointer p-1 rounded-full hover:bg-indigo-50"
                          title="Editar"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(insumo)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            insumo.isDadoDeAlta()
                              ? "bg-green-500 focus:ring-green-500"
                              : "bg-red-400 focus:ring-red-400"
                          }`}
                          title={insumo.isDadoDeAlta() ? "Desactivar" : "Activar"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              insumo.isDadoDeAlta() ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
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
    </>
  )
}
