import { ChevronDown, ChevronUp, Filter, Search, UserCheck, Users, UserX, X } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import type { ClienteGestion } from "../../../models/ClienteGestion"

interface IClientesFiltersProps {
  clientes: ClienteGestion[]
  onFiltrar: (clientesFiltrados: ClienteGestion[]) => void
}

export const ClientesFilters: React.FC<IClientesFiltersProps> = ({ clientes, onFiltrar }) => {
  const [busqueda, setBusqueda] = useState("")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    let clientesFiltrados = [...clientes]

    // Filtro por búsqueda (nombre, apellido, email)
    if (busqueda.trim() !== "") {
      const terminoBusqueda = busqueda.toLowerCase().trim()
      clientesFiltrados = clientesFiltrados.filter(
        (cliente) =>
          cliente.nombreYApellido.toLowerCase().includes(terminoBusqueda) ||
          cliente.email.toLowerCase().includes(terminoBusqueda),
      )
    }

    onFiltrar(clientesFiltrados)
  }, [busqueda, clientes, onFiltrar])

  // Calcular estadísticas
  const totalClientes = clientes.length
  const clientesConPedidos = clientes.filter((cliente) => cliente.cantidadPedidos > 0).length
  const clientesSinPedidos = totalClientes - clientesConPedidos

  const limpiarFiltros = () => {
    setBusqueda("")
  }

  const hayFiltrosActivos = busqueda !== ""

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros)
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalClientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Con Pedidos</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{clientesConPedidos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserX className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Sin Pedidos</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">{clientesSinPedidos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Filtros Colapsable */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header de filtros - Siempre visible */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              {hayFiltrosActivos && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  1 activo
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={toggleFiltros}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {mostrarFiltros ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de filtros - Colapsable */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            mostrarFiltros ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700">
                Buscar cliente
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="busqueda"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre, apellido o email..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Resumen de filtros activos */}
            {hayFiltrosActivos && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {busqueda && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Búsqueda: "{busqueda}"
                      <button onClick={() => setBusqueda("")} className="ml-1 text-blue-600 hover:text-blue-800">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
