"use client";

import type React from "react";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import type { RubroInsumoDto } from "../../models/dto/RubroInsumoDto";
import { Pagination } from "../Admin/products/Pagination";

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface RubrosTableProps {
  rubros: RubroInsumoDto[];
  loading: boolean;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onEdit: (rubro: RubroInsumoDto) => void;
  onViewDetails: (rubro: RubroInsumoDto) => void;
  onToggleStatus: (rubro: RubroInsumoDto) => void;
  onNuevoRubro: () => void;
  onNuevoSubrubro: (rubroPadre: RubroInsumoDto) => void;
  filtroActual: "todos" | "activos" | "inactivos" | "padre" | "subrubros";
  todosLosRubros: RubroInsumoDto[];
}

export const RubrosTable = ({
  rubros,
  loading,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onViewDetails,
  onToggleStatus,
  onNuevoRubro,
  onNuevoSubrubro,
  filtroActual,
  todosLosRubros,
}: RubrosTableProps) => {
  const [expandedRubros, setExpandedRubros] = useState<Set<number>>(new Set());

  const toggleExpanded = (idRubro: number) => {
    const newExpanded = new Set(expandedRubros);
    if (newExpanded.has(idRubro)) {
      newExpanded.delete(idRubro);
    } else {
      newExpanded.add(idRubro);
    }
    setExpandedRubros(newExpanded);
  };

  // Función recursiva para obtener todos los subrubros de un rubro
  const obtenerTodosLosSubrubros = (rubro: RubroInsumoDto): RubroInsumoDto[] => {
    let subrubros: RubroInsumoDto[] = [];

    const subrubrosDirectos = todosLosRubros.filter((r) => r.getIdRubroInsumoPadre() === rubro.getIdRubroInsumo());
    subrubros = [...subrubrosDirectos];

    subrubrosDirectos.forEach((subrubro) => {
      subrubros = [...subrubros, ...obtenerTodosLosSubrubros(subrubro)];
    });

    return subrubros;
  };

  // Determinar si mostrar el comportamiento desplegable
  const shouldShowDropdown = filtroActual === "todos";

  // Función para renderizar una fila de rubro
  const renderRubroRow = (rubro: RubroInsumoDto, nivel = 0, esSubrubro = false): React.ReactNode => {
    const subrubros = obtenerTodosLosSubrubros(rubro);
    const isExpanded = expandedRubros.has(rubro.getIdRubroInsumo());

    return (
      <>
        {/* Fila principal del rubro */}
        <tr
          key={rubro.getIdRubroInsumo()}
          className={`hover:bg-gray-50 transition-colors ${esSubrubro ? "bg-gray-50" : ""}`}>
          {/* Columna de expansión (solo en modo dropdown) */}
          {shouldShowDropdown && (
            <td className="px-6 py-4 whitespace-nowrap">
              {subrubros.length > 0 ? (
                <button
                  onClick={() => toggleExpanded(rubro.getIdRubroInsumo())}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title={isExpanded ? "Contraer subrubros" : "Expandir subrubros"}>
                  {isExpanded ? (
                    <ExpandLessIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ExpandMoreIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              ) : (
                <div className="w-7 h-7"></div>
              )}
            </td>
          )}

          <td className="px-6 py-4 whitespace-nowrap">
            <div
              className="flex items-center"
              style={{ paddingLeft: `${nivel * 24}px` }}>
              {nivel > 0 && <SubdirectoryArrowRightIcon className="h-4 w-4 text-gray-400 mr-2" />}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    {rubro.esRubroPadre() ? (
                      <FolderIcon className="h-5 w-5 text-orange-600" />
                    ) : (
                      <SubdirectoryArrowRightIcon className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{rubro.getNombre()}</div>
                  <div className="text-sm text-gray-500">ID: {rubro.getIdRubroInsumo()}</div>
                </div>
              </div>
            </div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                rubro.isActivo()
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${rubro.isActivo() ? "bg-green-400" : "bg-red-400"}`}></span>
              {rubro.isActivo() ? "Activo" : "Inactivo"}
            </span>
          </td>

          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {rubro.esRubroPadre() ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                <FolderIcon className="h-3 w-3 mr-1" />
                Principal
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                <SubdirectoryArrowRightIcon className="h-3 w-3 mr-1" />
                Subrubro
              </span>
            )}
          </td>

          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end space-x-1">
              <button
                onClick={() => onViewDetails(rubro)}
                className="p-2 text-gray-700 hover:cursor-pointer rounded-full transition-colors"
                title="Ver detalles">
                <VisibilityIcon fontSize="small" />
              </button>
              <button
                onClick={() => onEdit(rubro)}
                className="p-2 text-gray-700 hover:cursor-pointer rounded-full transition-colors"
                title="Editar">
                <EditIcon fontSize="small" />
              </button>
              <button
                onClick={() => onToggleStatus(rubro)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  rubro.isActivo() ? "bg-green-500 focus:ring-green-500" : "bg-red-400 focus:ring-red-400"
                }`}
                title={rubro.isActivo() ? "Desactivar" : "Activar"}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    rubro.isActivo() ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <button
                onClick={() => onNuevoSubrubro(rubro)}
                className="p-2 text-gray-700 hover:cursor-pointer rounded-full transition-colors"
                title="Agregar subrubro">
                <AddIcon fontSize="small" />
              </button>
            </div>
          </td>
        </tr>

        {/* Filas de subrubros expandidas (solo en modo dropdown) */}
        {shouldShowDropdown && isExpanded && subrubros.length > 0 && (
          <>{subrubros.map((subrubro) => renderRubroRow(subrubro, nivel + 1, true))}</>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (rubros.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <FolderIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay rubros registrados</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer rubro para organizar tus insumos</p>
          <button
            onClick={onNuevoRubro}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nuevo Rubro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Rubros</h3>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.totalItems} rubro{pagination.totalItems !== 1 ? "s" : ""} registrado
              {pagination.totalItems !== 1 ? "s" : ""}
              {shouldShowDropdown && " (vista jerárquica)"}
            </p>
          </div>
          <button
            onClick={onNuevoRubro}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nuevo Rubro
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {shouldShowDropdown && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">{rubros.map((rubro) => renderRubroRow(rubro))}</tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};
