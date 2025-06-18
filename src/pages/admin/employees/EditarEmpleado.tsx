"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { EmpleadoForm } from "../../../components/empleados/EmpleadoForm"
import { PageHeader } from "../../../components/shared/PageHeader"
import {
  empleadoServicio,
  transformarEmpleadoFormDataParaActualizar,
  type Empleado,
  type EmpleadoFormData,
} from "../../../services/empleadoServicio"

const EditarEmpleado = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarEmpleado = async () => {
      if (!id) {
        setError("ID de empleado no válido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const empleadoData = await empleadoServicio.obtenerEmpleadoPorId(Number.parseInt(id))
        console.log("Empleado cargado para edición:", empleadoData)
        setEmpleado(empleadoData)
      } catch (err) {
        console.error("Error al cargar empleado:", err)
        setError("Error al cargar los datos del empleado")
      } finally {
        setLoading(false)
      }
    }

    cargarEmpleado()
  }, [id])

  const handleSuccess = async (data: EmpleadoFormData) => {
    if (!empleado) return

    try {
      // Transformar datos del formulario a DTO de actualización
      const empleadoDto = transformarEmpleadoFormDataParaActualizar(data)

      console.log("Actualizando empleado con DTO:", empleadoDto)

      // Actualizar empleado
      await empleadoServicio.actualizarEmpleado(empleado.id, empleadoDto)

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Empleado actualizado!",
        text: "Los datos del empleado han sido actualizados exitosamente.",
        confirmButtonColor: "#f97316",
      })

      // Recargar lista si existe la función global
      if (typeof window !== "undefined" && (window as any).recargarEmpleados) {
        ;(window as any).recargarEmpleados()
      }

      // Navegar de vuelta a la lista
      navigate("/admin/empleados")
    } catch (error: any) {
      console.error("Error al actualizar empleado:", error)

      let errorMessage = "Error al actualizar el empleado"

      if (error.response?.status === 400) {
        errorMessage = "Datos inválidos. Verifique los campos ingresados."
      } else if (error.response?.status === 500) {
        errorMessage = "Error del servidor. Verifique que el departamento seleccionado sea válido."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#f97316",
      })

      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <span className="ml-2 text-gray-600">Cargando datos del empleado...</span>
      </div>
    )
  }

  if (error || !empleado) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || "No se pudo cargar el empleado"}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/admin/empleados")}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar Empleado"
        subtitle={`Modificar datos de ${empleado.nombre} ${empleado.apellido}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Empleados", href: "/admin/empleados" },
          { label: "Editar Empleado" },
        ]}
      />

      <div className="bg-white shadow-sm rounded-lg p-6">
        <EmpleadoForm isEdit={true} empleado={empleado} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default EditarEmpleado
