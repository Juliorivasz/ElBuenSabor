import CloseIcon from "@mui/icons-material/Close"
import FolderIcon from "@mui/icons-material/Folder"
import ImageIcon from "@mui/icons-material/Image"
import InfoIcon from "@mui/icons-material/Info"
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight"
import { useState } from "react"
import type { CategoriaExtendidaDto } from "../../models/dto/CategoriaExtendidaDto"

interface CategoriaDetailsModalProps {
  categoria: CategoriaExtendidaDto
  categorias: CategoriaExtendidaDto[]
  onClose: () => void
}

export const CategoriaDetailsModal = ({ categoria, categorias, onClose }: CategoriaDetailsModalProps) => {
  const [imageError, setImageError] = useState(false)

  const getImageUrl = (categoria: CategoriaExtendidaDto): string => {
    // Primero intentar con la estructura nueva (imagenModel.url)
    if ((categoria as any).imagenModel?.url) {
      return (categoria as any).imagenModel.url
    }
    // Fallback a la estructura anterior
    return categoria.getImagenDto()?.getUrl() || ""
  }

  const subcategorias = categorias.filter((cat) => cat.getIdCategoriaPadre() === categoria.getIdCategoria())
  const categoriaPadre = categoria.esCategoriaPadre()
    ? null
    : categorias.find((cat) => cat.getIdCategoria() === categoria.getIdCategoriaPadre())

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 border w-11/12 max-w-3xl shadow-xl rounded-lg bg-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {!imageError && getImageUrl(categoria) ? (
                <img
                  src={getImageUrl(categoria) || "/placeholder.svg"}
                  alt={categoria.getNombre()}
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                  onError={handleImageError}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{categoria.getNombre()}</h3>
              <div className="flex items-center mt-2 space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
                <span className="text-sm text-gray-500">ID: {categoria.getIdCategoria()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información básica */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <InfoIcon className="h-5 w-5 mr-2 text-blue-600" />
                Información Básica
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border">{categoria.getNombre()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Margen de Ganancia</label>
                  <div className="flex items-center space-x-2 bg-white p-3 rounded border">
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h.01a1 1 0 100-2H7zM14 9a1 1 0 000 2h.01a1 1 0 100-2H14zM8 13a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-900 font-medium">
                      {categoria.getMargenGanancia().toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Categoría</label>
                  <div className="bg-white p-3 rounded border">
                    {categoria.esCategoriaPadre() ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <FolderIcon className="h-4 w-4 mr-2" />
                        Categoría Principal
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <SubdirectoryArrowRightIcon className="h-4 w-4 mr-2" />
                        Subcategoría
                      </span>
                    )}
                  </div>
                </div>

                {!categoria.esCategoriaPadre() && categoriaPadre && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría Padre</label>
                    <div className="bg-white p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <img
                          src={categoriaPadre.getImagenDto()?.getUrl() || "/placeholder.svg?height=32&width=32"}
                          alt={categoriaPadre.getNombre()}
                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                          }}
                        />
                        <span className="text-sm text-gray-900 font-medium">{categoriaPadre.getNombre()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-sm text-gray-900">
                      {categoria.isActiva()
                        ? "Categoría activa y visible para clientes"
                        : "Categoría inactiva, no visible para clientes"}
                    </span>
                  </div>
                </div>

                {categoria.getFechaBaja() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Baja</label>
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <span className="text-sm text-red-800">
                        {categoria.getFechaBaja()?.toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Imagen y subcategorías */}
          <div className="space-y-6">
            {/* Imagen */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-green-600" />
                Imagen de la Categoría
              </h4>

              <div className="bg-white rounded-lg p-4 border">
                {!imageError && getImageUrl(categoria) ? (
                  <div className="space-y-3">
                    <img
                      src={getImageUrl(categoria) || "/placeholder.svg"}
                      alt={categoria.getNombre()}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={handleImageError}
                    />
                    <div className="text-xs text-gray-500 break-all">
                      <strong>URL:</strong> {getImageUrl(categoria)}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="h-16 w-16 mb-2" />
                    <p className="text-sm">Sin imagen asignada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Subcategorías */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FolderIcon className="h-5 w-5 mr-2 text-orange-600" />
                Subcategorías ({subcategorias.length})
              </h4>

              <div className="bg-white rounded-lg border">
                {subcategorias.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {subcategorias.map((sub, index) => (
                      <div key={sub.getIdCategoria()} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <img
                            src={sub.getImagenDto()?.getUrl() || "/placeholder.svg?height=32&width=32"}
                            alt={sub.getNombre()}
                            className="h-8 w-8 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">{sub.getNombre()}</span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  sub.isActiva() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {sub.isActiva() ? "Activa" : "Inactiva"}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 space-x-4">
                              <span className="text-xs text-gray-500">ID: {sub.getIdCategoria()}</span>
                              <span className="text-xs text-gray-500">
                                Margen: {sub.getMargenGanancia().toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <SubdirectoryArrowRightIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Esta categoría no tiene subcategorías</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
            <InfoIcon className="h-4 w-4 mr-2" />
            Información Adicional
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <div className="font-medium">Jerarquía</div>
              <div className="text-xs mt-1">
                {categoria.esCategoriaPadre()
                  ? `Categoría principal con ${subcategorias.length} subcategoría${subcategorias.length !== 1 ? "s" : ""}`
                  : `Subcategoría de "${categoriaPadre?.getNombre() || "Desconocida"}"`}
              </div>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <div className="font-medium">Rentabilidad</div>
              <div className="text-xs mt-1">
                Margen de ganancia del {categoria.getMargenGanancia().toFixed(2)}% aplicado a productos
              </div>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <div className="font-medium">Visibilidad</div>
              <div className="text-xs mt-1">
                {categoria.isActiva()
                  ? "Visible para clientes en el catálogo"
                  : "Oculta para clientes, solo visible en administración"}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de cerrar */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
