"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Rol } from "../../models/enum/Rol"
import {
  empleadoServicio,
  type ActualizarEmpleadoDto,
  type Departamento,
  type DireccionDto,
  type Empleado,
} from "../../services/empleadoServicio"

interface FormErrors {
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  rol?: string
  calle?: string
  numero?: string
  idDepartamento?: string
}

interface EditarEmpleadoFormProps {
  empleado: Empleado
  onSuccess?: () => void
  onCancel?: () => void
}

const EditarEmpleadoForm: React.FC<EditarEmpleadoFormProps> = ({ empleado, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<ActualizarEmpleadoDto>({
    nombre: empleado.nombre,
    apellido: empleado.apellido,
    email: empleado.email,
    telefono: empleado.telefono,
    password: "", // No se permite editar la contraseña desde aquí
    rol: empleado.rol,
    direccion: {
      calle: "",
      numero: "",
      piso: "",
      dpto: "",
      idDepartamento: 0,
    },
  })

  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(true)

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        const deps = await empleadoServicio.obtenerDepartamentos()
        setDepartamentos(deps)
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los departamentos",
        })
      } finally {
        setLoadingDepartamentos(false)
      }
    }

    cargarDepartamentos()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.startsWith("direccion.")) {
      const fieldName = name.split(".")[1] as keyof DireccionDto
      setFormData((prev) => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [fieldName]: fieldName === "idDepartamento" ? Number.parseInt(value) || 0 : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    const errorKey = name.startsWith("direccion.") ? name.split(".")[1] : name
    if (errors[errorKey as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido"
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio"
    }

    if (!formData.rol) {
      newErrors.rol = "El rol es obligatorio"
    }

    if (!formData.direccion.calle.trim()) {
      newErrors.calle = "La calle es obligatoria"
    }

    if (!formData.direccion.numero.trim()) {
      newErrors.numero = "El número es obligatorio"
    }

    if (!formData.direccion.idDepartamento || formData.direccion.idDepartamento === 0) {
      newErrors.idDepartamento = "El departamento es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para envío
      const dataToSend: ActualizarEmpleadoDto = {
        ...formData,
        direccion: {
          ...formData.direccion,
          piso: formData.direccion.piso?.trim() || undefined,
          dpto: formData.direccion.dpto?.trim() || undefined,
        },
      }

      await empleadoServicio.actualizarEmpleado(empleado.id, dataToSend)

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Empleado actualizado!",
        text: "Los datos del empleado han sido actualizados exitosamente.",
        confirmButtonColor: "#10b981",
      })

      // Callback de éxito (para refrescar datos, cerrar modal, etc.)
      onSuccess?.()
    } catch (error) {
      console.error("Error al actualizar empleado:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el empleado. Por favor, intenta nuevamente.",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelClick = () => {
    onCancel?.()
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">
          Editar Empleado: {empleado.nombre} {empleado.apellido}
        </h2>
        <p className="text-green-100 mt-1">Actualiza la información del empleado</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Datos Personales */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500 ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ingresa el nombre"
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500 ${
                  errors.apellido ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ingresa el apellido"
              />
              {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500 ${
                  errors.telefono ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+54 9 11 1234-5678"
              />
              {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
            </div>

            {/* Rol */}
            <div className="md:col-span-2">
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
                Rol *
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 ${
                  errors.rol ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" className="text-gray-500 bg-white">
                  Selecciona un rol
                </option>
                <option value={Rol.ADMINISTRADOR} className="text-gray-900 bg-white">
                  Administrador
                </option>
                <option value={Rol.CAJERO} className="text-gray-900 bg-white">
                  Cajero
                </option>
                <option value={Rol.COCINERO} className="text-gray-900 bg-white">
                  Cocinero
                </option>
                <option value={Rol.REPARTIDOR} className="text-gray-900 bg-white">
                  Repartidor
                </option>
              </select>
              {errors.rol && <p className="mt-1 text-sm text-red-600">{errors.rol}</p>}
            </div>
          </div>
        </div>

        {/* Datos de Dirección */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Dirección</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calle */}
            <div>
              <label htmlFor="direccion.calle" className="block text-sm font-medium text-gray-700 mb-2">
                Calle *
              </label>
              <input
                type="text"
                id="direccion.calle"
                name="direccion.calle"
                value={formData.direccion.calle}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500 ${
                  errors.calle ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nombre de la calle"
              />
              {errors.calle && <p className="mt-1 text-sm text-red-600">{errors.calle}</p>}
            </div>

            {/* Número */}
            <div>
              <label htmlFor="direccion.numero" className="block text-sm font-medium text-gray-700 mb-2">
                Número *
              </label>
              <input
                type="text"
                id="direccion.numero"
                name="direccion.numero"
                value={formData.direccion.numero}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500 ${
                  errors.numero ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Número de la dirección"
              />
              {errors.numero && <p className="mt-1 text-sm text-red-600">{errors.numero}</p>}
            </div>

            {/* Piso */}
            <div>
              <label htmlFor="direccion.piso" className="block text-sm font-medium text-gray-700 mb-2">
                Piso (Opcional)
              </label>
              <input
                type="text"
                id="direccion.piso"
                name="direccion.piso"
                value={formData.direccion.piso}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                placeholder="Piso"
              />
            </div>

            {/* Departamento */}
            <div>
              <label htmlFor="direccion.dpto" className="block text-sm font-medium text-gray-700 mb-2">
                Departamento (Opcional)
              </label>
              <input
                type="text"
                id="direccion.dpto"
                name="direccion.dpto"
                value={formData.direccion.dpto}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                placeholder="Depto/Oficina"
              />
            </div>

            {/* Departamento (Select) */}
            <div className="md:col-span-2">
              <label htmlFor="direccion.idDepartamento" className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <select
                id="direccion.idDepartamento"
                name="direccion.idDepartamento"
                value={formData.direccion.idDepartamento}
                onChange={handleInputChange}
                disabled={loadingDepartamentos}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900 ${
                  errors.idDepartamento ? "border-red-500" : "border-gray-300"
                } ${loadingDepartamentos ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value={0} className="text-gray-500 bg-white">
                  {loadingDepartamentos ? "Cargando departamentos..." : "Selecciona un departamento"}
                </option>
                {departamentos.map((dept) => (
                  <option key={dept.id} value={dept.id} className="text-gray-900 bg-white">
                    {dept.nombre}
                  </option>
                ))}
              </select>
              {errors.idDepartamento && <p className="mt-1 text-sm text-red-600">{errors.idDepartamento}</p>}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading || loadingDepartamentos}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Actualizando...
              </div>
            ) : (
              "Actualizar Empleado"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isLoading}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Información adicional */}
      <div className="mx-6 mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Información importante</h3>
            <div className="mt-2 text-sm text-green-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Los campos marcados con (*) son obligatorios</li>
                <li>El email debe ser único en el sistema</li>
                <li>Los campos piso y departamento son opcionales</li>
                <li>Los cambios se aplicarán inmediatamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditarEmpleadoForm
