import ClearIcon from "@mui/icons-material/Clear"
import SearchIcon from "@mui/icons-material/Search"
import { useEffect, useState } from "react"
import type { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto"
import type { InformacionArticuloNoElaboradoDto } from "../../../models/dto/InformacionArticuloNoElaboradoDto"

// If ProductUnion does not exist, you can define it as follows:
type ProductUnion = InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto

interface ProductsFiltersProps {
  totalProductos: number
  productosActivos: number
  productosInactivos: number
  productosPadre: number
  subproductos: (InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto)[]
  filtroActual: "todas" | "activas" | "inactivas" | "padre" | "subcategorias"
  onFiltroChange: (filtro: "todas" | "activas" | "inactivas" | "padre" | "subcategorias") => void
  busqueda: string
  onBusquedaChange: (busqueda: string) => void
  onFiltrar: (productos: (InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto)[]) => void
}

export const ProductsFilters = ({
  totalProductos,
  productosActivos,
  productosInactivos,
  productosPadre,
  subproductos,
  filtroActual,
  onFiltroChange,
  busqueda,
  onBusquedaChange,
  onFiltrar,
}: ProductsFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(busqueda)

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onBusquedaChange(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, onBusquedaChange])

  useEffect(() => {
    let productosFiltrados = [...subproductos]

    // Apply search filter
    if (searchTerm.trim()) {
      productosFiltrados = productosFiltrados.filter(
        (producto) =>
          producto.getNombre().toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.getDescripcion().toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    switch (filtroActual) {
      case "activas":
        productosFiltrados = productosFiltrados.filter((p) => p.isDadoDeAlta())
        break
      case "inactivas":
        productosFiltrados = productosFiltrados.filter((p) => !p.isDadoDeAlta())
        break
      case "todas":
      default:
        // No additional filtering needed
        break
    }

    onFiltrar(productosFiltrados)
  }, [subproductos, searchTerm, filtroActual, onFiltrar])

  const handleClearSearch = () => {
    setSearchTerm("")
    onBusquedaChange("")
  }

  const tabs = [
    {
      key: "todas" as const,
      label: "Todas",
      count: totalProductos,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Todos los productos",
    },
    {
      key: "activas" as const,
      label: "Activas",
      count: productosActivos,
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Solo productos activos",
    },
    {
      key: "inactivas" as const,
      label: "Inactivas",
      count: productosInactivos,
      color: "bg-red-100 text-red-800 border-red-200",
      description: "Solo productos inactivos",
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
              placeholder="Buscar productos en tiempo real..."
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
    </div>
  )
}
