"use client"

import type React from "react"

import { useState, useEffect, type FC } from "react"
import { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto"
import { InformacionArticuloNoElaboradoDto } from "../../../models/dto/InformacionArticuloNoElaboradoDto"
import type { CategoriaDTO } from "../../../models/dto/CategoriaDTO"
import type { InsumoDTO } from "../../../models/dto/InsumoDTO"
import { InformacionDetalleDto } from "../../../models/dto/InformacionDetalleDto"

type ProductUnion = InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto

interface UniversalProductFormProps {
  product?: ProductUnion
  categories: CategoriaDTO[]
  ingredients?: InsumoDTO[] // Solo para manufacturados
  onSubmit: (product: ProductUnion, file?: File) => void
  onCancel: () => void
  loading: boolean
  type: "manufacturado" | "noElaborado"
}

interface FormData {
  nombre: string
  descripcion: string
  precioVenta: number
  precioModificado: boolean // Cambiado a boolean para representar checkbox
  idCategoria: number
  idSubcategoria: number // Separamos categoría y subcategoría
  imagenUrl: string
  // Campos específicos para manufacturados
  receta?: string
  tiempoDeCocina?: number
  detalles?: Array<{
    idArticuloInsumo: number
    cantidad: number
  }>
}

export const UniversalProductForm: FC<UniversalProductFormProps> = ({
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
    precioModificado: true,
    idCategoria: 0,
    idSubcategoria: 0,
    imagenUrl: "",
    receta: "",
    tiempoDeCocina: 0,
    detalles: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<"general" | "detalles">("general")
  const [availableSubcategories, setAvailableSubcategories] = useState<CategoriaDTO[]>([])
  const [suggestedPrice, setSuggestedPrice] = useState<number>(0)
  const [costoTotal, setCostoTotal] = useState<number>(0)
  const [margenGanancia, setMargenGanancia] = useState<number>(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageSource, setImageSource] = useState<"url" | "file">("url")

  // Obtener categorías principales y subcategorías
  const mainCategories = categories.filter((cat) => cat.getIdCategoriaPadre() === 0 || !cat.getIdCategoriaPadre())

  // Calcular precio sugerido basado en ingredientes (solo para manufacturados)
  useEffect(() => {
    if (type === "manufacturado" && formData.detalles && formData.detalles.length > 0) {
      // Por ahora, usar un precio base fijo o lógica alternativa
      // ya que no tenemos acceso a precios de ingredientes

      setMargenGanancia(2)
      const basePrice = calcularPrecioSugerido()
      setSuggestedPrice(basePrice)

      // Si no es precio modificado (es sugerido), actualizar el precio automáticamente
      if (!formData.precioModificado) {
        setFormData((prev) => ({ ...prev, precioVenta: basePrice }))
      }
    } else {
      setSuggestedPrice(0)
    }
  }, [formData.detalles, formData.precioModificado, type])

  // Obtener subcategorías de la categoría seleccionada
  useEffect(() => {
    if (formData.idCategoria > 0) {
      // Buscar subcategorías que tengan como padre la categoría seleccionada
      const subcategories = categories.filter((cat) => cat.getIdCategoriaPadre() === formData.idCategoria)
      setAvailableSubcategories(subcategories)
    } else {
      setAvailableSubcategories([])
    }
  }, [formData.idCategoria, categories])

  // Determinar si un ID de categoría es una subcategoría
  const isSubcategory = (categoryId: number): boolean => {
    const category = categories.find((cat) => cat.getIdCategoria() === categoryId)
    return category ? category.getIdCategoriaPadre() !== 0 && !!category.getIdCategoriaPadre() : false
  }

  // Obtener el ID de la categoría padre de una subcategoría
  const getParentCategoryId = (subcategoryId: number): number => {
    const subcategory = categories.find((cat) => cat.getIdCategoria() === subcategoryId)
    return subcategory ? subcategory.getIdCategoriaPadre() || 0 : 0
  }

  // Cargar datos del producto para edición
  useEffect(() => {
    if (product) {
      let productCategoryId = 0
      let productSubcategoryId = 0

      if (type === "manufacturado") {
        const manufacturado = product as InformacionArticuloManufacturadoDto
        productCategoryId = manufacturado.getIdCategoria()

        // Determinar si la categoría del producto es una subcategoría
        if (isSubcategory(productCategoryId)) {
          productSubcategoryId = productCategoryId
          productCategoryId = getParentCategoryId(productCategoryId)
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
        })
      } else {
        const noElaborado = product as InformacionArticuloNoElaboradoDto
        productCategoryId = noElaborado.getIdCategoria()

        // Determinar si la categoría del producto es una subcategoría
        if (isSubcategory(productCategoryId)) {
          productSubcategoryId = productCategoryId
          productCategoryId = getParentCategoryId(productCategoryId)
        }

        setFormData({
          nombre: noElaborado.getNombre(),
          descripcion: noElaborado.getDescripcion(),
          precioVenta: noElaborado.getPrecioVenta(),
          precioModificado: noElaborado.getPrecioModificado(),
          idCategoria: productCategoryId,
          idSubcategoria: productSubcategoryId,
          imagenUrl: noElaborado.getImagenUrl() || "",
          detalles: [],
        })
      }
    }
  }, [product, type, categories])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida"
    }

    if (formData.precioModificado && formData.precioVenta <= 0) {
      newErrors.precioVenta = "El precio debe ser mayor a 0"
    }

    if (formData.idCategoria === 0) {
      newErrors.idCategoria = "Debe seleccionar una categoría"
    }

    // Validar imagen: debe tener URL o archivo seleccionado
    if (imageSource === "url" && !formData.imagenUrl.trim()) {
      newErrors.imagenUrl = "La URL de la imagen es requerida"
    }

    if (imageSource === "file" && !selectedFile && !product) {
      newErrors.file = "Debe seleccionar un archivo de imagen"
    }

    if (type === "manufacturado") {
      if (!formData.tiempoDeCocina || formData.tiempoDeCocina <= 0) {
        newErrors.tiempoDeCocina = "El tiempo de cocina debe ser mayor a 0"
      }

      if (!formData.receta?.trim()) {
        newErrors.receta = "La receta es requerida"
      }

      if (!formData.detalles || formData.detalles.length === 0) {
        newErrors.detalles = "Debe agregar al menos un ingrediente"
      }

      // Validar que todos los ingredientes tengan valores válidos
      formData.detalles?.forEach((detalle, index) => {
        if (detalle.idArticuloInsumo === 0) {
          newErrors[`detalle_${index}_insumo`] = "Debe seleccionar un ingrediente"
        }
        if (detalle.cantidad <= 0) {
          newErrors[`detalle_${index}_cantidad`] = "La cantidad debe ser mayor a 0"
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleSubmit function to ensure it passes the file:
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Determine the category final (main category or subcategory)
    const finalCategoryId = formData.idSubcategoria > 0 ? formData.idSubcategoria : formData.idCategoria
    const selectedCategory = categories.find((cat) => cat.getIdCategoria() === finalCategoryId)

    // Use URL only if no file selected
    const imagenUrl = imageSource === "file" ? "" : formData.imagenUrl

    // Determine the price final according to whether it is manual or suggested
    const finalPrice = formData.precioModificado ? formData.precioVenta : suggestedPrice

    if (type === "manufacturado") {
      const detalles =
        formData.detalles?.map((detalle) => {
          const insumo = ingredients.find((ing) => ing.getIdArticuloInsumo() === detalle.idArticuloInsumo)
          return new InformacionDetalleDto(
            detalle.idArticuloInsumo,
            insumo?.getNombre() || "",
            insumo?.getUnidadDeMedida() || "",
            detalle.cantidad,
          )
        }) || []

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
      )

      // Pass the file only if imageSource is "file" and a file is selected
      onSubmit(productData, imageSource === "file" ? selectedFile || undefined : undefined)
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
        imagenUrl, //arreglar esto
      )

      // Pass the file only if imageSource is "file" and a file is selected
      onSubmit(productData, imageSource === "file" ? selectedFile || undefined : undefined)
    }
  }

  const calcularPrecioSugerido = (): number => {
    if (!formData.detalles || !formData.idCategoria) return 0

    // const margen = formData.categoria.margenGanancia || 1;
    const margen = margenGanancia

    const costoTotal = formData.detalles.reduce((acc, detalle) => {
      const insumo = ingredients.find((i) => i.getIdArticuloInsumo() === detalle.idArticuloInsumo)
      const precio = insumo?.getCosto() || 0
      return acc + detalle.cantidad * precio
    }, 0)
    setCostoTotal(costoTotal)

    return costoTotal * margen
  }

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePriceTypeChange = (isPrecioModificado: boolean) => {
    setFormData((prev) => ({
      ...prev,
      precioModificado: isPrecioModificado,
      // Si cambia a sugerido, actualizar el precio con el sugerido
      precioVenta: !isPrecioModificado ? suggestedPrice : prev.precioVenta,
    }))
    if (errors.precioTipo) {
      setErrors((prev) => ({ ...prev, precioTipo: "" }))
    }
  }

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      idCategoria: categoryId,
      idSubcategoria: 0, // Resetear subcategoría al cambiar categoría
    }))
    if (errors.idCategoria) {
      setErrors((prev) => ({ ...prev, idCategoria: "" }))
    }
  }

  const handleSubcategoryChange = (subcategoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      idSubcategoria: subcategoryId,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: "" }))
      }
    }
  }

  const handleImageSourceChange = (source: "url" | "file") => {
    setImageSource(source)
    setSelectedFile(null)
    setFormData((prev) => ({ ...prev, imagenUrl: "" }))
    // Limpiar errores relacionados con imagen
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.imagenUrl
      delete newErrors.file
      return newErrors
    })
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [...(prev.detalles || []), { idArticuloInsumo: 0, cantidad: 0 }],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles?.filter((_, i) => i !== index) || [],
    }))
    // Limpiar errores relacionados con este ingrediente
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`detalle_${index}_insumo`]
      delete newErrors[`detalle_${index}_cantidad`]
      return newErrors
    })
  }

  const updateIngredient = (index: number, field: "idArticuloInsumo" | "cantidad", value: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles?.map((detalle, i) => (i === index ? { ...detalle, [field]: value } : detalle)) || [],
    }))
    // Limpiar error específico
    if (errors[`detalle_${index}_${field === "idArticuloInsumo" ? "insumo" : "cantidad"}`]) {
      setErrors((prev) => ({
        ...prev,
        [`detalle_${index}_${field === "idArticuloInsumo" ? "insumo" : "cantidad"}`]: "",
      }))
    }
  }

  const isManufacturado = type === "manufacturado"
  const title = product
    ? `Editar Producto ${isManufacturado ? "Manufacturado" : "No Elaborado"}`
    : `Nuevo Producto ${isManufacturado ? "Manufacturado" : "No Elaborado"}`

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
                }`}
              >
                Información General
              </button>
              <button
                onClick={() => setActiveTab("detalles")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "detalles"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
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

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
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
                    <label htmlFor="precioManual" className="text-sm text-gray-700">
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
                        placeholder="Instrucciones de preparación..."
                        disabled={loading}
                      />
                      {errors.receta && <p className="text-red-500 text-sm mt-1">{errors.receta}</p>}
                    </div>
                  </>
                )}
              </div>

              {/* Columna Derecha */}
              <div className="space-y-4">
                {/* Categoría Principal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría Principal *</label>
                  <select
                    value={formData.idCategoria}
                    onChange={(e) => handleCategoryChange(Number.parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.idCategoria ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  >
                    <option value={0}>Seleccionar categoría</option>
                    {mainCategories.map((category) => (
                      <option key={category.getIdCategoria()} value={category.getIdCategoria()}>
                        {category.getNombre()}
                      </option>
                    ))}
                  </select>
                  {errors.idCategoria && <p className="text-red-500 text-sm mt-1">{errors.idCategoria}</p>}
                </div>

                {/* Subcategoría (opcional) */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría (opcional)</label>
                    <select
                      value={formData.idSubcategoria}
                      onChange={(e) => handleSubcategoryChange(Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={loading}
                    >
                      <option value={0}>Sin subcategoría</option>
                      {availableSubcategories.map((subcategory) => (
                        <option key={subcategory.getIdCategoria()} value={subcategory.getIdCategoria()}>
                          {subcategory.getNombre()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagen *</label>

                  {/* Selector de tipo de imagen */}
                  <div className="flex space-x-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="imageSource"
                        value="url"
                        checked={imageSource === "url"}
                        onChange={() => handleImageSourceChange("url")}
                        className="mr-2"
                        disabled={loading}
                      />
                      URL
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="imageSource"
                        value="file"
                        checked={imageSource === "file"}
                        onChange={() => handleImageSourceChange("file")}
                        className="mr-2"
                        disabled={loading}
                      />
                      Archivo
                    </label>
                  </div>

                  {/* Campo de URL */}
                  {imageSource === "url" && (
                    <div>
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
                  )}

                  {/* Campo de archivo */}
                  {imageSource === "file" && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors.file ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                      {selectedFile && (
                        <p className="text-sm text-gray-600 mt-1">Archivo seleccionado: {selectedFile.name}</p>
                      )}
                    </div>
                  )}

                  {/* Vista previa de imagen */}
                  {((imageSource === "url" && formData.imagenUrl) ||
                    (imageSource === "file" && selectedFile) ||
                    (product &&
                      (product as ProductUnion).getImagenUrl?.() &&
                      !selectedFile &&
                      imageSource === "url")) && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                      <img
                        src={
                          imageSource === "file" && selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : imageSource === "url" && formData.imagenUrl
                              ? formData.imagenUrl
                              : (product as ProductUnion)?.getImagenUrl?.() || ""
                        }
                        alt="Vista previa"
                        className="w-32 h-32 object-cover rounded-md border border-gray-300"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab de Ingredientes (solo para manufacturados) */}
          {isManufacturado && activeTab === "detalles" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Ingredientes</h4>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                  disabled={loading}
                >
                  Agregar Ingrediente
                </button>
              </div>

              {errors.detalles && <p className="text-red-500 text-sm">{errors.detalles}</p>}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {formData.detalles?.map((detalle, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                    <div className="flex-1">
                      <select
                        value={detalle.idArticuloInsumo}
                        onChange={(e) => updateIngredient(index, "idArticuloInsumo", Number.parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors[`detalle_${index}_insumo`] ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      >
                        <option value={0}>Seleccionar ingrediente</option>
                        {ingredients.map((ingredient) => (
                          <option key={ingredient.getIdArticuloInsumo()} value={ingredient.getIdArticuloInsumo()}>
                            {ingredient.getNombre()} ({ingredient.getUnidadDeMedida()})
                          </option>
                        ))}
                      </select>
                      {errors[`detalle_${index}_insumo`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`detalle_${index}_insumo`]}</p>
                      )}
                    </div>

                    <div className="w-24">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={detalle.cantidad === 0 ? "" : detalle.cantidad}
                        onChange={(e) => updateIngredient(index, "cantidad", Number.parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          errors[`detalle_${index}_cantidad`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="0"
                        disabled={loading}
                      />
                      {errors[`detalle_${index}_cantidad`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`detalle_${index}_cantidad`]}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>

              {/* Resumen de costos para manufacturados */}
              {isManufacturado && formData.detalles && formData.detalles.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium text-gray-900 mb-2">Resumen de Costos</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Costo total de ingredientes: ${costoTotal.toFixed(2)}</p>
                    <p>Margen de ganancia: {(margenGanancia - 1) * 100}%</p>
                    <p className="font-medium text-gray-900">Precio sugerido: ${suggestedPrice.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
