import { useState, useEffect } from "react";
import { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto";
import { InformacionArticuloNoElaboradoDto } from "../../../models/dto/InformacionArticuloNoElaboradoDto";
import type { CategoriaDTO } from "../../../models/dto/CategoriaDTO";
import type { InsumoDTO } from "../../../models/dto/InsumoDTO";
import { InformacionDetalleDto } from "../../../models/dto/InformacionDetalleDto";

type ProductUnion = InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto;

interface UniversalProductFormProps {
  product?: ProductUnion;
  categories: CategoriaDTO[];
  ingredients?: InsumoDTO[]; // Solo para manufacturados
  onSubmit: (product: ProductUnion) => void;
  onCancel: () => void;
  loading: boolean;
  type: "manufacturado" | "noElaborado";
}

interface FormData {
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioModificado: boolean; // Cambiado a boolean para representar checkbox
  idCategoria: number;
  idSubcategoria: number; // Separamos categoría y subcategoría
  imagenUrl: string;
  // Campos específicos para manufacturados
  receta?: string;
  tiempoDeCocina?: number;
  detalles?: Array<{
    idArticuloInsumo: number;
    cantidad: number;
  }>;
}

export const UniversalProductForm: React.FC<UniversalProductFormProps> = ({
  product,
  categories,
  ingredients = [],
  onSubmit,
  onCancel,
  loading,
  type,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    precioVenta: 0,
    precioModificado: true, // Por defecto es precio manual
    idCategoria: 0,
    idSubcategoria: 0,
    imagenUrl: "",
    receta: "",
    tiempoDeCocina: 0,
    detalles: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"general" | "detalles">("general");
  const [availableSubcategories, setAvailableSubcategories] = useState<CategoriaDTO[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(0);
  const [costoTotal, setCostoTotal] = useState<number>(0);
  const [margenGanancia, setMargenGanancia] = useState<number>(1);

  // Obtener categorías principales y subcategorías
  const mainCategories = categories.filter((cat) => cat.getIdCategoriaPadre() === 0 || !cat.getIdCategoriaPadre());

  // Calcular precio sugerido basado en ingredientes (solo para manufacturados)
  useEffect(() => {
    if (type === "manufacturado" && formData.detalles && formData.detalles.length > 0) {
      // Por ahora, usar un precio base fijo o lógica alternativa
      // ya que no tenemos acceso a precios de ingredientes

      setMargenGanancia(2);
      const basePrice = calcularPrecioSugerido();
      setSuggestedPrice(basePrice);

      // Si no es precio modificado (es sugerido), actualizar el precio automáticamente
      if (!formData.precioModificado) {
        setFormData((prev) => ({ ...prev, precioVenta: basePrice }));
      }
    } else {
      setSuggestedPrice(0);
    }
  }, [formData.detalles, formData.precioModificado, type]);

  // Obtener subcategorías de la categoría seleccionada
  useEffect(() => {
    if (formData.idCategoria > 0) {
      // Buscar subcategorías que tengan como padre la categoría seleccionada
      const subcategories = categories.filter((cat) => cat.getIdCategoriaPadre() === formData.idCategoria);
      setAvailableSubcategories(subcategories);
    } else {
      setAvailableSubcategories([]);
    }
  }, [formData.idCategoria, categories]);

  // Determinar si un ID de categoría es una subcategoría
  const isSubcategory = (categoryId: number): boolean => {
    const category = categories.find((cat) => cat.getIdCategoria() === categoryId);
    return category ? category.getIdCategoriaPadre() !== 0 && !!category.getIdCategoriaPadre() : false;
  };

  // Obtener el ID de la categoría padre de una subcategoría
  const getParentCategoryId = (subcategoryId: number): number => {
    const subcategory = categories.find((cat) => cat.getIdCategoria() === subcategoryId);
    return subcategory ? subcategory.getIdCategoriaPadre() || 0 : 0;
  };

  // Cargar datos del producto para edición
  useEffect(() => {
    if (product) {
      let productCategoryId = 0;
      let productSubcategoryId = 0;

      if (type === "manufacturado") {
        const manufacturado = product as InformacionArticuloManufacturadoDto;
        productCategoryId = manufacturado.getIdCategoria();

        // Determinar si la categoría del producto es una subcategoría
        if (isSubcategory(productCategoryId)) {
          productSubcategoryId = productCategoryId;
          productCategoryId = getParentCategoryId(productCategoryId);
        }

        setFormData({
          nombre: manufacturado.getNombre(),
          descripcion: manufacturado.getDescripcion(),
          precioVenta: manufacturado.getPrecioVenta(),
          precioModificado: manufacturado.getPrecioModificado(),
          idCategoria: productCategoryId,
          idSubcategoria: productSubcategoryId,
          imagenUrl: manufacturado.getImagenUrl() || "",
          receta: manufacturado.getReceta(),
          tiempoDeCocina: manufacturado.getTiempoDeCocina(),
          detalles: manufacturado.getDetalles().map((detalle) => ({
            idArticuloInsumo: detalle.getIdArticuloInsumo(),
            cantidad: detalle.getCantidad(),
          })),
        });
      } else {
        const noElaborado = product as InformacionArticuloNoElaboradoDto;
        productCategoryId = noElaborado.getIdCategoria();

        // Determinar si la categoría del producto es una subcategoría
        if (isSubcategory(productCategoryId)) {
          productSubcategoryId = productCategoryId;
          productCategoryId = getParentCategoryId(productCategoryId);
        }

        setFormData({
          nombre: noElaborado.getNombre(),
          descripcion: noElaborado.getDescripcion(),
          precioVenta: noElaborado.getPrecioVenta(),
          precioModificado: noElaborado.getPrecioModificado(),
          idCategoria: productCategoryId,
          idSubcategoria: productSubcategoryId,
          imagenUrl: noElaborado.getImagenDto()?.getUrl() || "",
          detalles: [],
        });
      }
    }
  }, [product, type, categories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (formData.precioModificado && formData.precioVenta <= 0) {
      newErrors.precioVenta = "El precio debe ser mayor a 0";
    }

    if (formData.idCategoria === 0) {
      newErrors.idCategoria = "Debe seleccionar una categoría";
    }

    if (!formData.imagenUrl.trim()) {
      newErrors.imagenUrl = "La URL de la imagen es requerida";
    }

    if (type === "manufacturado") {
      if (!formData.tiempoDeCocina || formData.tiempoDeCocina <= 0) {
        newErrors.tiempoDeCocina = "El tiempo de cocina debe ser mayor a 0";
      }

      if (!formData.receta?.trim()) {
        newErrors.receta = "La receta es requerida";
      }

      if (!formData.detalles || formData.detalles.length === 0) {
        newErrors.detalles = "Debe agregar al menos un ingrediente";
      }

      // Validar que todos los ingredientes tengan valores válidos
      formData.detalles?.forEach((detalle, index) => {
        if (detalle.idArticuloInsumo === 0) {
          newErrors[`detalle_${index}_insumo`] = "Debe seleccionar un ingrediente";
        }
        if (detalle.cantidad <= 0) {
          newErrors[`detalle_${index}_cantidad`] = "La cantidad debe ser mayor a 0";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Determinar la categoría final (categoría principal o subcategoría)
    const finalCategoryId = formData.idSubcategoria > 0 ? formData.idSubcategoria : formData.idCategoria;
    const selectedCategory = categories.find((cat) => cat.getIdCategoria() === finalCategoryId);
    const imagenUrl = formData.imagenUrl;

    // Determinar el precio final según si es manual o sugerido
    const finalPrice = formData.precioModificado ? formData.precioVenta : suggestedPrice;

    if (type === "manufacturado") {
      const detalles =
        formData.detalles?.map((detalle) => {
          const insumo = ingredients.find((ing) => ing.getIdArticuloInsumo() === detalle.idArticuloInsumo);
          return new InformacionDetalleDto(
            detalle.idArticuloInsumo,
            insumo?.getNombre() || "",
            insumo?.getUnidadDeMedida() || "",
            detalle.cantidad,
          );
        }) || [];

      const productData = new InformacionArticuloManufacturadoDto(
        (product as InformacionArticuloManufacturadoDto)?.getidArticulo() || 0,
        formData.nombre,
        formData.descripcion,
        finalPrice,
        formData.precioModificado, // precioModificado
        formData.receta || "",
        formData.tiempoDeCocina || 0,
        true, // dadoDeAlta
        finalCategoryId,
        selectedCategory?.getNombre() || "",
        imagenUrl,
        detalles,
      );

      onSubmit(productData);
    } else {
      const productData = new InformacionArticuloNoElaboradoDto(
        (product as InformacionArticuloNoElaboradoDto)?.getIdArticulo() || 0,
        formData.nombre,
        formData.descripcion,
        finalPrice,
        formData.precioModificado, // precioModificado
        true, // dadoDeAlta
        finalCategoryId,
        selectedCategory?.getNombre() || "",
        null, //arreglar esto
      );

      onSubmit(productData);
    }
  };

  const calcularPrecioSugerido = (): number => {
    if (!formData.detalles || !formData.idCategoria) return 0;

    // const margen = formData.categoria.margenGanancia || 1;
    const margen = margenGanancia;

    const costoTotal = formData.detalles.reduce((acc, detalle) => {
      const insumo = ingredients.find((i) => i.getIdArticuloInsumo() === detalle.idArticuloInsumo);
      const precio = insumo?.getCosto() || 0;
      return acc + detalle.cantidad * precio;
    }, 0);
    setCostoTotal(costoTotal);

    return costoTotal * margen;
  };

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePriceTypeChange = (isPrecioModificado: boolean) => {
    setFormData((prev) => ({
      ...prev,
      precioModificado: isPrecioModificado,
      // Si cambia a sugerido, actualizar el precio con el sugerido
      precioVenta: !isPrecioModificado ? suggestedPrice : prev.precioVenta,
    }));
    if (errors.precioTipo) {
      setErrors((prev) => ({ ...prev, precioTipo: "" }));
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      idCategoria: categoryId,
      idSubcategoria: 0, // Resetear subcategoría al cambiar categoría
    }));
    if (errors.idCategoria) {
      setErrors((prev) => ({ ...prev, idCategoria: "" }));
    }
  };

  const handleSubcategoryChange = (subcategoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      idSubcategoria: subcategoryId,
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [...(prev.detalles || []), { idArticuloInsumo: 0, cantidad: 0 }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles?.filter((_, i) => i !== index) || [],
    }));
    // Limpiar errores relacionados con este ingrediente
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`detalle_${index}_insumo`];
      delete newErrors[`detalle_${index}_cantidad`];
      return newErrors;
    });
  };

  const updateIngredient = (index: number, field: "idArticuloInsumo" | "cantidad", value: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles?.map((detalle, i) => (i === index ? { ...detalle, [field]: value } : detalle)) || [],
    }));
    // Limpiar error específico
    if (errors[`detalle_${index}_${field === "idArticuloInsumo" ? "insumo" : "cantidad"}`]) {
      setErrors((prev) => ({
        ...prev,
        [`detalle_${index}_${field === "idArticuloInsumo" ? "insumo" : "cantidad"}`]: "",
      }));
    }
  };

  const isManufacturado = type === "manufacturado";
  const title = product
    ? `Editar Producto ${isManufacturado ? "Manufacturado" : "No Elaborado"}`
    : `Nuevo Producto ${isManufacturado ? "Manufacturado" : "No Elaborado"}`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Tabs para productos manufacturados */}
        {isManufacturado && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("general")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "general"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                Información General
              </button>
              <button
                onClick={() => setActiveTab("detalles")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "detalles"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                Ingredientes
                {formData.detalles && formData.detalles.length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-800 py-0.5 px-2 rounded-full text-xs">
                    {formData.detalles.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-black">
          {/* Información General */}
          {(!isManufacturado || activeTab === "general") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nombre del producto"
                    disabled={loading}
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.descripcion ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Descripción del producto"
                    disabled={loading}
                  />
                  {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                </div>

                {/* Tipo de Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="precioManual"
                      checked={formData.precioModificado}
                      onChange={(e) => handlePriceTypeChange(e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      disabled={loading}
                    />
                    <label
                      htmlFor="precioManual"
                      className="text-sm text-gray-700">
                      Manual
                    </label>
                  </div>

                  {/* Precio de Venta - Solo visible si es precio manual */}
                  {formData.precioModificado ? (
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precioVenta === 0 ? "" : formData.precioVenta}
                        onChange={(e) => handleInputChange("precioVenta", Number.parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.precioVenta ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="0.00"
                        disabled={loading}
                      />
                      {errors.precioVenta && <p className="text-red-500 text-sm mt-1">{errors.precioVenta}</p>}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p>
                        Precio sugerido: ${suggestedPrice.toFixed(2)}
                        {isManufacturado ? (
                          <span className="block text-xs mt-1">
                            Basado en costo de ingredientes + {(margenGanancia - 1) * 100}% de margen
                          </span>
                        ) : (
                          <span className="block text-xs mt-1">
                            Basado en la falta de ingredientes <br />({" "}
                            <strong>se recomienda colocar un precio manual</strong> )
                          </span>
                        )}
                      </p>
                      {errors.precioTipo && <p className="text-red-500 text-sm mt-1">{errors.precioTipo}</p>}
                    </div>
                  )}
                </div>

                {/* Campos específicos para manufacturados */}
                {isManufacturado && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiempo de Cocina (minutos) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.tiempoDeCocina === 0 ? "" : formData.tiempoDeCocina}
                        onChange={(e) => handleInputChange("tiempoDeCocina", Number.parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.tiempoDeCocina ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="30"
                        disabled={loading}
                      />
                      {errors.tiempoDeCocina && <p className="text-red-500 text-sm mt-1">{errors.tiempoDeCocina}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Receta *</label>
                      <textarea
                        value={formData.receta || ""}
                        onChange={(e) => handleInputChange("receta", e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.receta ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Instrucciones de la receta..."
                        disabled={loading}
                      />
                      {errors.receta && <p className="text-red-500 text-sm mt-1">{errors.receta}</p>}
                    </div>
                  </>
                )}
              </div>

              {/* Columna Derecha */}
              <div className="space-y-4">
                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select
                    value={formData.idCategoria}
                    onChange={(e) => handleCategoryChange(Number.parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.idCategoria ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}>
                    <option value={0}>Seleccionar categoría</option>
                    {mainCategories.map((category) => (
                      <option
                        key={category.getIdCategoria()}
                        value={category.getIdCategoria()}>
                        {category.getNombre()}
                      </option>
                    ))}
                  </select>
                  {errors.idCategoria && <p className="text-red-500 text-sm mt-1">{errors.idCategoria}</p>}
                </div>

                {/* Subcategoría - Solo se muestra si hay subcategorías disponibles */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategoría
                      <span className="text-xs text-gray-500 ml-1">
                        ({availableSubcategories.length} disponible{availableSubcategories.length !== 1 ? "s" : ""})
                      </span>
                    </label>
                    <select
                      value={formData.idSubcategoria}
                      onChange={(e) => handleSubcategoryChange(Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={loading}>
                      <option value={0}>Usar categoría principal</option>
                      {availableSubcategories.map((subcategory) => (
                        <option
                          key={subcategory.getIdCategoria()}
                          value={subcategory.getIdCategoria()}>
                          {subcategory.getNombre()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* URL de Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen *</label>
                  <input
                    type="url"
                    value={formData.imagenUrl}
                    onChange={(e) => handleInputChange("imagenUrl", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.imagenUrl ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={loading}
                  />
                  {errors.imagenUrl && <p className="text-red-500 text-sm mt-1">{errors.imagenUrl}</p>}
                </div>

                {/* Preview de imagen */}
                {formData.imagenUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vista Previa</label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img
                        src={formData.imagenUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg?height=192&width=300";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ingredientes (solo para manufacturados) */}
          {isManufacturado && activeTab === "detalles" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Ingredientes</h4>
                  {!formData.precioModificado && (
                    <p className="text-sm text-gray-600">
                      Los cambios en ingredientes actualizarán el precio automáticamente
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  disabled={loading}>
                  Agregar Ingrediente
                </button>
              </div>

              {errors.detalles && <p className="text-red-500 text-sm">{errors.detalles}</p>}

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {formData.detalles?.map((detalle, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <select
                        value={detalle.idArticuloInsumo}
                        onChange={(e) => updateIngredient(index, "idArticuloInsumo", Number.parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors[`detalle_${index}_insumo`] ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}>
                        <option value={0}>Seleccionar ingrediente</option>
                        {ingredients.map((ingredient) => (
                          <option
                            key={ingredient.getIdArticuloInsumo()}
                            value={ingredient.getIdArticuloInsumo()}>
                            {ingredient.getNombre()} ({ingredient.getUnidadDeMedida()})
                          </option>
                        ))}
                      </select>
                      {errors[`detalle_${index}_insumo`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`detalle_${index}_insumo`]}</p>
                      )}
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={detalle.cantidad === 0 ? "" : detalle.cantidad}
                        onChange={(e) => updateIngredient(index, "cantidad", Number.parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors[`detalle_${index}_cantidad`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Cantidad"
                        disabled={loading}
                      />
                      {errors[`detalle_${index}_cantidad`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`detalle_${index}_cantidad`]}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                      disabled={loading}>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                {(!formData.detalles || formData.detalles.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <p className="mt-2">No hay ingredientes agregados</p>
                    <p className="text-sm">Haz clic en "Agregar Ingrediente" para comenzar</p>
                  </div>
                )}
              </div>

              {/* Resumen de costos para precio sugerido */}
              {!formData.precioModificado && formData.detalles && formData.detalles.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">Cálculo de Precio Sugerido</h5>
                  <div className="text-sm text-blue-800">
                    <p>Costo total de ingredientes: ${costoTotal.toFixed(2)}</p>
                    <p>
                      Margen de ganancia ({`${(margenGanancia - 1) * 100}%`}): $
                      {(suggestedPrice - suggestedPrice / margenGanancia).toFixed(2)}
                    </p>
                    <p className="font-medium">Precio sugerido: ${suggestedPrice.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={loading}>
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading}>
              {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
