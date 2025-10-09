"use client"

import ClearIcon from "@mui/icons-material/Clear"
import SearchIcon from "@mui/icons-material/Search"
import { useEffect, useState } from "react"
import type { CategoriaDTO } from "../../../models/dto/CategoriaDTO"

interface ProductsFiltersProps {
  totalProductos: number
  productosActivos: number
  productosInactivos: number
  categorias: CategoriaDTO[]
  filtroActual: "todos" | "activos" | "inactivos"
  categoriaSeleccionada: number
  precioMin: number
  precioMax: number
  onFiltroChange: (filtro: "todos" | "activos" | "inactivos") => void
  onCategoriaChange: (categoriaId: number) => void
  onPrecioChange: (min: number, max: number) => void
  busqueda: string
  onBusquedaChange: (busqueda: string) => void
}

export const ProductsFilters = ({
  totalProductos,
  productosActivos,
  productosInactivos,
  categorias,
  filtroActual,
  categoriaSeleccionada,
  precioMin,
  precioMax,
  onFiltroChange,
  onCategoriaChange,
  onPrecioChange,
  busqueda,
  onBusquedaChange,
}: ProductsFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(busqueda)
  const [localPrecioMin, setLocalPrecioMin] = useState(precioMin.toString())
  const [localPrecioMax, setLocalPrecioMax] = useState(precioMax.toString())

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onBusquedaChange(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, onBusquedaChange])

  // Aplicar filtro de precio con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const min = localPrecioMin === "" ? 0 : Number(localPrecioMin)
      const max = localPrecioMax === "" ? Number.MAX_SAFE_INTEGER : Number(localPrecioMax)
      onPrecioChange(min, max)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [localPrecioMin, localPrecioMax, onPrecioChange])

  const handleClearSearch = () => {
    setSearchTerm("")
    onBusquedaChange("")
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    onBusquedaChange("")
    onFiltroChange("todos")
    onCategoriaChange(0)
    setLocalPrecioMin("0")
    setLocalPrecioMax("")
    onPrecioChange(0, Number.MAX_SAFE_INTEGER)
  }

  const tabs = [
    {
      key: "todos" as const,
      label: "Todos",
      count: totalProductos,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      key: "activos" as const,
      label: "Activos",
      count: productosActivos,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      key: "inactivos" as const,
      label: "Inactivos",
      count: productosInactivos,
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ]

  // Filtrar solo categorías padre (sin idCategoriaPadre)
  const categoriasPadre = categorias.filter((cat) => !cat.getIdCategoriaPadre())

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col gap-4">
        {/* Primera fila: Búsqueda y Categoría */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
                placeholder="Buscar productos por nombre..."
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

          {/* Filtro por categoría */}
          <div className="flex-shrink-0">
            <select
              value={categoriaSeleccionada}
              onChange={(e) => onCategoriaChange(Number(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            >
              <option value={0}>Todas las categorías</option>
              {categoriasPadre.map((categoria) => (
                <option key={categoria.getIdCategoria()} value={categoria.getIdCategoria()}>
                  {categoria.getNombre()}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por rango de precio */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={localPrecioMin}
              onChange={(e) => setLocalPrecioMin(e.target.value)}
              placeholder="Precio mín"
              min="0"
              className="block w-28 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={localPrecioMax}
              onChange={(e) => setLocalPrecioMax(e.target.value)}
              placeholder="Precio máx"
              min="0"
              className="block w-28 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Segunda fila: Tabs de filtros */}
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
      {(searchTerm ||
        filtroActual !== "todos" ||
        categoriaSeleccionada !== 0 ||
        localPrecioMin !== "0" ||
        localPrecioMax !== "") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {searchTerm && `Resultados para "${searchTerm}"`}
              {searchTerm && (filtroActual !== "todos" || categoriaSeleccionada !== 0) && " • "}
              {filtroActual !== "todos" && `Estado: ${tabs.find((t) => t.key === filtroActual)?.label}`}
              {filtroActual !== "todos" && categoriaSeleccionada !== 0 && " • "}
              {categoriaSeleccionada !== 0 &&
                `Categoría: ${categoriasPadre.find((c) => c.getIdCategoria() === categoriaSeleccionada)?.getNombre()}`}
              {(localPrecioMin !== "0" || localPrecioMax !== "") && " • "}
              {(localPrecioMin !== "0" || localPrecioMax !== "") &&
                `Precio: $${localPrecioMin || "0"} - $${localPrecioMax || "∞"}`}
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
