"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, Filter, Users, UserCheck, UserX, X, ChevronDown, ChevronUp } from "lucide-react";
import type { EmpleadoResponseDto } from "../../models/dto/Empleado/EmpleadoResponseDto";

interface IEmpleadosFiltersProps {
  empleados: EmpleadoResponseDto[];
  onFiltrar: (empleadosFiltrados: EmpleadoResponseDto[]) => void;
}

export const EmpleadosFilters: React.FC<IEmpleadosFiltersProps> = ({ empleados, onFiltrar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    let empleadosFiltrados = [...empleados];

    // Filtro por búsqueda (nombre, apellido, email)
    if (busqueda.trim() !== "") {
      const terminoBusqueda = busqueda.toLowerCase().trim();
      empleadosFiltrados = empleadosFiltrados.filter(
        (empleado) =>
          empleado.getNombre().toLowerCase().includes(terminoBusqueda) ||
          empleado.getApellido().toLowerCase().includes(terminoBusqueda) ||
          empleado.getEmail().toLowerCase().includes(terminoBusqueda),
      );
    }

    // Filtro por rol
    if (rolSeleccionado !== "") {
      empleadosFiltrados = empleadosFiltrados.filter((empleado) => empleado.getRol() === rolSeleccionado);
    }

    // Filtro por estado
    if (estadoSeleccionado !== "") {
      empleadosFiltrados = empleadosFiltrados.filter((empleado) => {
        const estaActivo = empleado.getFechaBaja() === null || new Date(empleado.getFechaBaja()).getTime() === 0;
        return estadoSeleccionado === "activo" ? estaActivo : !estaActivo;
      });
    }

    onFiltrar(empleadosFiltrados);
  }, [busqueda, rolSeleccionado, estadoSeleccionado, empleados, onFiltrar]);

  // Calcular estadísticas
  const totalEmpleados = empleados.length;
  const empleadosActivos = empleados.filter((emp) => {
    const fechaBaja = emp.getFechaBaja();
    return fechaBaja === null || new Date(fechaBaja).getTime() === 0;
  }).length;
  const empleadosInactivos = totalEmpleados - empleadosActivos;

  // Obtener roles únicos de los empleados
  const rolesUnicos = Array.from(new Set(empleados.map((emp) => emp.getRol()).filter(Boolean)));

  const limpiarFiltros = () => {
    setBusqueda("");
    setRolSeleccionado("");
    setEstadoSeleccionado("");
  };

  const hayFiltrosActivos = busqueda !== "" || rolSeleccionado !== "" || estadoSeleccionado !== "";

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  return (
    <div className="space-y-4">
      {/* Estadísticas - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalEmpleados}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Activos</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{empleadosActivos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserX className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Inactivos</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">{empleadosInactivos}</p>
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
                  {
                    [busqueda && "Búsqueda", rolSeleccionado && "Rol", estadoSeleccionado && "Estado"].filter(Boolean)
                      .length
                  }{" "}
                  activo
                  {[busqueda && "Búsqueda", rolSeleccionado && "Rol", estadoSeleccionado && "Estado"].filter(Boolean)
                    .length > 1
                    ? "s"
                    : ""}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Limpiar
                </button>
              )}
              <button
                onClick={toggleFiltros}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                {mostrarFiltros ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de filtros - Colapsable */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            mostrarFiltros ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}>
          <div className="p-4 space-y-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <label
                htmlFor="busqueda"
                className="block text-sm font-medium text-gray-700">
                Buscar empleado
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtros en grid responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filtro por rol */}
              <div className="space-y-2">
                <label
                  htmlFor="rol"
                  className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="rol"
                  value={rolSeleccionado}
                  onChange={(e) => setRolSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
                  <option value="">Todos los roles</option>
                  {rolesUnicos.map((rol) => (
                    <option
                      key={rol}
                      value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por estado */}
              <div className="space-y-2">
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="estado"
                  value={estadoSeleccionado}
                  onChange={(e) => setEstadoSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
                  <option value="">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>
            </div>

            {/* Resumen de filtros activos */}
            {hayFiltrosActivos && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {busqueda && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Búsqueda: "{busqueda}"
                      <button
                        onClick={() => setBusqueda("")}
                        className="ml-1 text-blue-600 hover:text-blue-800">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {rolSeleccionado && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Rol: {rolSeleccionado}
                      <button
                        onClick={() => setRolSeleccionado("")}
                        className="ml-1 text-green-600 hover:text-green-800">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {estadoSeleccionado && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Estado: {estadoSeleccionado === "activo" ? "Activos" : "Inactivos"}
                      <button
                        onClick={() => setEstadoSeleccionado("")}
                        className="ml-1 text-purple-600 hover:text-purple-800">
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
  );
};
