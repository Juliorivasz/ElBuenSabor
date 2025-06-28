"use client"

import ClearIcon from "@mui/icons-material/Clear"
import SearchIcon from "@mui/icons-material/Search"
import { useEffect, useState } from "react"

interface CategoriasFiltersProps {
  totalCategorias: number
  categoriasActivas: number
  categoriasInactivas: number
  categoriasPadre: number
  subcategorias: number
  filtroActual: "todas" | "activas" | "inactivas" | "padre" | "subcategorias"
  onFiltroChange: (filtro: "todas" | "activas" | "inactivas" | "padre" | "subcategorias") => void
  busqueda: string
  onBusquedaChange: (busqueda: string) => void
}

export const CategoriasFilters = ({
  totalCategorias,
  categoriasActivas,
  categoriasInactivas,
  categoriasPadre,
  subcategorias,
  filtroActual,
  onFiltroChange,
  busqueda,
  onBusquedaChange,
}: CategoriasFiltersProps) => {
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

  const tabs = [
    {
      key: "todas" as const,
      label: "Todas",
      count: totalCategorias,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Vista jerárquica con subcategorías desplegables",
    },
    {
      key: "activas" as const,
      label: "Activas",
      count: categoriasActivas,
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Solo categorías activas",
    },
    {
      key: "inactivas" as const,
      label: "Inactivas",
      count: categoriasInactivas,
      color: "bg-red-100 text-red-800 border-red-200",
      description: "Solo categorías inactivas",
    },
    {
      key: "padre" as const,
      label: "Principales",
      count: categoriasPadre,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: "Solo categorías principales",
    },
    {
      key: "subcategorias" as const,
      label: "Subcategorías",
      count: subcategorias,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      description: "Solo subcategorías",
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
              placeholder="Buscar categorías en tiempo real..."
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

        {/* Tabs de filtros */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFiltroChange(tab.key)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                filtroActual === tab.key ? tab.color : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
              title={tab.description}
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
      {(searchTerm || filtroActual !== "todas") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {searchTerm && `Resultados para "${searchTerm}"`}
              {searchTerm && filtroActual !== "todas" && " • "}
              {filtroActual !== "todas" && `Filtro: ${tabs.find((t) => t.key === filtroActual)?.label}`}
            </span>
            <button
              onClick={() => {
                setSearchTerm("")
                onBusquedaChange("")
                onFiltroChange("todas")
              }}
              className="text-orange-600 hover:text-orange-800 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Información sobre el modo de vista */}
      {filtroActual === "todas" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-blue-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Vista jerárquica: Haz clic en los botones de expansión para ver las subcategorías</span>
          </div>
        </div>
      )}
    </div>
  )
}
