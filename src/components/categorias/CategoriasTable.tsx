"use client"

import BlockIcon from "@mui/icons-material/Block"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EditIcon from "@mui/icons-material/Edit"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FolderIcon from "@mui/icons-material/Folder"
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight"
import VisibilityIcon from "@mui/icons-material/Visibility"
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

  const getImageUrl = (categoria: CategoriaExtendidaDto): string => {
    // Primero intentar con la estructura nueva (imagenModel.url)
    if ((categoria as any).imagenModel?.url) {
      return (categoria as any).imagenModel.url
    }
    // Fallback a la estructura anterior
    return categoria.getImagenDto()?.getUrl() || ""
  }

  // Función para obtener subcategorías de una categoría padre
  const getSubcategorias = (idCategoriaPadre: number): CategoriaExtendidaDto[] => {
    return todasLasCategorias.filter((sub) => sub.getIdCategoriaPadre() === idCategoriaPadre)
  }

  // Determinar si mostrar el comportamiento desplegable
  const shouldShowDropdown = filtroActual === "todas"

  // En modo dropdown, las categorías ya vienen filtradas (solo padres) desde el componente padre
  // En otros modos, mostramos las categorías tal como vienen
  const categoriasAMostrar = categorias

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

  if (categorias.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <FolderIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías registradas</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primera categoría para organizar tus productos</p>
          <button
            onClick={onNuevaCategoria}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
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
              {shouldShowDropdown && " (vista jerárquica)"}
            </p>
          </div>
          <button
            onClick={onNuevaCategoria}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
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
              const subcategorias = shouldShowDropdown ? getSubcategorias(categoria.getIdCategoria()) : []
              const isExpanded = expandedCategories.has(categoria.getIdCategoria())
              const nivel = shouldShowDropdown ? 0 : categoria.esCategoriaPadre() ? 0 : 1

              return (
                <>
                  {/* Fila principal de la categoría */}
                  <tr key={categoria.getIdCategoria()} className="hover:bg-gray-50 transition-colors">
                    {/* Columna de expansión (solo en modo dropdown) */}
                    {shouldShowDropdown && (
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                    )}

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ paddingLeft: `${nivel * 24}px` }}>
                        {nivel > 0 && <SubdirectoryArrowRightIcon className="h-4 w-4 text-gray-400 mr-2" />}
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                              src={getImageUrl(categoria) || "/placeholder.svg?height=48&width=48"}
                              alt={categoria.getNombre()}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{categoria.getNombre()}</div>
                            <div className="text-sm text-gray-500">ID: {categoria.getIdCategoria()}</div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categoria.getMargenGanancia().toFixed(2)}%
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
                          className={`w-2 h-2 rounded-full mr-2 ${categoria.isActiva() ? "bg-green-400" : "bg-red-400"}`}
                        ></span>
                        {categoria.isActiva() ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {categoria.esCategoriaPadre() ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          <FolderIcon className="h-3 w-3 mr-1" />
                          Principal
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <SubdirectoryArrowRightIcon className="h-3 w-3 mr-1" />
                          Subcategoría
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shouldShowDropdown ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          {subcategorias.length} subcategoría{subcategorias.length !== 1 ? "s" : ""}
                        </span>
                      ) : // Mostrar subcategorías en modo normal (filtros activos)
                      subcategorias.length > 0 ? (
                        <div className="space-y-1">
                          {subcategorias.slice(0, 2).map((sub) => (
                            <div key={sub.getIdCategoria()} className="flex items-center space-x-2">
                              <img
                                src={getImageUrl(sub) || "/placeholder.svg?height=32&width=32"}
                                alt={sub.getNombre()}
                                className="h-6 w-6 rounded-full object-cover border border-gray-200"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                                }}
                              />
                              <span className="text-gray-700 text-xs">{sub.getNombre()}</span>
                            </div>
                          ))}
                          {subcategorias.length > 2 && (
                            <span className="text-xs text-gray-500">+{subcategorias.length - 2} más</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onViewDetails(categoria)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                          title="Ver detalles"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => onEdit(categoria)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                          title="Editar"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(categoria)}
                          className={`p-2 rounded-full transition-colors ${
                            categoria.isActiva()
                              ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                              : "text-green-600 hover:text-green-900 hover:bg-green-50"
                          }`}
                          title={categoria.isActiva() ? "Desactivar" : "Activar"}
                        >
                          {categoria.isActiva() ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Filas de subcategorías expandidas (solo en modo dropdown) */}
                  {shouldShowDropdown && isExpanded && (
                    <>
                      {subcategorias.length > 0 ? (
                        subcategorias.map((subcategoria) => (
                          <tr
                            key={`sub-${subcategoria.getIdCategoria()}`}
                            className="bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <td className="px-6 py-3"></td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="flex items-center pl-8">
                                <SubdirectoryArrowRightIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8">
                                    <img
                                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                      src={getImageUrl(subcategoria) || "/placeholder.svg?height=32&width=32"}
                                      alt={subcategoria.getNombre()}
                                      onError={(e) => {
                                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                                      }}
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-800">{subcategoria.getNombre()}</div>
                                    <div className="text-xs text-gray-500">ID: {subcategoria.getIdCategoria()}</div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {subcategoria.getMargenGanancia().toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  subcategoria.isActiva()
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${subcategoria.isActiva() ? "bg-green-400" : "bg-red-400"}`}
                                ></span>
                                {subcategoria.isActiva() ? "Activa" : "Inactiva"}
                              </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                <SubdirectoryArrowRightIcon className="h-3 w-3 mr-1" />
                                Subcategoría
                              </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              <span className="text-gray-400">-</span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => onViewDetails(subcategoria)}
                                  className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Ver detalles"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => onEdit(subcategoria)}
                                  className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                                  title="Editar"
                                >
                                  <EditIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => onToggleStatus(subcategoria)}
                                  className={`p-1.5 rounded-full transition-colors ${
                                    subcategoria.isActiva()
                                      ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                                      : "text-green-600 hover:text-green-900 hover:bg-green-50"
                                  }`}
                                  title={subcategoria.isActiva() ? "Desactivar" : "Activar"}
                                >
                                  {subcategoria.isActiva() ? (
                                    <BlockIcon fontSize="small" />
                                  ) : (
                                    <CheckCircleIcon fontSize="small" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-50">
                          <td className="px-6 py-3"></td>
                          <td colSpan={6} className="px-6 py-3 text-center text-sm text-gray-500 italic">
                            Sin subcategorías
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </>
              )
            })}
          </tbody>
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
  )
}
