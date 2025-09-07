"use client";

import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ListIcon from "@mui/icons-material/List";
import type { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto";

interface RubroInsumoDetailsModalProps {
  rubro: RubroInsumoAbmDto;
  rubros: RubroInsumoAbmDto[];
  onClose: () => void;
}

export const RubroInsumoDetailsModal = ({ rubro, rubros, onClose }: RubroInsumoDetailsModalProps) => {
  const subrubros = rubros.filter((r) => r.getIdRubroPadre() === rubro.getIdRubroInsumo());
  const rubroPadre = rubro.esRubroPadre() ? null : rubros.find((r) => r.getIdRubroInsumo() === rubro.getIdRubroPadre());

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 border w-11/12 max-w-3xl shadow-xl rounded-lg bg-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                <FolderIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{rubro.getNombre()}</h3>
              <div className="flex items-center mt-2 space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    rubro.isDadoDeAlta()
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}>
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      rubro.isDadoDeAlta() ? "bg-green-400" : "bg-red-400"
                    }`}></span>
                  {rubro.isDadoDeAlta() ? "Activo" : "Inactivo"}
                </span>
                <span className="text-sm text-gray-500">ID: {rubro.getIdRubroInsumo()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
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
                        <FolderIcon className="h-8 w-8 text-orange-600" />
                        <span className="text-sm text-gray-900 font-medium">{rubroPadre.getNombre()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-sm text-gray-900">
                      {rubro.isDadoDeAlta()
                        ? "Rubro activo y disponible para asignar a insumos"
                        : "Rubro inactivo, no disponible para nuevas asignaciones"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Insumos</label>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-sm text-gray-900 font-medium">
                      {rubro.getCantInsumos()} insumo{rubro.getCantInsumos() !== 1 ? "s" : ""} asignado
                      {rubro.getCantInsumos() !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insumos y subrubros */}
          <div className="space-y-6">
            {/* Insumos */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ListIcon className="h-5 w-5 mr-2 text-green-600" />
                Insumos Asignados ({rubro.getCantInsumos()})
              </h4>

              <div className="bg-white rounded-lg border">
                {rubro.getInsumos().length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {rubro.getInsumos().map((insumo, index) => (
                      <div
                        key={index}
                        className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-green-800">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{insumo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <ListIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Este rubro no tiene insumos asignados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Subrubros */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FolderIcon className="h-5 w-5 mr-2 text-orange-600" />
                Subrubros ({subrubros.length})
              </h4>

              <div className="bg-white rounded-lg border">
                {subrubros.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {subrubros.map((subrubro) => (
                      <div
                        key={subrubro.getIdRubroInsumo()}
                        className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FolderIcon className="h-8 w-8 text-orange-600" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900">{subrubro.getNombre()}</span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  subrubro.isDadoDeAlta() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                {subrubro.isDadoDeAlta() ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 space-x-4">
                              <span className="text-xs text-gray-500">ID: {subrubro.getIdRubroInsumo()}</span>
                              <span className="text-xs text-gray-500">
                                {subrubro.getCantInsumos()} insumo{subrubro.getCantInsumos() !== 1 ? "s" : ""}
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
                    <p className="text-sm">Este rubro no tiene subrubros</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
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
                  ? `Rubro principal con ${subrubros.length} subrubro${subrubros.length !== 1 ? "s" : ""}`
                  : `Subrubro de "${rubroPadre?.getNombre() || "Desconocido"}"`}
              </div>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <div className="font-medium">Insumos</div>
              <div className="text-xs mt-1">
                {rubro.getCantInsumos()} insumo{rubro.getCantInsumos() !== 1 ? "s" : ""} asignado
                {rubro.getCantInsumos() !== 1 ? "s" : ""} a este rubro
              </div>
            </div>
            <div className="bg-white bg-opacity-50 p-3 rounded">
              <div className="font-medium">Estado</div>
              <div className="text-xs mt-1">
                {rubro.isDadoDeAlta()
                  ? "Disponible para asignar a nuevos insumos"
                  : "No disponible para nuevas asignaciones"}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de cerrar */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
