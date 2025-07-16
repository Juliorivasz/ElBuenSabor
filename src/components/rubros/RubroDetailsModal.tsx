"use client"

import CloseIcon from "@mui/icons-material/Close"
import FolderIcon from "@mui/icons-material/Folder"
import InfoIcon from "@mui/icons-material/Info"
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight"
import type { RubroInsumoDto } from "../../models/dto/RubroInsumoDto"

interface RubroDetailsModalProps {
  rubro: RubroInsumoDto
  rubros: RubroInsumoDto[]
  onClose: () => void
}

export const RubroDetailsModal = ({ rubro, rubros, onClose }: RubroDetailsModalProps) => {
  // Obtener todos los rubros de forma plana para buscar relaciones
  const obtenerTodosLosRubros = (rubrosLista: RubroInsumoDto[]): RubroInsumoDto[] => {
    const todosLosRubros: RubroInsumoDto[] = []

    const procesarRubros = (rubros: RubroInsumoDto[]) => {
      rubros.forEach((rubro) => {
        todosLosRubros.push(rubro)
        if (rubro.getSubrubros().length > 0) {
          procesarRubros(rubro.getSubrubros())
        }
      })
    }

    procesarRubros(rubrosLista)
    return todosLosRubros
  }

  const todosLosRubros = obtenerTodosLosRubros(rubros)

  // Obtener subrubros directos
  const subrubrosDirectos = todosLosRubros.filter((r) => r.getIdRubroInsumoPadre() === rubro.getIdRubroInsumo())

  // Obtener rubro padre
  const rubroPadre = rubro.esRubroPadre()
    ? null
    : todosLosRubros.find((r) => r.getIdRubroInsumo() === rubro.getIdRubroInsumoPadre())

  // Función recursiva para contar todos los subrubros
  const contarSubrubrosRecursivo = (rubroId: number): number => {
    const subrubros = todosLosRubros.filter((r) => r.getIdRubroInsumoPadre() === rubroId)
    let count = subrubros.length

    subrubros.forEach((subrubro) => {
      count += contarSubrubrosRecursivo(subrubro.getIdRubroInsumo())
    })

    return count
  }

  const totalSubrubros = contarSubrubrosRecursivo(rubro.getIdRubroInsumo())

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 border w-11/12 max-w-3xl shadow-xl rounded-lg bg-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                {rubro.esRubroPadre() ? (
                  <FolderIcon className="h-8 w-8 text-orange-600" />
                ) : (
                  <SubdirectoryArrowRightIcon className="h-8 w-8 text-orange-600" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{rubro.getNombre()}</h3>
              <div className="flex items-center mt-2 space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    rubro.isActivo()
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${rubro.isActivo() ? "bg-green-400" : "bg-red-400"}`}
                  ></span>
                  {rubro.isActivo() ? "Activo" : "Inactivo"}
                </span>
                <span className="text-sm text-gray-500">ID: {rubro.getIdRubroInsumo()}</span>
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
                  <p className="text-sm text-gray-900 bg-white p-3 rounded border">{rubro.getNombre()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Rubro</label>
                  <div className="bg-white p-3 rounded border">
                    {rubro.esRubroPadre() ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <FolderIcon className="h-4 w-4 mr-2" />
                        Rubro Principal
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <SubdirectoryArrowRightIcon className="h-4 w-4 mr-2" />
                        Subrubro
                      </span>
                    )}
                  </div>
                </div>

                {!rubro.esRubroPadre() && rubroPadre && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rubro Padre</label>
                    <div className="bg-white p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <FolderIcon className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{rubroPadre.getNombre()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-sm text-gray-900">
                      {rubro.isActivo()
                        ? "Rubro activo y visible en el sistema"
                        : "Rubro inactivo, no visible en el sistema"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jerarquía y subrubros */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FolderIcon className="h-5 w-5 mr-2 text-green-600" />
                Jerarquía y Subrubros
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subrubros Directos</label>
                  <div className="bg-white p-3 rounded border">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {subrubrosDirectos.length} subrubro{subrubrosDirectos.length !== 1 ? "s" : ""} directo
                      {subrubrosDirectos.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total de Subrubros (Recursivo)</label>
                  <div className="bg-white p-3 rounded border">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                      {totalSubrubros} subrubro{totalSubrubros !== 1 ? "s" : ""} en total
                    </span>
                  </div>
                </div>

                {subrubrosDirectos.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Lista de Subrubros Directos</label>
                    <div className="bg-white rounded-lg border max-h-48 overflow-y-auto">
                      <div className="divide-y divide-gray-200">
                        {subrubrosDirectos.map((subrubro) => (
                          <div key={subrubro.getIdRubroInsumo()} className="p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                  <SubdirectoryArrowRightIcon className="h-3 w-3 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{subrubro.getNombre()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    subrubro.isActivo() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {subrubro.isActivo() ? "Activo" : "Inactivo"}
                                </span>
                                <span className="text-xs text-gray-500">ID: {subrubro.getIdRubroInsumo()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {subrubrosDirectos.length === 0 && (
                  <div className="bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center">
                    <SubdirectoryArrowRightIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">Este rubro no tiene subrubros directos</p>
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
                {rubro.esRubroPadre()
                  ? `Rubro principal con ${totalSubrubros} subrubro${totalSubrubros !== 1 ? "s" : ""}`
                  : `Subrubro de "${rubroPadre?.getNombre() || "Desconocido"}"`}
              </div>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <div className="font-medium">Organización</div>
              <div className="text-xs mt-1">Los rubros organizan y categorizan los insumos del sistema</div>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <div className="font-medium">Visibilidad</div>
              <div className="text-xs mt-1">
                {rubro.isActivo()
                  ? "Visible en el sistema para organizar insumos"
                  : "Oculto en el sistema, solo visible en administración"}
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
