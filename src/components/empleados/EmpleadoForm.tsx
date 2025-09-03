import { Eye, EyeOff, Mail, Phone, Shield, User } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import type { RolDto } from "../../models/dto/Rol/RolDto"
import type { IEmpleadoFormData } from "../../services/empleadoServicio"
import { rolServicio } from "../../services/rolServicio"

interface IEmpleadoFormProps {
  empleadoInicial?: IEmpleadoFormData
  onSubmit: (datos: IEmpleadoFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitButtonText?: string
  submitButtonIcon?: React.ReactNode
  esEdicion?: boolean
}

export const EmpleadoForm: React.FC<IEmpleadoFormProps> = ({
  empleadoInicial,
  onSubmit,
  onCancel,
  loading = false,
  submitButtonText = "Guardar",
  submitButtonIcon,
  esEdicion = false,
}) => {
  const [formData, setFormData] = useState<IEmpleadoFormData>({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rol: "",
    ...empleadoInicial,
  })

  const [roles, setRoles] = useState<RolDto[]>([])
  const [cargandoRoles, setCargandoRoles] = useState(true)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [errores, setErrores] = useState<Partial<IEmpleadoFormData>>({})

  // Cargar roles al montar el componente
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setCargandoRoles(true)
        const rolesObtenidos = await rolServicio.obtenerRolesActivos()
        setRoles(rolesObtenidos)
      } catch (error) {
        console.error("Error al cargar roles:", error)
      } finally {
        setCargandoRoles(false)
      }
    }
    cargarRoles()
  }, [])

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<IEmpleadoFormData> = {}

    // Validar email
    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = "El email no tiene un formato válido"
    }

    // Validar password solo si no es edición
    if (!esEdicion && !formData.password?.trim()) {
      nuevosErrores.password = "La contraseña es requerida"
    } else if (!esEdicion && formData.password && formData.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres"
    }

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido"
    } else if (formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres"
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es requerido"
    } else if (formData.apellido.trim().length < 2) {
      nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres"
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es requerido"
    } else if (!/^\d{10,15}$/.test(formData.telefono.replace(/\s/g, ""))) {
      nuevosErrores.telefono = "El teléfono debe tener entre 10 y 15 dígitos"
    }

    // Validar rol
    if (!formData.rol) {
      nuevosErrores.rol = "El rol es requerido"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarCambio = (campo: keyof IEmpleadoFormData, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }))
    }
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error en el formulario:", error)
    }
  }

  return (
    <form onSubmit={manejarSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline h-4 w-4 mr-1" />
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => manejarCambio("nombre", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errores.nombre ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ingresa el nombre"
            disabled={loading}
          />
          {errores.nombre && <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>}
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline h-4 w-4 mr-1" />
            Apellido *
          </label>
          <input
            type="text"
            id="apellido"
            value={formData.apellido}
            onChange={(e) => manejarCambio("apellido", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errores.apellido ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ingresa el apellido"
            disabled={loading}
          />
          {errores.apellido && <p className="mt-1 text-sm text-red-600">{errores.apellido}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="inline h-4 w-4 mr-1" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => manejarCambio("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errores.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="ejemplo@correo.com"
            disabled={loading}
          />
          {errores.email && <p className="mt-1 text-sm text-red-600">{errores.email}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="inline h-4 w-4 mr-1" />
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            value={formData.telefono}
            onChange={(e) => manejarCambio("telefono", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errores.telefono ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="2615123456"
            disabled={loading}
          />
          {errores.telefono && <p className="mt-1 text-sm text-red-600">{errores.telefono}</p>}
        </div>

        {/* Contraseña - Solo mostrar si no es edición */}
        {!esEdicion && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                value={formData.password || ""}
                onChange={(e) => manejarCambio("password", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errores.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {mostrarPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errores.password && <p className="mt-1 text-sm text-red-600">{errores.password}</p>}
          </div>
        )}

        {/* Rol */}
        <div className={esEdicion ? "md:col-span-1" : "md:col-span-2"}>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
            <Shield className="inline h-4 w-4 mr-1" />
            Rol *
          </label>
          <select
            id="rol"
            value={roles.find((rol) => rol.getNombre() === formData.rol)?.getAuth0RoleId()}
            onChange={(e) => manejarCambio("rol", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errores.rol ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading || cargandoRoles}
          >
            {!formData.rol && <option value={""}>Selecciona un rol</option>}
            {roles.map((rol) => (
              <option key={rol.getIdRol()} value={rol.getAuth0RoleId()}>
                {rol.getNombre()}
              </option>
            ))}
          </select>
          {errores.rol && <p className="mt-1 text-sm text-red-600">{errores.rol}</p>}
          {cargandoRoles && <p className="mt-1 text-sm text-gray-500">Cargando roles...</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || cargandoRoles}
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Guardando...
            </>
          ) : (
            <>
              {submitButtonIcon}
              {submitButtonText}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
