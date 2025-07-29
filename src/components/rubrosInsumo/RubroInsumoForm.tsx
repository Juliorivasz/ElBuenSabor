"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { RubroInsumoAbmDto } from "../../models/dto/RubroInsumoAbmDto";
import { NuevoRubroInsumoDto } from "../../models/dto/NuevoRubroInsumoDto";
import { useRubrosInsumoStore } from "../../store/rubrosInsumo/useRubrosInsumoStore";
import { NotificationService } from "../../utils/notifications";

interface RubroInsumoFormData {
  nombre: string;
  dadoDeAlta: boolean;
  idRubroInsumoPadre: number | null;
}

interface RubroInsumoFormProps {
  rubro?: RubroInsumoAbmDto;
  onSubmit: (rubro: NuevoRubroInsumoDto) => void;
  onCancel: () => void;
  loading: boolean;
}

interface RubroTreeItem {
  rubro: RubroInsumoAbmDto;
  level: number;
}

export const RubroInsumoForm = ({ rubro, onSubmit, onCancel, loading }: RubroInsumoFormProps) => {
  const { rubros, fetchRubrosLista } = useRubrosInsumoStore();
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RubroInsumoFormData>({
    defaultValues: {
      nombre: "",
      dadoDeAlta: true,
      idRubroInsumoPadre: null,
    },
  });

  const watchIdRubroInsumoPadre = watch("idRubroInsumoPadre");

  // Función para construir el árbol jerárquico de rubros para el selector
  const buildRubroTree = (
    rubrosData: RubroInsumoAbmDto[],
    parentId = 0,
    level = 0,
    excludeId?: number,
  ): RubroTreeItem[] => {
    const result: RubroTreeItem[] = [];
    const children = rubrosData
      .filter((r) => {
        const isChild = (r.getIdRubroPadre() || 0) === parentId;
        const notExcluded = !excludeId || r.getIdRubroInsumo() !== excludeId;
        return isChild && notExcluded;
      })
      .sort((a, b) => a.getNombre().localeCompare(b.getNombre()));

    for (const child of children) {
      if (level < 4) {
        result.push({ rubro: child, level });
        result.push(...buildRubroTree(rubrosData, child.getIdRubroInsumo(), level + 1, excludeId));
      }
    }

    return result;
  };

  // Construir el árbol de rubros disponibles
  const rubroTree = buildRubroTree(
    rubros,
    0,
    0,
    rubro?.getIdRubroInsumo(), // Excluir el rubro actual si se está editando
  );

  // Función para verificar si un rubro padre está inactivo
  const isParentInactive = (parentId: number | null): boolean => {
    if (!parentId) return false;
    const parent = rubros.find((r) => r.getIdRubroInsumo() === parentId);
    return parent ? !parent.isDadoDeAlta() : false;
  };

  // Cargar datos si es edición
  useEffect(() => {
    if (rubro) {
      const data = {
        nombre: rubro.getNombre(),
        dadoDeAlta: rubro.isDadoDeAlta(),
        idRubroInsumoPadre: rubro.getIdRubroPadre(),
      };
      reset(data);
      setSelectedParentId(rubro.getIdRubroPadre());
    }
  }, [rubro, reset]);

  // Cargar lista de rubros para el selector
  useEffect(() => {
    fetchRubrosLista();
  }, [fetchRubrosLista]);

  // Efecto para manejar el estado automático basado en el rubro padre
  useEffect(() => {
    const parentId = watchIdRubroInsumoPadre;
    setSelectedParentId(parentId);

    // Si no estamos editando un rubro existente
    if (!rubro) {
      if (isParentInactive(parentId)) {
        setValue("dadoDeAlta", false);
        NotificationService.info(
          "El rubro se ha marcado como inactivo automáticamente porque el rubro padre seleccionado está inactivo.",
          "Estado automático",
        );
      } else {
        setValue("dadoDeAlta", true);
      }
    }
  }, [watchIdRubroInsumoPadre, rubro, setValue, rubros]);

  const onFormSubmit = async (data: RubroInsumoFormData) => {
    try {
      const nuevoRubro = new NuevoRubroInsumoDto(data.nombre, data.dadoDeAlta, data.idRubroInsumoPadre);

      await onSubmit(nuevoRubro);
    } catch (error) {
      console.error("Error en formulario:", error);
      NotificationService.error(error instanceof Error ? error.message : "Error al guardar el rubro");
    }
  };

  const isEditing = !!rubro;
  const title = isEditing ? "Editar Rubro" : "Nuevo Rubro";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border w-11/12 max-w-2xl shadow-xl rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing ? "Modifica los datos del rubro" : "Completa la información para crear un nuevo rubro"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            disabled={loading}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Rubro</h4>

            {/* Nombre */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Rubro *</label>
              <input
                type="text"
                {...register("nombre", {
                  required: "El nombre es requerido",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 50,
                    message: "El nombre no puede exceder 50 caracteres",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-900 bg-white ${
                  errors.nombre ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Ej: Lácteos, Carnes, Verduras..."
                disabled={loading}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Rubro Padre - Selector Jerárquico */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rubro Padre</label>
              <select
                {...register("idRubroInsumoPadre", {
                  setValueAs: (value) => {
                    if (value === "" || value === "null" || value === null) {
                      return null;
                    }
                    return Number(value);
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-900 bg-white"
                disabled={loading}>
                <option
                  value=""
                  className="text-gray-900">
                  (Rubro principal)
                </option>
                {rubroTree.map(({ rubro: rubroItem, level }) => {
                  const isInactive = !rubroItem.isDadoDeAlta();
                  return (
                    <option
                      key={rubroItem.getIdRubroInsumo()}
                      value={rubroItem.getIdRubroInsumo()}
                      className={`text-gray-900 ${isInactive ? "text-gray-500" : ""}`}
                      style={{ paddingLeft: `${level * 20}px` }}>
                      {"  ".repeat(level)}
                      {level > 0 && "└─ "}
                      {rubroItem.getNombre()}
                      {level === 0 && " (Principal)"}
                      {level === 1 && " (Subrubro)"}
                      {level >= 2 && ` (Nivel ${level + 1})`}
                      {isInactive && " [INACTIVO]"}
                    </option>
                  );
                })}
              </select>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p>• Deja vacío para crear un rubro principal</p>
                <p>• Puedes crear hasta 4 niveles de jerarquía</p>
                <p>• Puedes seleccionar rubros activos o inactivos como padre</p>
                {rubro && <p className="text-blue-600">ℹ️ No puedes seleccionar el rubro actual como padre</p>}
                {selectedParentId && isParentInactive(selectedParentId) && !rubro && (
                  <p className="text-amber-600">
                    ⚠️ El rubro padre seleccionado está inactivo. El nuevo rubro se marcará como inactivo
                    automáticamente.
                  </p>
                )}
                {rubroTree.length === 0 && (
                  <p className="text-amber-600">⚠️ No hay rubros disponibles. Este será un rubro principal.</p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="flex items-center p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register("dadoDeAlta")}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  disabled={loading || (!rubro && isParentInactive(selectedParentId))}
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Rubro activo</span>
                  <p className="text-xs text-gray-500">
                    Los rubros inactivos no estarán disponibles para asignar a nuevos insumos
                  </p>
                  {!rubro && isParentInactive(selectedParentId) && (
                    <p className="text-xs text-amber-600 mt-1">
                      Estado automático: inactivo porque el rubro padre está inactivo
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Información sobre Rubros Jerárquicos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Puedes crear hasta 4 niveles de jerarquía
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Los rubros organizan los insumos por categorías
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Puedes seleccionar cualquier rubro como padre (activo o inactivo)
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Ejemplo: Lácteos → Quesos → Quesos Duros
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Los rubros inactivos no están disponibles para nuevos insumos
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Si el padre está inactivo, el nuevo rubro será inactivo automáticamente
                </li>
              </ul>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={loading}>
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              disabled={loading}>
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>{isEditing ? "Actualizar Rubro" : "Crear Rubro"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
