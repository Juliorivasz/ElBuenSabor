"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { useDebounce } from "../../hooks/useDebounce"

interface InsumosFiltersProps {
  searchTerm: string
  estadoFilter: boolean | null
  costoMinFilter: number | null
  costoMaxFilter: number | null
  onSearchChange: (term: string) => void
  onEstadoFilterChange: (estado: boolean | null) => void
  onCostoFilterChange: (min: number | null, max: number | null) => void
  onClearFilters: () => void
}

export const InsumosFilters: React.FC<InsumosFiltersProps> = ({
  searchTerm,
  estadoFilter,
  costoMinFilter,
  costoMaxFilter,
  onSearchChange,
  onEstadoFilterChange,
  onCostoFilterChange,
  onClearFilters,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [tempCostoMin, setTempCostoMin] = useState<string>(costoMinFilter?.toString() || "")
  const [tempCostoMax, setTempCostoMax] = useState<string>(costoMaxFilter?.toString() || "")

  // Debounce para la búsqueda por nombre
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500)

  // Efecto para aplicar la búsqueda con debounce
  useEffect(() => {
    onSearchChange(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearchChange])

  // Sincronizar el término de búsqueda local cuando se limpian los filtros
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  const handleCostoFilterApply = () => {
    const min = tempCostoMin ? Number.parseFloat(tempCostoMin) : null
    const max = tempCostoMax ? Number.parseFloat(tempCostoMax) : null
    onCostoFilterChange(min, max)
  }

  const hasActiveFilters = searchTerm || estadoFilter !== null || costoMinFilter !== null || costoMaxFilter !== null

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Búsqueda principal */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar insumos por nombre..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-900 sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors ${
              showAdvancedFilters
                ? "bg-orange-50 text-orange-700 border-orange-300"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-orange-100 bg-orange-600 rounded-full">
                !
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={estadoFilter === null ? "" : estadoFilter.toString()}
                onChange={(e) => {
                  const value = e.target.value
                  onEstadoFilterChange(value === "" ? null : value === "true")
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            {/* Filtro por rango de costo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Costo mínimo</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={tempCostoMin}
                onChange={(e) => setTempCostoMin(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Costo máximo</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="999.99"
                  value={tempCostoMax}
                  onChange={(e) => setTempCostoMax(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
                <button
                  onClick={handleCostoFilterApply}
                  className="px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
