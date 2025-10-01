"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Users, ShoppingCart, X, ChevronDown, ChevronUp } from "lucide-react"
import type { ClienteGestion } from "../../../models/ClienteGestion"

interface IClientesFiltersProps {
  clientes: ClienteGestion[]
  onFiltrar: (clientesFiltrados: ClienteGestion[]) => void
  totalClientes?: number
}

export const ClientesFilters: React.FC<IClientesFiltersProps> = ({ clientes, onFiltrar, totalClientes }) => {
  const [busqueda, setBusqueda] = useState("")
  const [pedidosRango, setPedidosRango] = useState("")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  useEffect(() => {
    let clientesFiltrados = [...clientes]

    // Filter by search (name, email, phone)
    if (busqueda.trim() !== "") {
      const terminoBusqueda = busqueda.toLowerCase().trim()
      clientesFiltrados = clientesFiltrados.filter(
        (cliente) =>
          cliente.nombreYApellido.toLowerCase().includes(terminoBusqueda) ||
          cliente.email.toLowerCase().includes(terminoBusqueda) ||
          cliente.telefono.toLowerCase().includes(terminoBusqueda),
      )
    }

    // Filter by order count range
    if (pedidosRango !== "") {
      clientesFiltrados = clientesFiltrados.filter((cliente) => {
        const pedidos = cliente.cantidadPedidos
        switch (pedidosRango) {
          case "0":
            return pedidos === 0
          case "1-5":
            return pedidos >= 1 && pedidos <= 5
          case "6-10":
            return pedidos >= 6 && pedidos <= 10
          case "10+":
            return pedidos > 10
          default:
            return true
        }
      })
    }

    onFiltrar(clientesFiltrados)
  }, [busqueda, pedidosRango, clientes, onFiltrar])

  const totalClientesActual = clientes.length
  const clientesConPedidos = clientes.filter((c) => c.cantidadPedidos > 0).length
  const clientesSinPedidos = totalClientesActual - clientesConPedidos

  const limpiarFiltros = () => {
    setBusqueda("")
    setPedidosRango("")
  }

  const hayFiltrosActivos = busqueda !== "" || pedidosRango !== ""

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros)
  }

  return (
    <div className="space-y-4">
      {/* Statistics - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                {totalClientes ? "Total (Sistema)" : "En esta página"}
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalClientes || totalClientesActual}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Con Pedidos (Página)</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{clientesConPedidos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Sin Pedidos (Página)</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-600">{clientesSinPedidos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Filters Panel */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Filter header - Always visible */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              {hayFiltrosActivos && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {[busqueda && "Búsqueda", pedidosRango && "Pedidos"].filter(Boolean).length} activo
                  {[busqueda && "Búsqueda", pedidosRango && "Pedidos"].filter(Boolean).length > 1 ? "s" : ""}
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

        {/* Filter content - Collapsible */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            mostrarFiltros ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Search */}
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
                  placeholder="Nombre, email o teléfono..."
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

            {/* Responsive filter grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filter by order count */}
              <div className="space-y-2">
                <label htmlFor="pedidos" className="block text-sm font-medium text-gray-700">
                  Cantidad de Pedidos
                </label>
                <select
                  id="pedidos"
                  value={pedidosRango}
                  onChange={(e) => setPedidosRango(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Todos los rangos</option>
                  <option value="0">Sin pedidos (0)</option>
                  <option value="1-5">1 a 5 pedidos</option>
                  <option value="6-10">6 a 10 pedidos</option>
                  <option value="10+">Más de 10 pedidos</option>
                </select>
              </div>
            </div>

            {/* Active filters summary */}
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
                  {pedidosRango && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Pedidos:{" "}
                      {pedidosRango === "0"
                        ? "Sin pedidos"
                        : pedidosRango === "10+"
                          ? "Más de 10"
                          : `${pedidosRango} pedidos`}
                      <button onClick={() => setPedidosRango("")} className="ml-1 text-green-600 hover:text-green-800">
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
