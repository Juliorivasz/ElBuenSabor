"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { EmpleadoForm } from "../../../components/empleados/EmpleadoForm"
import { PageHeader } from "../../../components/shared/PageHeader"
import {
  empleadoServicio,
  transformarEmpleadoFormData,
  type EmpleadoFormData,
} from "../../../services/empleadoServicio"

const NuevoEmpleado = () => {
  const navigate = useNavigate()
  const [, setLoading] = useState(false)

  const handleSuccess = async (data: EmpleadoFormData) => {
    try {
      setLoading(true)

      // Transformar datos del formulario a DTO del backend
      const empleadoDto = transformarEmpleadoFormData(data)

      console.log("Creando empleado con DTO:", empleadoDto)

      // Crear empleado
      await empleadoServicio.crearEmpleado(empleadoDto)

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Empleado creado!",
        text: "El empleado ha sido creado exitosamente.",
        confirmButtonColor: "#f97316",
      })

      // Recargar lista si existe la función global
      if (typeof window !== "undefined" && (window as any).recargarEmpleados) {
        ;(window as any).recargarEmpleados()
      }

      // Navegar de vuelta a la lista
      navigate("/admin/empleados")
    } catch (error: any) {
      console.error("Error al crear empleado:", error)

      let errorMessage = "Error al crear el empleado"

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nuevo Empleado"
        subtitle="Crear un nuevo empleado en el sistema"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Empleados", href: "/admin/empleados" },
          { label: "Nuevo Empleado" },
        ]}
      />

      <div className="bg-white shadow-sm rounded-lg p-6">
        <EmpleadoForm isEdit={false} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default NuevoEmpleado
