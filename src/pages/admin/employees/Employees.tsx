"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, ArrowLeft } from "lucide-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { EmpleadosFilters } from "../../../components/empleados/EmpleadosFilters";
import { EmpleadosTable } from "../../../components/empleados/EmpleadosTable";
import type { EmpleadoResponseDto } from "../../../models/dto/Empleado/EmpleadoResponseDto";
import { empleadoServicio } from "../../../services/empleadoServicio";
import { NotificationService } from "../../../utils/notifications";
import { exportarEmpleadosAExcel } from "../../../utils/exportUtils";

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<EmpleadoResponseDto[]>([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState<EmpleadoResponseDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [exportando, setExportando] = useState(false);

  // Cargar empleados al montar el componente
  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const empleadosObtenidos = await empleadoServicio.obtenerEmpleados();
      console.log("Empleados obtenidos:", empleadosObtenidos);
      setEmpleados(empleadosObtenidos);
      setEmpleadosFiltrados(empleadosObtenidos);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      await NotificationService.error("Error", "No se pudieron cargar los empleados");
    } finally {
      setCargando(false);
    }
  };

  const manejarFiltrar = useCallback((empleadosFiltrados: EmpleadoResponseDto[]) => {
    setEmpleadosFiltrados(empleadosFiltrados);
  }, []);

  const manejarEmpleadoEditado = () => {
    cargarEmpleados(); // Recargar la lista después de editar
  };

  const navegarANuevoEmpleado = () => {
    navigate("/admin/empleados/nuevo");
  };

  const navegarADashboard = () => {
    navigate("/admin/dashboard");
  };

  const exportarEmpleados = async () => {
    try {
      setExportando(true);

      // Usar los empleados filtrados si hay filtros activos, sino todos
      const empleadosAExportar = empleadosFiltrados.length < empleados.length ? empleadosFiltrados : empleados;

      if (empleadosAExportar.length === 0) {
        await NotificationService.warning("Sin datos", "No hay empleados para exportar");
        return;
      }

      const nombreArchivo = exportarEmpleadosAExcel(empleadosAExportar);
      await NotificationService.success(
        "¡Exportación exitosa!",
        `El archivo ${nombreArchivo} se ha descargado correctamente.`,
      );
    } catch (error) {
      console.error("Error al exportar empleados:", error);
      await NotificationService.error("Error", "No se pudo exportar el archivo");
    } finally {
      setExportando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navegación móvil */}
        <div className="lg:hidden">
          <button
            onClick={navegarADashboard}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al Dashboard
          </button>
        </div>

        <PageHeader
          title="Gestión de Empleados"
          subtitle="Administra los empleados del sistema"
        />

        {/* Botones de acción - Mobile First */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div className="order-2 sm:order-1">
            <button
              onClick={navegarANuevoEmpleado}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </button>
          </div>

          <div className="order-1 sm:order-2">
            <button
              onClick={exportarEmpleados}
              disabled={exportando || empleados.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {exportando ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full mr-2" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar ({empleadosFiltrados.length})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filtros */}
        <EmpleadosFilters
          empleados={empleados}
          onFiltrar={manejarFiltrar}
        />

        {/* Tabla de empleados */}
        <EmpleadosTable
          empleados={empleadosFiltrados}
          onEmpleadoEditado={manejarEmpleadoEditado}
        />

        {/* Información adicional - Solo desktop */}
        <div className="hidden lg:block">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Información</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Usa los filtros para encontrar empleados específicos</li>
                    <li>Los empleados desactivados pueden ser reactivados en cualquier momento</li>
                    <li>La exportación incluye todos los empleados filtrados actualmente</li>
                    <li>Los cambios se reflejan inmediatamente en el sistema</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
