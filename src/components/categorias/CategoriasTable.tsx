import EditIcon from "@mui/icons-material/Edit"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FolderIcon from "@mui/icons-material/Folder"
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { Plus } from "lucide-react"
import { useState } from "react"
import type { CategoriaExtendidaDto } from "../../models/dto/CategoriaExtendidaDto"
import { useCategoriasStore } from "../../store/categorias/useCategoriasStore"
import { Pagination } from "../Admin/products/Pagination"

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface CategoriasTableProps {
  categorias: CategoriaExtendidaDto[]
  loading: boolean
  pagination: PaginationState
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  onEdit: (categoria: CategoriaExtendidaDto) => void
  onViewDetails: (categoria: CategoriaExtendidaDto) => void
  onToggleStatus: (categoria: CategoriaExtendidaDto) => void
  onNuevaCategoria: () => void
  filtroActual: "todas" | "activas" | "inactivas" | "padre" | "subcategorias"
}

interface CategoryWithLevel {
  categoria: CategoriaExtendidaDto
  level: number
}

export const CategoriasTable = ({
  categorias,
  loading,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onViewDetails,
  onToggleStatus,
  onNuevaCategoria,
  filtroActual,
}: CategoriasTableProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const { categorias: todasLasCategorias } = useCategoriasStore.getState()

  const toggleExpanded = (idCategoria: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(idCategoria)) {
      newExpanded.delete(idCategoria)
    } else {
      newExpanded.add(idCategoria)
    }
    setExpandedCategories(newExpanded)
  }

  // Función para obtener todas las subcategorías recursivamente
  const getAllSubcategories = (
    parentId: number,
    allCategories: CategoriaExtendidaDto[],
    level = 1,
  ): CategoryWithLevel[] => {
    const result: CategoryWithLevel[] = []
    const directChildren = allCategories.filter((cat) => cat.getIdCategoriaPadre() === parentId)

    for (const child of directChildren) {
      result.push({ categoria: child, level })
      result.push(...getAllSubcategories(child.getIdCategoria(), allCategories, level + 1))
    }

    return result
  }

  // Función para obtener colores por nivel
  const getLevelColors = (level: number) => {
    const colors = [
      { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", icon: "text-purple-600" }, // Principal
      { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", icon: "text-blue-600" }, // Subcategoría
      { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", icon: "text-green-600" }, // Sub-subcategoría
      { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", icon: "text-orange-600" }, // Niveles adicionales
    ]
    return colors[Math.min(level, colors.length - 1)]
  }

  // Función para obtener el nombre del tipo de categoría
  const getCategoryTypeName = (level: number) => {
    const names = ["Principal", "Subcategoría", "Sub-subcategoría", "Nivel 4+"]
    return names[Math.min(level, names.length - 1)]
  }

  // Función para obtener subcategorías de una categoría padre
  const getSubcategorias = (idCategoriaPadre: number): CategoriaExtendidaDto[] => {
    return todasLasCategorias.filter((sub) => sub.getIdCategoriaPadre() === idCategoriaPadre)
  }

  // Determinar si mostrar el comportamiento desplegable
  const shouldShowDropdown = filtroActual === "todas"

  // Función para determinar qué categorías mostrar según el filtro
  const getCategoriasToShow = (): CategoriaExtendidaDto[] => {
    switch (filtroActual) {
      case "todas":
        // En vista "todas", mostrar solo categorías principales (padre = 0) para la paginación
        // Las subcategorías se muestran expandidas dentro de cada categoría padre
        return categorias.filter((cat) => cat.getIdCategoriaPadre() === 0)
      case "padre":
        // Mostrar solo categorías principales
        return categorias.filter((cat) => cat.getIdCategoriaPadre() === 0)
      case "subcategorias":
        // Mostrar solo subcategorías (que tienen padre != 0)
        return categorias.filter((cat) => cat.getIdCategoriaPadre() !== 0)
      case "activas":
      case "inactivas":
      default:
        // Para filtros de estado, mostrar todas las categorías filtradas
        return categorias
    }
  }

  const categoriasAMostrar = getCategoriasToShow()

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

  if (categoriasAMostrar.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <FolderIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías registradas</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primera categoría para organizar tus productos</p>
          <button
            onClick={onNuevaCategoria}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
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
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Categorías</h3>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.totalItems} categoría{pagination.totalItems !== 1 ? "s" : ""} registrada
              {pagination.totalItems !== 1 ? "s" : ""}
              {shouldShowDropdown && " (vista jerárquica expandible)"}
            </p>
          </div>
          <button
            onClick={onNuevaCategoria}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subcategorías
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categoriasAMostrar.map((categoria) => {
              const subcategorias = shouldShowDropdown
                ? getAllSubcategories(categoria.getIdCategoria(), todasLasCategorias)
                : []
              const isExpanded = expandedCategories.has(categoria.getIdCategoria())

              // Calcular el nivel de la categoría actual
              let nivel = 0
              if (categoria.getIdCategoriaPadre() !== 0) {
                // Es una subcategoría, calcular su nivel
                let currentCat = categoria
                while (currentCat.getIdCategoriaPadre() !== 0) {
                  nivel++
                  const parent = todasLasCategorias.find((c) => c.getIdCategoria() === currentCat.getIdCategoriaPadre())
                  if (!parent) break
                  currentCat = parent
                }
              }

              const levelColors = getLevelColors(nivel)

              return (
                <>
                  {/* Fila principal de la categoría */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    {/* Columna de expansión (solo en modo dropdown) */}
                    {shouldShowDropdown && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subcategorias.length > 0 ? (
                          <button
                            onClick={() => toggleExpanded(categoria.getIdCategoria())}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title={isExpanded ? "Contraer subcategorías" : "Expandir subcategorías"}
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
                    )}

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ paddingLeft: `${nivel * 24}px` }}>
                        {nivel > 0 && <SubdirectoryArrowRightIcon className={`h-4 w-4 mr-2 ${levelColors.icon}`} />}
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{categoria.getNombre()}</div>
                            <div className="text-sm text-gray-500">ID: {categoria.getIdCategoria()}</div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelColors.bg} ${levelColors.text}`}
                      >
                        {(categoria.getMargenGanancia() * 100).toFixed(2)}%
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          categoria.isActiva()
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            categoria.isActiva() ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></span>
                        {categoria.isActiva() ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${levelColors.bg} ${levelColors.text} ${levelColors.border} border`}
                      >
                        {nivel === 0 ? (
                          <FolderIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <SubdirectoryArrowRightIcon className="h-3 w-3 mr-1" />
                        )}
                        {getCategoryTypeName(nivel)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shouldShowDropdown ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${levelColors.bg} ${levelColors.text} ${levelColors.border} border`}
                        >
                          {subcategorias.length} subcategoría{subcategorias.length !== 1 ? "s" : ""}
                        </span>
                      ) : // Mostrar subcategorías en modo normal (filtros activos)
                      subcategorias.length > 0 ? (
                        <div className="space-y-1">
                          {subcategorias.slice(0, 2).map(({ categoria: sub, level }) => {
                            const subLevelColors = getLevelColors(level)
                            return (
                              <div key={sub.getIdCategoria()} className="flex items-center space-x-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${subLevelColors.bg} ${subLevelColors.text}`}
                                >
                                  {sub.getNombre()}
                                </span>
                              </div>
                            )
                          })}
                          {subcategorias.length > 2 && (
                            <div className="text-xs text-gray-400">+{subcategorias.length - 2} más</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin subcategorías</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewDetails(categoria)}
                          className="text-gray-700 hover:cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="Ver detalles"
                        >
                          <VisibilityIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(categoria)}
                          className="text-gray-700 hover:cursor-pointer p-2 rounded-full hover:bg-orange-50 transition-colors"
                          title="Editar categoría"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(categoria)}
                          disabled={
                            // Deshabilitar si es una subcategoría inactiva y su padre también está inactivo
                            !categoria.isActiva() &&
                            categoria.getIdCategoriaPadre() !== 0 &&
                            (() => {
                              const padre = todasLasCategorias.find(
                                (cat) => cat.getIdCategoria() === categoria.getIdCategoriaPadre(),
                              )
                              return padre ? !padre.isActiva() : false
                            })()
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            categoria.isActiva() ? "bg-green-500 focus:ring-green-500" : "bg-red-400 focus:ring-red-400"
                          } ${
                            // Estilo para botón deshabilitado
                            !categoria.isActiva() &&
                            categoria.getIdCategoriaPadre() !== 0 &&
                            (() => {
                              const padre = todasLasCategorias.find(
                                (cat) => cat.getIdCategoria() === categoria.getIdCategoriaPadre(),
                              )
                              return padre ? !padre.isActiva() : false
                            })()
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            !categoria.isActiva() &&
                            categoria.getIdCategoriaPadre() !== 0 &&
                            (() => {
                              const padre = todasLasCategorias.find(
                                (cat) => cat.getIdCategoria() === categoria.getIdCategoriaPadre(),
                              )
                              return padre ? !padre.isActiva() : false
                            })()
                              ? "No se puede activar: la categoría padre está inactiva"
                              : categoria.isActiva()
                                ? "Desactivar"
                                : "Activar"
                          }
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              categoria.isActiva() ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Filas de subcategorías expandidas (solo en modo dropdown) */}
                  {shouldShowDropdown &&
                    isExpanded &&
                    subcategorias.map(({ categoria: subcategoria, level }) => {
                      const subLevelColors = getLevelColors(level)
                      return (
                        <tr
                          key={`subcategoria-${subcategoria.getIdCategoria()}`}
                          className="bg-gray-50 hover:bg-gray-100 transition-colors"
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
                                <div className="flex-shrink-0 h-10 w-10"></div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{subcategoria.getNombre()}</div>
                                  <div className="text-xs text-gray-500">ID: {subcategoria.getIdCategoria()}</div>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subLevelColors.bg} ${subLevelColors.text}`}
                            >
                              {(subcategoria.getMargenGanancia() * 100).toFixed(2)}%
                            </span>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                subcategoria.isActiva()
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  subcategoria.isActiva() ? "bg-green-400" : "bg-red-400"
                                }`}
                              ></span>
                              {subcategoria.isActiva() ? "Activa" : "Inactiva"}
                            </span>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subLevelColors.bg} ${subLevelColors.text} ${subLevelColors.border} border`}
                            >
                              <SubdirectoryArrowRightIcon className="h-3 w-3 mr-1" />
                              {getCategoryTypeName(level)}
                            </span>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            <span className="text-xs text-gray-400">
                              {getSubcategorias(subcategoria.getIdCategoria()).length} sub
                              {getSubcategorias(subcategoria.getIdCategoria()).length !== 1 ? "s" : ""}
                            </span>
                          </td>

                          <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => onViewDetails(subcategoria)}
                                className="text-gray-700 hover:cursor-pointer p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                                title="Ver detalles"
                              >
                                <VisibilityIcon className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onEdit(subcategoria)}
                                className="text-gray-700 hover:cursor-pointer p-1.5 rounded-full hover:bg-orange-50 transition-colors"
                                title="Editar subcategoría"
                              >
                                <EditIcon className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onToggleStatus(subcategoria)}
                                disabled={
                                  // Deshabilitar si es una subcategoría inactiva y su padre también está inactivo
                                  !subcategoria.isActiva() &&
                                  subcategoria.getIdCategoriaPadre() !== 0 &&
                                  (() => {
                                    const padre = todasLasCategorias.find(
                                      (cat) => cat.getIdCategoria() === subcategoria.getIdCategoriaPadre(),
                                    )
                                    return padre ? !padre.isActiva() : false
                                  })()
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  subcategoria.isActiva()
                                    ? "bg-green-500 focus:ring-green-500"
                                    : "bg-red-400 focus:ring-red-400"
                                } ${
                                  // Estilo para botón deshabilitado
                                  !subcategoria.isActiva() &&
                                  subcategoria.getIdCategoriaPadre() !== 0 &&
                                  (() => {
                                    const padre = todasLasCategorias.find(
                                      (cat) => cat.getIdCategoria() === subcategoria.getIdCategoriaPadre(),
                                    )
                                    return padre ? !padre.isActiva() : false
                                  })()
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                title={
                                  !subcategoria.isActiva() &&
                                  subcategoria.getIdCategoriaPadre() !== 0 &&
                                  (() => {
                                    const padre = todasLasCategorias.find(
                                      (cat) => cat.getIdCategoria() === subcategoria.getIdCategoriaPadre(),
                                    )
                                    return padre ? !padre.isActiva() : false
                                  })()
                                    ? "No se puede activar: la categoría padre está inactiva"
                                    : subcategoria.isActiva()
                                      ? "Desactivar"
                                      : "Activar"
                                }
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    subcategoria.isActiva() ? "translate-x-6" : "translate-x-1"
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

      {/* Paginación */}
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
