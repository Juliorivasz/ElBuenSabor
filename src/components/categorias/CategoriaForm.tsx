/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { CategoriaExtendidaDto } from "../../models/dto/CategoriaExtendidaDto";
import { NuevaCategoriaDto } from "../../models/dto/NuevaCategoriaDto";
import { NotificationService } from "../../utils/notifications";

interface CategoriaFormData {
  nombre: string;
  margenGanancia: number;
  dadoDeAlta: boolean;
  idCategoriaPadre: number | null;
}

interface CategoriaFormProps {
  categoria?: CategoriaExtendidaDto;
  categorias: CategoriaExtendidaDto[];
  onSubmit: (categoria: NuevaCategoriaDto, archivo?: File) => void;
  onCancel: () => void;
  loading: boolean;
}

interface CategoryTreeItem {
  category: CategoriaExtendidaDto;
  level: number;
}

export const CategoriaForm = ({ categoria, categorias, onSubmit, onCancel, loading }: CategoriaFormProps) => {
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CategoriaFormData>({
    defaultValues: {
      nombre: "",
      margenGanancia: categoria?.getMargenGanancia() ?? 0,
      dadoDeAlta: true,
      idCategoriaPadre: null,
    },
  });
  const watchIdCategoriaPadre = watch("idCategoriaPadre");

  // Función para construir el árbol jerárquico de categorías para el selector
  const buildCategoryTree = (
    categories: CategoriaExtendidaDto[],
    parentId = 0,
    level = 0,
    excludeId?: number,
  ): CategoryTreeItem[] => {
    const result: CategoryTreeItem[] = [];
    const children = categories
      .filter((cat) => {
        // Filtrar por categoría padre
        const isChild = cat.getIdCategoriaPadre() === parentId;
        // Excluir la categoría que se está editando para evitar referencias circulares
        const notExcluded = !excludeId || cat.getIdCategoria() !== excludeId;
        return isChild && notExcluded;
      })
      .sort((a, b) => a.getNombre().localeCompare(b.getNombre()));

    for (const child of children) {
      // Limitar la profundidad máxima a 4 niveles
      if (level < 4) {
        result.push({ category: child, level });
        result.push(...buildCategoryTree(categories, child.getIdCategoria(), level + 1, excludeId));
      }
    }

    return result;
  };

  // Construir el árbol de categorías disponibles (incluye activas e inactivas)
  const categoryTree = buildCategoryTree(
    categorias,
    0,
    0,
    categoria?.getIdCategoria(), // Excluir la categoría actual si se está editando
  );

  // Función para verificar si una categoría padre está inactiva
  const isParentInactive = (parentId: number | null): boolean => {
    if (!parentId) return false;
    const parent = categorias.find((cat) => cat.getIdCategoria() === parentId);
    return parent ? !parent.isActiva() : false;
  };

  // Cargar datos si es edición
  useEffect(() => {
    if (categoria) {
      const data = {
        nombre: categoria.getNombre(),
        margenGanancia: categoria.getMargenGanancia() * 100, // Convertir a porcentaje para mostrar
        dadoDeAlta: categoria.isActiva(),
        idCategoriaPadre: categoria.getIdCategoriaPadre() || null,
      };
      reset(data);
      setSelectedParentId(categoria.getIdCategoriaPadre() || null);
    }
  }, [categoria, reset]);

  // Efecto para manejar el estado automático basado en la categoría padre
  useEffect(() => {
    const parentId = watchIdCategoriaPadre;
    setSelectedParentId(parentId);

    // Si no estamos editando una categoría existente
    if (!categoria) {
      if (isParentInactive(parentId)) {
        // Si el padre está inactivo, desactivar automáticamente la nueva categoría
        setValue("dadoDeAlta", false);
        NotificationService.info(
          "La categoría se ha marcado como inactiva automáticamente porque la categoría padre seleccionada está inactiva.",
          "Estado automático",
        );
      } else {
        // Si el padre está activo o no hay padre, activar la categoría
        setValue("dadoDeAlta", true);
      }
    }
  }, [watchIdCategoriaPadre, categoria, setValue, categorias]);

  const onFormSubmit = async (data: CategoriaFormData) => {
    try {
      const nuevaCategoria = new NuevaCategoriaDto(
        data.nombre,
        data.margenGanancia / 100, // Convertir porcentaje a decimal para el backend
        data.dadoDeAlta,
        data.idCategoriaPadre,
      );

      // No pasar el archivo ya que se subió a Cloudinary
      await onSubmit(nuevaCategoria);
    } catch (error) {
      console.error("Error en formulario:", error);
      NotificationService.error(error instanceof Error ? error.message : "Error al guardar la categoría");
    }
  };

  const isEditing = !!categoria;
  const title = isEditing ? "Editar Categoría" : "Nueva Categoría";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border w-11/12 max-w-4xl shadow-xl rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing
                ? "Modifica los datos de la categoría"
                : "Completa la información para crear una nueva categoría"}
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
          className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda - Información Básica */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h4>

                {/* Nombre */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría *</label>
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
                    placeholder="Ej: Hamburguesas, Bebidas, Postres..."
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
              </div>

              {/* Margen de Ganancia */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Margen de Ganancia (%) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    {...register("margenGanancia", {
                      required: "El margen de ganancia es requerido",
                      min: {
                        value: 0,
                        message: "El margen debe ser mayor o igual a 0",
                      },
                      max: {
                        value: 200,
                        message: "El margen no puede exceder 200%",
                      },
                      valueAsNumber: true,
                    })}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-900 bg-white ${
                      errors.margenGanancia ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                </div>
                {errors.margenGanancia && (
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
                    {errors.margenGanancia.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Este porcentaje se aplicará como margen de ganancia a los productos de esta categoría
                </p>
              </div>

              {/* Categoría Padre - Selector Jerárquico */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría Padre</label>
                <select
                  {...register("idCategoriaPadre", {
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
                    (Categoría principal)
                  </option>
                  {categoryTree.map(({ category, level }) => {
                    const isInactive = !category.isActiva();
                    return (
                      <option
                        key={category.getIdCategoria()}
                        value={category.getIdCategoria()}
                        className={`text-gray-900 ${isInactive ? "text-gray-500" : ""}`}
                        style={{ paddingLeft: `${level * 20}px` }}>
                        {"  ".repeat(level)}
                        {level > 0 && "└─ "}
                        {category.getNombre()}
                        {level === 0 && " (Principal)"}
                        {level === 1 && " (Subcategoría)"}
                        {level >= 2 && ` (Nivel ${level + 1})`}
                        {isInactive && " [INACTIVA]"}
                      </option>
                    );
                  })}
                </select>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>• Deja vacío para crear una categoría principal</p>
                  <p>• Puedes crear hasta 4 niveles de jerarquía</p>
                  <p>• Puedes seleccionar categorías activas o inactivas como padre</p>
                  <p>• Ejemplo: Bebidas → Con Alcohol → Cervezas → Artesanales</p>
                  {categoria && (
                    <p className="text-blue-600">ℹ️ No puedes seleccionar la categoría actual como padre</p>
                  )}
                  {selectedParentId && isParentInactive(selectedParentId) && !categoria && (
                    <p className="text-amber-600">
                      ⚠️ La categoría padre seleccionada está inactiva. La nueva categoría se marcará como inactiva
                      automáticamente.
                    </p>
                  )}
                  {categoryTree.length === 0 && (
                    <p className="text-amber-600">
                      ⚠️ No hay categorías disponibles. Esta será una categoría principal.
                    </p>
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
                    disabled={loading || (!categoria && isParentInactive(selectedParentId))}
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Categoría activa</span>
                    <p className="text-xs text-gray-500">
                      Las categorías inactivas no serán visibles para los clientes
                    </p>
                    {!categoria && isParentInactive(selectedParentId) && (
                      <p className="text-xs text-amber-600 mt-1">
                        Estado automático: inactiva porque la categoría padre está inactiva
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Columna Derecha - Información sobre Categorías Jerárquicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 self-start sticky top-6">
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
                Información sobre Categorías Jerárquicas
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Puedes crear hasta 4 niveles de jerarquía.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  El margen de ganancia se aplica automáticamente a los productos de esta categoría.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Las categorías inactivas no son visibles para los clientes.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Si la categoría padre está inactiva, la nueva subcategoría se marcará automáticamente como inactiva.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  El selector jerárquico muestra las categorías con una indentación para reflejar su estructura.
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
                </>
              ) : (
                <>{isEditing ? "Actualizar Categoría" : "Crear Categoría"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
