"use client"

import ClearIcon from "@mui/icons-material/Clear"
import SearchIcon from "@mui/icons-material/Search"
import { useEffect, useState } from "react"
import type { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto"

interface InsumosFiltersProps {
  totalInsumos: number
  insumosActivos: number
  insumosInactivos: number
  rubrosInsumo: RubroInsumoAbmDto[]
  filtroActual: "todos" | "activos" | "inactivos"
  rubroSeleccionado: number
  onFiltroChange: (filtro: "todos" | "activos" | "inactivos") => void
  onRubroChange: (rubroId: number) => void
  busqueda: string
  onBusquedaChange: (busqueda: string) => void
}

export const InsumosFilters = ({
  totalInsumos,
  insumosActivos,
  insumosInactivos,
  rubrosInsumo,
  filtroActual,
  rubroSeleccionado,
  onFiltroChange,
  onRubroChange,
  busqueda,
  onBusquedaChange,
}: InsumosFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(busqueda)

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onBusquedaChange(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, onBusquedaChange])

  const handleClearSearch = () => {
    setSearchTerm("")
    onBusquedaChange("")
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    onBusquedaChange("")
    onFiltroChange("todos")
    onRubroChange(0)
  }

  const tabs = [
    {
      key: "todos" as const,
      label: "Todos",
      count: totalInsumos,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      key: "activos" as const,
      label: "Activos",
      count: insumosActivos,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      key: "inactivos" as const,
      label: "Inactivos",
      count: insumosInactivos,
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ]

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Búsqueda en tiempo real */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Buscar insumos por nombre..."
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                  <ClearIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          {searchTerm && <p className="text-sm text-gray-500 mt-1">Buscando: "{searchTerm}"</p>}
        </div>

        {/* Filtro por rubro */}
        <div className="flex-shrink-0">
          <select
            value={rubroSeleccionado}
            onChange={(e) => onRubroChange(Number(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          >
            <option value={0}>Todos los rubros</option>
            {rubrosInsumo.map((rubro) => (
              <option key={rubro.getIdRubroInsumo()} value={rubro.getIdRubroInsumo()}>
                {rubro.getNombre()}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs de filtros */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFiltroChange(tab.key)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                filtroActual === tab.key ? tab.color : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  filtroActual === tab.key ? "bg-white bg-opacity-50" : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      {(searchTerm || filtroActual !== "todos" || rubroSeleccionado !== 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {searchTerm && `Resultados para "${searchTerm}"`}
              {searchTerm && (filtroActual !== "todos" || rubroSeleccionado !== 0) && " • "}
              {filtroActual !== "todos" && `Estado: ${tabs.find((t) => t.key === filtroActual)?.label}`}
              {filtroActual !== "todos" && rubroSeleccionado !== 0 && " • "}
              {rubroSeleccionado !== 0 &&
                `Rubro: ${rubrosInsumo.find((r) => r.getIdRubroInsumo() === rubroSeleccionado)?.getNombre()}`}
            </span>
            <button onClick={handleClearFilters} className="text-orange-600 hover:text-orange-800 font-medium">
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
