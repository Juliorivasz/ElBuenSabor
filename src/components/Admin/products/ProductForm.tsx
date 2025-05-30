// Archivo corregido de ProductForm.tsx con manejo seguro para objetos planos o clases

"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { ArticuloManufacturado } from "../../../models/ArticuloManufacturado";
import { ArticuloManufacturadoDetalle } from "../../../models/ArticuloManufacturadoDetalle";
import type { Categoria } from "../../../models/Categoria";
import type { ArticuloInsumo } from "../../../models/ArticuloInsumo";
import { NuevoArticuloManufacturadoDto } from "../../../models/dto/NuevoArticuloManufacturadoDto";

interface ProductFormProps {
  product?: ArticuloManufacturado;
  categories: Categoria[];
  ingredients: ArticuloInsumo[];
  onSubmit: (product: NuevoArticuloManufacturadoDto) => void;
  onCancel: () => void;
  loading: boolean;
}

interface FormData {
  nombre: string;
  descripcion: string;
  precioVenta: number;
  receta: string;
  tiempoDeCocina: number;
  categoriaId: number;
  subcategoriaId: number;
  urlImagen: string;
  ingredientes: { insumoId: number; cantidad: number }[];
}

interface FormErrors {
  nombre?: string;
  descripcion?: string;
  precioVenta?: string;
  receta?: string;
  tiempoDeCocina?: string;
  categoriaId?: string;
  subcategoriaId?: string;
  ingredientes?: string;
}

// Interfaces para manejar categorías
interface CategoriaSimple {
  id: number;
  nombre: string;
}

// Función auxiliar para verificar si una categoría es padre
const esCategoriaPadre = (categoria: Categoria): boolean => {
  const padre = categoria.getcategoriaPadre();
  return padre === null || padre === undefined;
};

// Función para obtener el ID de una categoría
const getCategoriaId = (categoria: Categoria): number => {
  return categoria.getcategoriaId();
};

// Función para obtener el nombre de una categoría
const getCategoriaNombre = (categoria: Categoria): string => {
  return categoria.getcategoriaNombre();
};

