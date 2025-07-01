"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import { Rol } from "../../models/enum/Rol"
import {
  empleadoServicio,
  transformarDtoAFormData,
  type Departamento,
  type Empleado,
  type EmpleadoFormData,
} from "../../services/empleadoServicio"

interface EmpleadoFormProps {
  isEdit: boolean
  empleado?: Empleado
  onSuccess: (data: EmpleadoFormData) => void
}

// Roles válidos exactamente como en el backend
const roles = [
  { value: Rol.ADMINISTRADOR, label: "Administrador" },
  { value: Rol.CAJERO, label: "Cajero" },
  { value: Rol.COCINERO, label: "Cocinero" },
  { value: Rol.REPARTIDOR, label: "Repartidor" },
]

export const EmpleadoForm = ({ isEdit, empleado, onSuccess }: EmpleadoFormProps) => {
  const [loading, setLoading] = useState(false)
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EmpleadoFormData>({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      rol: Rol.CAJERO,
      calle: "",
      numero: "",
      piso: "",
      dpto: "",
      idDepartamento: 0,
      password: "",
    },
  })

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        setLoadingDepartamentos(true)
        const deps = await empleadoServicio.obtenerDepartamentos()
        setDepartamentos(deps)
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los departamentos. Verifique su conexión.",
          confirmButtonColor: "#f97316",
        })
      } finally {
        setLoadingDepartamentos(false)
      }
    }

    cargarDepartamentos()
  }, [])

  // Prellenar datos en modo edición usando la función adaptadora
  useEffect(() => {
    if (isEdit && empleado) {
      // Crear un EmpleadoResponseDto temporal para usar la función adaptadora
      const empleadoDto = {
        id: empleado.id,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        email: empleado.email,
        telefono: empleado.telefono,
        rol: empleado.rol,
        activo: empleado.activo,
        departamentoNombre: empleado.departamentoNombre,
        calle: empleado.calle,
        numero: empleado.numero,
        piso: empleado.piso,
        dpto: empleado.dpto,
      }

      // Usar la función adaptadora para convertir a formato plano
      const formData = transformarDtoAFormData(empleadoDto)

      // Establecer todos los valores del formulario
      setValue("nombre", formData.nombre)
      setValue("apellido", formData.apellido)
      setValue("email", formData.email)
      setValue("telefono", formData.telefono)
      setValue("rol", formData.rol)
      setValue("calle", formData.calle)
      setValue("numero", formData.numero)
      setValue("piso", formData.piso || "")
      setValue("dpto", formData.dpto || "")
      setValue("password", formData.password || "")
    }
  }, [isEdit, empleado, setValue])

  // Establecer departamento después de cargar datos y departamentos
  useEffect(() => {
    if (isEdit && empleado && departamentos.length > 0 && !loadingDepartamentos) {
      // Buscar departamento por nombre
      const departamentoActual = departamentos.find(
        (dept) => dept.nombre.toLowerCase() === empleado.departamentoNombre.toLowerCase(),
      )
      if (departamentoActual) {
        console.log("Estableciendo departamento:", departamentoActual)
        setValue("idDepartamento", departamentoActual.id)
      }
    }
  }, [isEdit, empleado, departamentos, loadingDepartamentos, setValue])

  const onSubmit = async (data: EmpleadoFormData) => {
    setLoading(true)
    try {
      // Validar que se haya seleccionado un departamento válido
      if (!data.idDepartamento || data.idDepartamento === 0) {
        await Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Debe seleccionar un departamento válido.",
          confirmButtonColor: "#f97316",
        })
        setLoading(false)
        return
      }

      // Validar que el rol sea válido
      if (!Object.values(Rol).includes(data.rol)) {
        await Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "El rol seleccionado no es válido.",
          confirmButtonColor: "#f97316",
        })
        setLoading(false)
        return
      }

      console.log("Datos del formulario:", data)
      await onSuccess(data)

      if (!isEdit) {
        reset()
      }
    } catch (error: any) {
      console.error("Error en formulario:", error)

      // Mostrar error específico del servidor
      let errorMessage = "Ocurrió un error inesperado"

      if (error.response?.status === 400) {
        errorMessage = "Datos inválidos. Verifique los campos ingresados."
      } else if (error.response?.status === 500) {
        errorMessage = "Error del servidor. El departamento seleccionado puede no existir."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#f97316",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Nombre *
          </label>
          <input
            type="text"
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
            placeholder="Ingrese el nombre"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Apellido *
          </label>
          <input
            type="text"
            {...register("apellido", {
              required: "El apellido es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
            placeholder="Ingrese el apellido"
          />
          {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>}
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email *
          </label>
          <input
            type="email"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
            placeholder="ejemplo@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Teléfono *
          </label>
          <input
            type="tel"
            {...register("telefono", {
              required: "El teléfono es obligatorio",
              minLength: { value: 8, message: "Mínimo 8 dígitos" },
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: "Solo números, espacios, +, - y paréntesis",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
            placeholder="Ej: 2612345678"
          />
          {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>}
        </div>
      </div>

      {/* Rol y Contraseña */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            Rol *
          </label>
          <select
            {...register("rol", { required: "Seleccione un rol" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="" className="text-gray-500">
              Seleccionar rol
            </option>
            {roles.map((rol) => (
              <option key={rol.value} value={rol.value} className="text-gray-900 bg-white">
                {rol.label}
              </option>
            ))}
          </select>
          {errors.rol && <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>}
        </div>

        {!isEdit && (
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Contraseña *
            </label>
            <input
              type="password"
              {...register("password", {
                required: !isEdit ? "La contraseña es obligatoria" : false,
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
              placeholder="Ingrese la contraseña"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
        )}
      </div>

      {/* Dirección */}
      <div className="border-t pt-6">
        <h3 className="flex items-center text-lg font-medium text-gray-800 mb-4">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Dirección
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
            <input
              type="text"
              {...register("calle", {
                required: "La calle es obligatoria",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
              placeholder="Ej: Av. San Martín"
            />
            {errors.calle && <p className="mt-1 text-sm text-red-600">{errors.calle.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
            <input
              type="text"
              {...register("numero", {
                required: "El número es obligatorio",
                pattern: {
                  value: /^[0-9]+[a-zA-Z]?$/,
                  message: "Formato inválido (ej: 123, 123A)",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
              placeholder="123"
            />
            {errors.numero && <p className="mt-1 text-sm text-red-600">{errors.numero.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Piso (opcional)</label>
            <input
              type="text"
              {...register("piso")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
              placeholder="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Depto (opcional)</label>
            <input
              type="text"
              {...register("dpto")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
              placeholder="A"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Departamento *
            </label>
            <select
              {...register("idDepartamento", {
                required: "Seleccione un departamento",
                validate: (value) => value !== 0 || "Debe seleccionar un departamento válido",
              })}
              disabled={loadingDepartamentos}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 bg-white text-gray-900"
            >
              <option value={0} className="text-gray-500 bg-white">
                {loadingDepartamentos ? "Cargando departamentos..." : "Seleccionar departamento"}
              </option>
              {departamentos.map((dept) => (
                <option key={dept.id} value={dept.id} className="text-gray-900 bg-white">
                  {dept.nombre}
                </option>
              ))}
            </select>
            {errors.idDepartamento && <p className="mt-1 text-sm text-red-600">{errors.idDepartamento.message}</p>}
          </div>
        </div>
      </div>

      {/* Información de validación */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800">Validaciones importantes</h3>
            <div className="mt-2 text-sm text-orange-700">
              <ul className="list-disc list-inside space-y-1">
                <li>El rol debe ser exactamente: ADMINISTRADOR, COCINERO, REPARTIDOR o CAJERO</li>
                <li>El departamento debe existir en la base de datos</li>
                <li>El email debe ser único en el sistema</li>
                {!isEdit && <li>La contraseña es obligatoria para nuevos empleados</li>}
                <li>Los campos piso y departamento son opcionales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || loadingDepartamentos}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>{isEdit ? "Actualizar" : "Crear"} Empleado</>
          )}
        </button>
      </div>
    </form>
  )
}
