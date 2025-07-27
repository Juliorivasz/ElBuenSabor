"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { RubroInsumoDto } from "../../models/dto/RubroInsumoDto";
import { NuevoRubroInsumoDto } from "../../models/dto/NuevoRubroInsumoDto";

interface RubroFormData {
  nombre: string;
  dadoDeBaja: boolean;
  tieneRubroPadre: boolean;
  idRubroInsumoPadre: number | null;
}

interface RubroFormProps {
  rubro?: RubroInsumoDto;
  rubros: RubroInsumoDto[];
  onSubmit: (rubro: NuevoRubroInsumoDto) => void;
  onCancel: () => void;
  loading: boolean;
  rubroPadrePreseleccionado?: RubroInsumoDto;
}

export const RubroForm = ({
  rubro,
  rubros,
  onSubmit,
  onCancel,
  loading,
  rubroPadrePreseleccionado,
}: RubroFormProps) => {
  const [tieneRubroPadre, setTieneRubroPadre] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RubroFormData>({
    defaultValues: {
      nombre: "",
      dadoDeBaja: false,
      tieneRubroPadre: false,
      idRubroInsumoPadre: null,
    },
  });

  const watchTieneRubroPadre = watch("tieneRubroPadre");

  // Cargar datos si es edición
  useEffect(() => {
    if (rubro) {
      const data = {
        nombre: rubro.getNombre(),
        dadoDeBaja: rubro.isDadoDeAlta(),
        tieneRubroPadre: !rubro.esRubroPadre(),
        idRubroInsumoPadre: rubro.getIdRubroInsumoPadre(),
      };
      reset(data);
      setTieneRubroPadre(!rubro.esRubroPadre());
    } else if (rubroPadrePreseleccionado) {
      // Si se está creando un subrubro
      const data = {
        nombre: "",
        dadoDeBaja: false,
        tieneRubroPadre: true,
        idRubroInsumoPadre: rubroPadrePreseleccionado.getIdRubroInsumo(),
      };
      reset(data);
      setTieneRubroPadre(true);
    }
  }, [rubro, rubroPadrePreseleccionado, reset]);

  // Actualizar estado cuando cambia el checkbox
  useEffect(() => {
    setTieneRubroPadre(watchTieneRubroPadre);
    if (!watchTieneRubroPadre) {
      setValue("idRubroInsumoPadre", null);
    }
  }, [watchTieneRubroPadre, setValue]);

  // Obtener todos los rubros disponibles como padre (recursivamente)
  const obtenerTodosLosRubros = (rubrosLista: RubroInsumoDto[]): RubroInsumoDto[] => {
    const todosLosRubros: RubroInsumoDto[] = [];

    const procesarRubros = (rubros: RubroInsumoDto[]) => {
      rubros.forEach((rubro) => {
        todosLosRubros.push(rubro);
        if (rubro.getSubrubros().length > 0) {
          procesarRubros(rubro.getSubrubros());
        }
      });
    };

    procesarRubros(rubrosLista);
    return todosLosRubros;
  };

  const todosLosRubros = obtenerTodosLosRubros(rubros);

  // Filtrar rubros disponibles como padre
  const rubrosDisponibles = todosLosRubros.filter((r) => {
    if (rubro) {
      // No puede ser padre de sí mismo
      if (r.getIdRubroInsumo() === rubro.getIdRubroInsumo()) return false;
      // No puede ser padre de su propio padre
      if (r.getIdRubroInsumoPadre() === rubro.getIdRubroInsumo()) return false;
    }
    return true;
  });

  const onFormSubmit = async (data: RubroFormData) => {
    try {
      const nuevoRubro = new NuevoRubroInsumoDto(
        data.nombre,
        data.dadoDeBaja,
        data.tieneRubroPadre ? data.idRubroInsumoPadre : null,
      );

      await onSubmit(nuevoRubro);
    } catch (error) {
      console.error("Error en formulario:", error);
    }
  };

  const isEditing = !!rubro;
  const title = isEditing ? "Editar Rubro" : rubroPadrePreseleccionado ? "Nuevo Subrubro" : "Nuevo Rubro";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border w-11/12 max-w-2xl shadow-xl rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing
                ? "Modifica los datos del rubro"
                : rubroPadrePreseleccionado
                ? `Crear subrubro de "${rubroPadrePreseleccionado.getNombre()}"`
                : "Completa la información para crear un nuevo rubro"}
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
                placeholder="Ej: Carnes, Verduras, Lácteos..."
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

            {/* Estado */}
            <div className="mb-4">
              <label className="flex items-center p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  {...register("dadoDeBaja")}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Rubro inactivo</span>
                  <p className="text-xs text-gray-500">Los rubros inactivos no serán visibles en el sistema</p>
                </div>
              </label>
            </div>

            {/* Checkbox: ¿Tiene rubro padre? */}
            {!rubroPadrePreseleccionado && (
              <div className="mb-4">
                <label className="flex items-center p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("tieneRubroPadre")}
                    className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700">¿Tiene rubro padre?</span>
                    <p className="text-xs text-gray-500">Marca esta opción si este rubro es un subrubro de otro</p>
                  </div>
                </label>
              </div>
            )}

            {/* Select de rubro padre */}
            {(tieneRubroPadre || rubroPadrePreseleccionado) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rubro Padre *</label>
                <select
                  {...register("idRubroInsumoPadre", {
                    required: tieneRubroPadre ? "Debe seleccionar un rubro padre" : false,
                    setValueAs: (value) => {
                      if (value === "" || value === "null" || value === null) {
                        return null;
                      }
                      return Number(value);
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-900 bg-white ${
                    errors.idRubroInsumoPadre ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  disabled={loading || !!rubroPadrePreseleccionado}>
                  <option
                    value=""
                    className="text-gray-900">
                    Seleccionar rubro padre...
                  </option>
                  {rubrosDisponibles.map((r) => (
                    <option
                      key={r.getIdRubroInsumo()}
                      value={r.getIdRubroInsumo()}
                      className="text-gray-900">
                      {r.getNombre()}
                    </option>
                  ))}
                </select>
                {errors.idRubroInsumoPadre && (
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
                    {errors.idRubroInsumoPadre.message}
                  </p>
                )}
                {rubroPadrePreseleccionado && (
                  <p className="text-xs text-blue-600 mt-1">
                    Rubro padre preseleccionado: {rubroPadrePreseleccionado.getNombre()}
                  </p>
                )}
              </div>
            )}
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
              Información sobre Rubros
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Los rubros principales no tienen rubro padre
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Los subrubros deben tener un rubro padre
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Los rubros pueden tener múltiples niveles de jerarquía
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Los rubros inactivos no son visibles en el sistema
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Se pueden crear subrubros de subrubros
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Los rubros organizan los insumos del sistema
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
