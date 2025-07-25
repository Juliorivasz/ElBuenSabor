import type React from "react"

import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import ImageIcon from "@mui/icons-material/Image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import type { CategoriaExtendidaDto } from "../../models/dto/CategoriaExtendidaDto"
import { NuevaCategoriaDto } from "../../models/dto/NuevaCategoriaDto"
import { useCategoriasStore } from "../../store/categorias/useCategoriasStore"
import { FileUploadService } from "../../utils/fileUpload"
import { NotificationService } from "../../utils/notifications"

interface CategoriaFormData {
  nombre: string
  margenGanancia: number
  dadoDeAlta: boolean
  idCategoriaPadre: number | null
  imagenUrl: string
}

interface CategoriaFormProps {
  categoria?: CategoriaExtendidaDto
  categorias: CategoriaExtendidaDto[]
  onSubmit: (categoria: NuevaCategoriaDto, archivo?: File) => void
  onCancel: () => void
  loading: boolean
}

interface CategoryTreeItem {
  category: CategoriaExtendidaDto
  level: number
}

export const CategoriaForm = ({ categoria, categorias, onSubmit, onCancel, loading }: CategoriaFormProps) => {
  const [previewImage, setPreviewImage] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)

  const { getCategoriasParaSelector } = useCategoriasStore()

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
      imagenUrl: "",
    },
  })

  const watchImagenUrl = watch("imagenUrl")
  const watchIdCategoriaPadre = watch("idCategoriaPadre")

  // Función para construir el árbol jerárquico de categorías para el selector
  const buildCategoryTree = (
    categories: CategoriaExtendidaDto[],
    parentId = 0,
    level = 0,
    excludeId?: number,
  ): CategoryTreeItem[] => {
    const result: CategoryTreeItem[] = []
    const children = categories
      .filter((cat) => {
        // Filtrar por categoría padre
        const isChild = cat.getIdCategoriaPadre() === parentId
        // Excluir la categoría que se está editando para evitar referencias circulares
        const notExcluded = !excludeId || cat.getIdCategoria() !== excludeId
        return isChild && notExcluded
      })
      .sort((a, b) => a.getNombre().localeCompare(b.getNombre()))

    for (const child of children) {
      // Limitar la profundidad máxima a 4 niveles
      if (level < 4) {
        result.push({ category: child, level })
        result.push(...buildCategoryTree(categories, child.getIdCategoria(), level + 1, excludeId))
      }
    }

    return result
  }

  // Construir el árbol de categorías disponibles (incluye activas e inactivas)
  const categoryTree = buildCategoryTree(
    categorias,
    0,
    0,
    categoria?.getIdCategoria(), // Excluir la categoría actual si se está editando
  )

  // Función para obtener la URL de imagen de una categoría
  const getImageUrl = (categoria: CategoriaExtendidaDto): string => {
    // Primero intentar con la estructura nueva (imagenModel.url)
    if ((categoria as any).imagenModel?.url) {
      return (categoria as any).imagenModel.url
    }
    // Fallback a la estructura anterior
    return categoria.getImagenDto()?.getUrl() || ""
  }

  // Función para verificar si una categoría padre está inactiva
  const isParentInactive = (parentId: number | null): boolean => {
    if (!parentId) return false
    const parent = categorias.find((cat) => cat.getIdCategoria() === parentId)
    return parent ? !parent.isActiva() : false
  }

  // Cargar datos si es edición
  useEffect(() => {
    if (categoria) {
      const imageUrl = getImageUrl(categoria)
      const data = {
        nombre: categoria.getNombre(),
        margenGanancia: categoria.getMargenGanancia() * 100, // Convertir a porcentaje para mostrar
        dadoDeAlta: categoria.isActiva(),
        idCategoriaPadre: categoria.getIdCategoriaPadre() || null,
        imagenUrl: imageUrl,
      }
      reset(data)
      setPreviewImage(imageUrl)
      setSelectedParentId(categoria.getIdCategoriaPadre() || null)
    }
  }, [categoria, reset])

  // Actualizar preview cuando cambia la URL manual
  useEffect(() => {
    if (watchImagenUrl && !selectedFile) {
      setPreviewImage(watchImagenUrl)
    }
  }, [watchImagenUrl, selectedFile])

  // Efecto para manejar el estado automático basado en la categoría padre
  useEffect(() => {
    const parentId = watchIdCategoriaPadre
    setSelectedParentId(parentId)

    // Si no estamos editando una categoría existente
    if (!categoria) {
      if (isParentInactive(parentId)) {
        // Si el padre está inactivo, desactivar automáticamente la nueva categoría
        setValue("dadoDeAlta", false)
        NotificationService.info(
          "La categoría se ha marcado como inactiva automáticamente porque la categoría padre seleccionada está inactiva.",
          "Estado automático",
        )
      } else {
        // Si el padre está activo o no hay padre, activar la categoría
        setValue("dadoDeAlta", true)
      }
    }
  }, [watchIdCategoriaPadre, categoria, setValue, categorias])

  // Función para subir imagen a Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default") // Usar el preset por defecto o configurar uno específico

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dksmkvi49/image/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir imagen a Cloudinary")
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      throw new Error("Error al subir la imagen. Intenta nuevamente.")
    }
  }

  const handleFileSelect = async (file: File) => {
    const validation = FileUploadService.validateImageFile(file)

    if (!validation.isValid) {
      NotificationService.error(validation.error!)
      return
    }

    try {
      setSelectedFile(file)
      const previewUrl = FileUploadService.createImagePreviewUrl(file)
      setPreviewImage(previewUrl)

      // Limpiar la URL manual cuando se selecciona un archivo
      setValue("imagenUrl", "")

      NotificationService.success("Imagen seleccionada correctamente")
    } catch (error) {
      NotificationService.error("Error al procesar la imagen")
      console.error("Error processing image:", error)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewImage("")
    setValue("imagenUrl", "")

    // Limpiar el input file
    const fileInput = document.getElementById("imagen-file") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleUrlChange = () => {
    // Si se ingresa una URL manual, limpiar el archivo seleccionado
    if (watchImagenUrl && selectedFile) {
      setSelectedFile(null)
      // Limpiar el input file
      const fileInput = document.getElementById("imagen-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
  }

  const onFormSubmit = async (data: CategoriaFormData) => {
    try {
      let imagenModel = null
      setUploadingToCloudinary(true)

      // Determinar qué tipo de imagen usar
      if (selectedFile) {
        // Subir archivo a Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(selectedFile)
        imagenModel = {
          url: cloudinaryUrl,
        }
      } else if (data.imagenUrl) {
        // Si hay una URL manual, usarla directamente
        imagenModel = {
          url: data.imagenUrl,
        }
      }

      const nuevaCategoria = new NuevaCategoriaDto(
        data.nombre,
        data.margenGanancia / 100, // Convertir porcentaje a decimal para el backend
        data.dadoDeAlta,
        data.idCategoriaPadre,
        imagenModel,
      )

      // No pasar el archivo ya que se subió a Cloudinary
      await onSubmit(nuevaCategoria)

      // Limpiar preview URLs si existen
      if (selectedFile && previewImage.startsWith("blob:")) {
        FileUploadService.revokeImagePreviewUrl(previewImage)
      }
    } catch (error) {
      console.error("Error en formulario:", error)
      NotificationService.error(error instanceof Error ? error.message : "Error al guardar la categoría")
    } finally {
      setUploadingToCloudinary(false)
    }
  }

  const isEditing = !!categoria
  const title = isEditing ? "Editar Categoría" : "Nueva Categoría"

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
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
            disabled={loading || uploadingToCloudinary}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
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
                    disabled={loading || uploadingToCloudinary}
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
                      disabled={loading || uploadingToCloudinary}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  {errors.margenGanancia && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
                          return null
                        }
                        return Number(value)
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-900 bg-white"
                    disabled={loading || uploadingToCloudinary}
                  >
                    <option value="" className="text-gray-900">
                      (Categoría principal)
                    </option>
                    {categoryTree.map(({ category, level }) => {
                      const isInactive = !category.isActiva()
                      return (
                        <option
                          key={category.getIdCategoria()}
                          value={category.getIdCategoria()}
                          className={`text-gray-900 ${isInactive ? "text-gray-500" : ""}`}
                          style={{ paddingLeft: `${level * 20}px` }}
                        >
                          {"  ".repeat(level)}
                          {level > 0 && "└─ "}
                          {category.getNombre()}
                          {level === 0 && " (Principal)"}
                          {level === 1 && " (Subcategoría)"}
                          {level >= 2 && ` (Nivel ${level + 1})`}
                          {isInactive && " [INACTIVA]"}
                        </option>
                      )
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
                      disabled={loading || uploadingToCloudinary || (!categoria && isParentInactive(selectedParentId))}
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
            </div>

            {/* Columna Derecha - Imagen */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Imagen de la Categoría</h4>

                {/* Zona de carga de archivos */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    id="imagen-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading || uploadingToCloudinary}
                  />

                  <div className="space-y-2">
                    <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-orange-600">Haz clic para subir</span> o arrastra una imagen
                      aquí
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP hasta 5MB</p>
                    <p className="text-xs text-blue-600">📁 Se subirá automáticamente a Cloudinary</p>
                    {selectedFile && (
                      <p className="text-xs text-green-600 font-medium">Archivo seleccionado: {selectedFile.name}</p>
                    )}
                  </div>
                </div>

                {/* URL manual */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">O ingresa una URL de imagen</label>
                  <input
                    type="url"
                    {...register("imagenUrl", {
                      pattern: {
                        value: /^https?:\/\/.+/i,
                        message: "Debe ser una URL válida",
                      },
                      onChange: handleUrlChange,
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                      errors.imagenUrl ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={loading || uploadingToCloudinary}
                  />
                  {errors.imagenUrl && <p className="text-red-500 text-sm mt-1">{errors.imagenUrl.message}</p>}
                  {selectedFile && watchImagenUrl && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ Se usará el archivo seleccionado en lugar de la URL</p>
                  )}
                </div>

                {/* Vista previa */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Vista Previa</label>
                  <div className="relative bg-white border border-gray-200 rounded-lg p-4">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          disabled={loading || uploadingToCloudinary}
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {selectedFile ? "Archivo local → Cloudinary" : "URL externa"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <ImageIcon className="h-16 w-16 mb-2" />
                        <p className="text-sm">Sin imagen seleccionada</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Información sobre Categorías Jerárquicas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Puedes crear hasta 4 niveles de jerarquía
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Las imágenes se suben automáticamente a Cloudinary
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  El margen se aplica como decimal al backend
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Puedes seleccionar cualquier categoría como padre (activa o inactiva)
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Ejemplo: Bebidas → Con Alcohol → Cervezas → Artesanales
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Las categorías inactivas no son visibles para clientes
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Puedes usar archivos locales o URLs externas
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Si el padre está inactivo, la nueva categoría será inactiva automáticamente
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
              disabled={loading || uploadingToCloudinary}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              disabled={loading || uploadingToCloudinary}
            >
              {loading || uploadingToCloudinary ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {uploadingToCloudinary ? "Subiendo imagen..." : "Guardando..."}
                </>
              ) : (
                <>{isEditing ? "Actualizar Categoría" : "Crear Categoría"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
