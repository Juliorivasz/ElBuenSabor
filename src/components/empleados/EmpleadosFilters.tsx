"use client"
import SearchField from "../common/SearchField"

interface EmpleadosFiltersProps {
  totalEmpleados: number
  empleadosActivos: number
  empleadosInactivos: number
  filtroActual: "todos" | "activos" | "inactivos"
  onFiltroChange: (filtro: "todos" | "activos" | "inactivos") => void
  busqueda: string
  onBusquedaChange: (busqueda: string) => void
}

export const EmpleadosFilters = ({
  totalEmpleados,
  empleadosActivos,
  empleadosInactivos,
  filtroActual,
  onFiltroChange,
  busqueda,
  onBusquedaChange,
}: EmpleadosFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <SearchField onSearch={onBusquedaChange} placeholder="Buscar empleado por nombre..." />
      </div>

      {/* Tabs de filtros */}
      <div className="flex space-x-1">
        <button
          onClick={() => onFiltroChange("todos")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filtroActual === "todos"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Todos ({totalEmpleados})
        </button>
        <button
          onClick={() => onFiltroChange("activos")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filtroActual === "activos"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Activos ({empleadosActivos})
        </button>
        <button
          onClick={() => onFiltroChange("inactivos")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filtroActual === "inactivos"
              ? "bg-red-100 text-red-700 border border-red-200"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Inactivos ({empleadosInactivos})
        </button>
      </div>
    </div>
  )
}
