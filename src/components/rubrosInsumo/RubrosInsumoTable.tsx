"use client"
import EditIcon from "@mui/icons-material/Edit"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FolderIcon from "@mui/icons-material/Folder"
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Plus } from "lucide-react"
import { useState } from "react"
import type { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto"
import { Pagination } from "../Admin/products/Pagination"

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface RubrosInsumoTableProps {
  rubros: RubroInsumoAbmDto[]
  loading: boolean
  pagination: PaginationState
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  onEdit: (rubro: RubroInsumoAbmDto) => void
  onViewDetails: (rubro: RubroInsumoAbmDto) => void
  onToggleStatus: (rubro: RubroInsumoAbmDto) => void
  onNuevoRubro: () => void
  paginationInfo?: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

interface RubroWithLevel {
  rubro: RubroInsumoAbmDto
  level: number
}

export const RubrosInsumoTable = ({
  rubros,
  loading,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onViewDetails,
  onToggleStatus,
  onNuevoRubro,
  paginationInfo,
}: RubrosInsumoTableProps) => {
  const [expandedRubros, setExpandedRubros] = useState<Set<number>>(new Set())

  const toggleExpanded = (idRubroInsumo: number) => {
    const newExpanded = new Set(expandedRubros)
    if (newExpanded.has(idRubroInsumo)) {
      newExpanded.delete(idRubroInsumo)
    } else {
      newExpanded.add(idRubroInsumo)
    }
    setExpandedRubros(newExpanded)
  }

  // Función para obtener todos los subrubros recursivamente
  const getAllSubrubros = (parentId: number, allRubros: RubroInsumoAbmDto[], level = 1): RubroWithLevel[] => {
    const result: RubroWithLevel[] = []
    const directChildren = allRubros.filter((r) => r.getIdRubroPadre() === parentId)

    for (const child of directChildren) {
      result.push({ rubro: child, level })
      result.push(...getAllSubrubros(child.getIdRubroInsumo(), allRubros, level + 1))
    }

    return result
  }

  // Función recursiva para verificar si algún ancestro está inactivo
  const hasInactiveAncestor = (rubro: RubroInsumoAbmDto, allRubros: RubroInsumoAbmDto[]): boolean => {
    if (rubro.esRubroPadre()) {
      return false // Es un rubro principal, no tiene ancestros
    }

    const padre = allRubros.find((r) => r.getIdRubroInsumo() === rubro.getIdRubroPadre())
    if (!padre) {
      return false // No se encontró el padre
    }

    if (!padre.isDadoDeAlta()) {
      return true // El padre está inactivo
    }

    // Verificar recursivamente si algún ancestro del padre está inactivo
    return hasInactiveAncestor(padre, allRubros)
  }

  // Función para obtener colores por nivel
  const getLevelColors = (level: number) => {
    const colors = [
      { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", icon: "text-purple-600" }, // Principal
      { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", icon: "text-blue-600" }, // Subrubro
      { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", icon: "text-green-600" }, // Sub-subrubro
      { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", icon: "text-orange-600" }, // Niveles adicionales
    ]
    return colors[Math.min(level, colors.length - 1)]
  }

  // Función para obtener el nombre del tipo de rubro
  const getRubroTypeName = (level: number) => {
    const names = ["Principal", "Subrubro", "Sub-subrubro", "Nivel 4+"]
    return names[Math.min(level, names.length - 1)]
  }

  const rubrosprincipales = rubros.filter((r) => r.esRubroPadre())

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
              <div key={i} className="flex space-x-4">
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
    )
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
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Rubro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Rubros de Insumo</h3>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.totalItems} rubro{pagination.totalItems !== 1 ? "s" : ""} registrado
              {pagination.totalItems !== 1 ? "s" : ""} (vista jerárquica expandible)
            </p>
          </div>
          <button
            onClick={onNuevoRubro}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Rubro
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rubro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insumos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subrubros
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rubrosprincipales.map((rubro) => {
              const subrubros = getAllSubrubros(rubro.getIdRubroInsumo(), rubros)
              const isExpanded = expandedRubros.has(rubro.getIdRubroInsumo())
              const levelColors = getLevelColors(0)

              return (
                <>
                  {/* Fila principal del rubro */}
                  <tr key={rubro.getIdRubroInsumo()} className="hover:bg-gray-50 transition-colors">
                    {/* Columna de expansión */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subrubros.length > 0 ? (
                        <button
                          onClick={() => toggleExpanded(rubro.getIdRubroInsumo())}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title={isExpanded ? "Contraer subrubros" : "Expandir subrubros"}
                        >
                          {isExpanded ? (
                            <ExpandLessIcon className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ExpandMoreIcon className="h-5 w-5 text-gray-600" />
                          )}
                        </button>
                      ) : (
                        <div className="w-7 h-7 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{rubro.getNombre()}</div>
                            <div className="text-sm text-gray-500">ID: {rubro.getIdRubroInsumo()}</div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          rubro.isDadoDeAlta()
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            rubro.isDadoDeAlta() ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></span>
                        {rubro.isDadoDeAlta() ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${levelColors.bg} ${levelColors.text} ${levelColors.border} border`}
                      >
                        <FolderIcon className="h-3 w-3 mr-1" />
                        {getRubroTypeName(0)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {rubro.getCantInsumos()} insumo{rubro.getCantInsumos() !== 1 ? "s" : ""}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${levelColors.bg} ${levelColors.text} ${levelColors.border} border`}
                      >
                        {subrubros.length} subrubro{subrubros.length !== 1 ? "s" : ""}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewDetails(rubro)}
                          className="text-gray-700 hover:cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="Ver detalles"
                        >
                          <VisibilityIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(rubro)}
                          className="text-gray-700 hover:cursor-pointer p-2 rounded-full hover:bg-orange-50 transition-colors"
                          title="Editar rubro"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(rubro)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            rubro.isDadoDeAlta() ? "bg-green-500 focus:ring-green-500" : "bg-red-400 focus:ring-red-400"
                          }`}
                          title={rubro.isDadoDeAlta() ? "Desactivar" : "Activar"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              rubro.isDadoDeAlta() ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Filas de subrubros expandidas */}
                  {isExpanded &&
                    subrubros.map(({ rubro: subrubro, level }) => {
                      const subLevelColors = getLevelColors(level)
                      const tieneAncestroInactivo = hasInactiveAncestor(subrubro, rubros)

                      return (
                        <tr
                          key={`sub-${subrubro.getIdRubroInsumo()}`}
                          className="bg-gray-50 hover:bg-gray-100 transition-colors"
                          style={{ height: "56px" }} // Fila más pequeña
                        >
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="w-7 h-7 flex items-center justify-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            </div>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
                              <SubdirectoryArrowRightIcon className={`h-4 w-4 mr-2 ${subLevelColors.icon}`} />
                              <div className="flex items-center">
                                <div className="">
                                  <div className="text-sm font-medium text-gray-900">{subrubro.getNombre()}</div>
                                  <div className="text-xs text-gray-500">ID: {subrubro.getIdRubroInsumo()}</div>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                subrubro.isDadoDeAlta()
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  subrubro.isDadoDeAlta() ? "bg-green-400" : "bg-red-400"
                                }`}
                              ></span>
                              {subrubro.isDadoDeAlta() ? "Activo" : "Inactivo"}
                            </span>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subLevelColors.bg} ${subLevelColors.text} ${subLevelColors.border} border`}
                            >
                              <SubdirectoryArrowRightIcon className="h-3 w-3 mr-1" />
                              {getRubroTypeName(level)}
                            </span>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {subrubro.getCantInsumos()} insumo{subrubro.getCantInsumos() !== 1 ? "s" : ""}
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            <span className="text-xs text-gray-400">
                              {rubros.filter((r) => r.getIdRubroPadre() === subrubro.getIdRubroInsumo()).length} sub
                              {rubros.filter((r) => r.getIdRubroPadre() === subrubro.getIdRubroInsumo()).length !== 1
                                ? "s"
                                : ""}
                            </span>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => onViewDetails(subrubro)}
                                className="text-gray-700 hover:cursor-pointer p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                                title="Ver detalles"
                              >
                                <VisibilityIcon className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onEdit(subrubro)}
                                className="text-gray-700 hover:cursor-pointer p-1.5 rounded-full hover:bg-orange-50 transition-colors"
                                title="Editar subrubro"
                              >
                                <EditIcon className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onToggleStatus(subrubro)}
                                disabled={tieneAncestroInactivo} // Deshabilitar si algún ancestro está inactivo
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  tieneAncestroInactivo
                                    ? "bg-gray-300 cursor-not-allowed" // Estilo deshabilitado
                                    : subrubro.isDadoDeAlta()
                                      ? "bg-green-500 focus:ring-green-500"
                                      : "bg-red-400 focus:ring-red-400"
                                }`}
                                title={
                                  tieneAncestroInactivo
                                    ? "No se puede modificar - Rubro ancestro inactivo"
                                    : subrubro.isDadoDeAlta()
                                      ? "Desactivar"
                                      : "Activar"
                                }
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    subrubro.isDadoDeAlta() ? "translate-x-5" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  )
}