// Función para obtener la categoría padre de una categoría
const getCategoriaPadre = (categoria: Categoria): Categoria | null => {
  return categoria.getcategoriaPadre();
};

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  ingredients,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    precioVenta: 0,
    receta: "",
    tiempoDeCocina: 0,
    categoriaId: 0,
    subcategoriaId: 0,
    urlImagen: "",
    ingredientes: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Debug: Mostrar las categorías en consola
  useEffect(() => {
    console.log("=== DEBUG CATEGORÍAS ===");
    console.log("Total categorías recibidas:", categories.length);
    categories.forEach((cat, index) => {
      const padre = getCategoriaPadre(cat);
      console.log(`Categoría ${index}:`, {
        id: getCategoriaId(cat),
        nombre: getCategoriaNombre(cat),
        esPadre: esCategoriaPadre(cat),
        categoriaPadre: padre
          ? {
              id: getCategoriaId(padre),
              nombre: getCategoriaNombre(padre),
            }
          : null,
      });
    });
  }, [categories]);

  // Procesar categorías y subcategorías
  const { categoriasPadre, subcategoriasPorPadre } = useMemo(() => {
    console.log("=== PROCESANDO CATEGORÍAS ===");

    const padres: CategoriaSimple[] = [];
    const hijasPorPadre: Map<number, CategoriaSimple[]> = new Map();

    // Primero identificamos todas las categorías padre
    categories.forEach((categoria) => {
      if (esCategoriaPadre(categoria)) {
        const id = getCategoriaId(categoria);
        const nombre = getCategoriaNombre(categoria);

        padres.push({ id, nombre });
        console.log(`✅ Categoría padre agregada: ${nombre} (ID: ${id})`);
      }
    });

    // Luego procesamos las subcategorías
    categories.forEach((categoria) => {
      if (!esCategoriaPadre(categoria)) {
        const categoriaPadre = getCategoriaPadre(categoria);
        if (categoriaPadre) {
          const padreId = getCategoriaId(categoriaPadre);
          const id = getCategoriaId(categoria);
          const nombre = getCategoriaNombre(categoria);
          const nombrePadre = getCategoriaNombre(categoriaPadre);

          if (!hijasPorPadre.has(padreId)) {
            hijasPorPadre.set(padreId, []);
          }

          hijasPorPadre.get(padreId)?.push({ id, nombre });
          console.log(`✅ Subcategoría agregada: ${nombre} (ID: ${id}) → Padre: ${nombrePadre} (ID: ${padreId})`);
        }
      }
    });

    console.log("=== RESULTADO PROCESAMIENTO ===");
    console.log("Categorías padre:", padres);
    console.log("Subcategorías por padre:", Object.fromEntries(hijasPorPadre));

    return {
      categoriasPadre: padres,
      subcategoriasPorPadre: hijasPorPadre,
    };
  }, [categories]);

  // Obtener subcategorías para la categoría seleccionada
  const subcategoriasActuales = useMemo(() => {
    const subcategorias = subcategoriasPorPadre.get(formData.categoriaId) || [];
    console.log(`Subcategorías para categoría ${formData.categoriaId}:`, subcategorias);
    return subcategorias;
  }, [subcategoriasPorPadre, formData.categoriaId]);

  useEffect(() => {
    if (product) {
      const categoria = product.getCategoria();
      let categoriaId = 0;
      let subcategoriaId = 0;

      if (categoria) {
        const catId = getCategoriaId(categoria);

        if (!esCategoriaPadre(categoria)) {
          // Es una subcategoría
          const categoriaPadre = getCategoriaPadre(categoria);
          if (categoriaPadre) {
            categoriaId = getCategoriaId(categoriaPadre);
            subcategoriaId = catId;
          }
        } else {
          // Es una categoría padre
          categoriaId = catId;
        }
      }

      setFormData({
        nombre: product.getNombre(),
        descripcion: product.getDescripcion(),
        precioVenta: product.getPrecioVenta(),
        receta: product.getReceta(),
        tiempoDeCocina: product.getTiempoDeCocina(),
        categoriaId,
        subcategoriaId,
        urlImagen: product.getUrlImagen(),
        ingredientes:
          product.getDetalles()?.map((detalle: any) => {
            const articuloInsumo =
              typeof detalle.getArticuloInsumo === "function" ? detalle.getArticuloInsumo() : detalle.articuloInsumo;

            const cantidad = typeof detalle.getCantidad === "function" ? detalle.getCantidad() : detalle.cantidad;

            return {
              insumoId:
                typeof articuloInsumo?.getIdInsumo === "function"
                  ? articuloInsumo.getIdInsumo()
                  : articuloInsumo?.id || 0,
              cantidad: cantidad || 0,
            };
          }) || [],
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida";
    if (formData.precioVenta <= 0) newErrors.precioVenta = "El precio debe ser mayor a 0";
    if (!formData.receta.trim()) newErrors.receta = "La receta es requerida";
    if (formData.tiempoDeCocina <= 0) newErrors.tiempoDeCocina = "El tiempo de cocina debe ser mayor a 0";
    if (formData.categoriaId === 0) newErrors.categoriaId = "Debe seleccionar una categoría";
    if (subcategoriasActuales.length > 0 && formData.subcategoriaId === 0) {
      newErrors.subcategoriaId = "Debe seleccionar una subcategoría";
    }
    if (formData.ingredientes.length === 0) newErrors.ingredientes = "Debe agregar al menos un ingrediente";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Buscar la categoría final (subcategoría si existe, sino la categoría padre)
    const finalCategoryId = formData.subcategoriaId || formData.categoriaId;
    const selectedCategory = categories.find((cat) => {
      return getCategoriaId(cat) === finalCategoryId;
    });

    if (!selectedCategory) return;

    const detalles = formData.ingredientes
      .map((ing) => {
        const insumo = ingredients.find((i) => (i as any).id === ing.insumoId);
        if (!insumo) return null;
        return new ArticuloManufacturadoDetalle(0, ing.cantidad, null as any, insumo);
      })
      .filter(Boolean) as ArticuloManufacturadoDetalle[];

    const productData = new ArticuloManufacturado(
      product?.getIdArticulo() || 0,
      formData.nombre,
      formData.descripcion,
      formData.precioVenta,
      formData.receta,
      formData.tiempoDeCocina,
      detalles,
      selectedCategory,
      formData.urlImagen,
    );

    onSubmit(productData);
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: [...prev.ingredientes, { insumoId: 0, cantidad: 1 }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, field: "insumoId" | "cantidad", value: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    }));
  };

  const handleCategoriaChange = (categoriaId: number) => {
    console.log(`Cambiando categoría a: ${categoriaId}`);
    setFormData((prev) => ({
      ...prev,
      categoriaId,
      subcategoriaId: 0, // Reset subcategoría cuando cambia la categoría
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{product ? "Editar Producto" : "Nuevo Producto"}</h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio de Venta *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precioVenta}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, precioVenta: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
                {errors.precioVenta && <p className="mt-1 text-sm text-red-600">{errors.precioVenta}</p>}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría *</label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => handleCategoriaChange(Number.parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900">
                  <option value={0}>Seleccionar categoría</option>
                  {categoriasPadre.map((categoria) => (
                    <option
                      key={`categoria-${categoria.id}`}
                      value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoriaId && <p className="mt-1 text-sm text-red-600">{errors.categoriaId}</p>}
              </div>

              {/* Subcategoría - Solo se muestra si hay subcategorías disponibles */}
              {subcategoriasActuales.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subcategoría *</label>
                  <select
                    value={formData.subcategoriaId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, subcategoriaId: Number.parseInt(e.target.value) }))
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900">
                    <option value={0}>Seleccionar subcategoría</option>
                    {subcategoriasActuales.map((subcategoria) => (
                      <option
                        key={`subcategoria-${subcategoria.id}`}
                        value={subcategoria.id}>
                        {subcategoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.subcategoriaId && <p className="mt-1 text-sm text-red-600">{errors.subcategoriaId}</p>}
                </div>
              )}

              {/* Tiempo de Cocina */}
              <div className={subcategoriasActuales.length > 0 ? "" : "md:col-span-2"}>
                <label className="block text-sm font-medium text-gray-700">Tiempo de Cocina (minutos) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.tiempoDeCocina}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tiempoDeCocina: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
                {errors.tiempoDeCocina && <p className="mt-1 text-sm text-red-600">{errors.tiempoDeCocina}</p>}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción *</label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
            </div>

            {/* Receta */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Receta *</label>
              <textarea
                rows={4}
                value={formData.receta}
                onChange={(e) => setFormData((prev) => ({ ...prev, receta: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder="Describe los pasos para preparar este producto..."
              />
              {errors.receta && <p className="mt-1 text-sm text-red-600">{errors.receta}</p>}
            </div>

            {/* URL Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700">URL de Imagen (opcional)</label>
              <input
                type="url"
                value={formData.urlImagen}
                onChange={(e) => setFormData((prev) => ({ ...prev, urlImagen: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            {/* Ingredientes */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Ingredientes *</label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600">
                  Agregar Ingrediente
                </button>
              </div>

              {formData.ingredientes.map((ingrediente, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center mb-2">
                  <select
                    value={ingrediente.insumoId}
                    onChange={(e) => updateIngredient(index, "insumoId", Number.parseInt(e.target.value))}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900">
                    <option value={0}>Seleccionar ingrediente</option>
                    {ingredients.map((ingredient, index) => {
                      const id = ingredient.getIdInsumo ? ingredient.getIdInsumo() : (ingredient as any).id || index;
                      const nombre = ingredient.getNombre
                        ? ingredient.getNombre()
                        : (ingredient as any).nombre || "Sin nombre";
                      return (
                        <option
                          key={`ingredient-${id}`}
                          value={id}>
                          {nombre}
                        </option>
                      );
                    })}
                  </select>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={ingrediente.cantidad}
                    onChange={(e) => updateIngredient(index, "cantidad", Number.parseFloat(e.target.value) || 0)}
                    className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    placeholder="Cant."
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-600 hover:text-red-800 px-2">
                    ✕
                  </button>
                </div>
              ))}

              {errors.ingredientes && <p className="mt-1 text-sm text-red-600">{errors.ingredientes}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50">
                {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
