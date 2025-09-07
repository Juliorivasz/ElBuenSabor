"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";
import { PageHeader } from "../../../components/shared/PageHeader";
import { EmpleadoForm } from "../../../components/empleados/EmpleadoForm";
import type { IEmpleadoFormData } from "../../../services/empleadoServicio";
import { empleadoServicio, transformarEmpleadoFormData } from "../../../services/empleadoServicio";

interface IHttpError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const NuevoEmpleado: React.FC = () => {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const manejarGuardar = async (datosFormulario: IEmpleadoFormData): Promise<void> => {
    try {
      setGuardando(true);

      // Transformar datos del formulario a DTO
      const nuevoEmpleadoDto = transformarEmpleadoFormData(datosFormulario);

      // Crear empleado
      await empleadoServicio.crearEmpleado(nuevoEmpleadoDto);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Empleado creado exitosamente!",
        text: `El empleado ${datosFormulario.nombre} ${datosFormulario.apellido} ha sido registrado correctamente.`,
        confirmButtonText: "Continuar",
        confirmButtonColor: "#3B82F6",
        timer: 3000,
        timerProgressBar: true,
      });

      // Redirigir a la lista de empleados
      navigate("/admin/empleados", { replace: true });
    } catch (error) {
      console.error("Error al crear empleado:", error);
      const httpError = error as IHttpError;

      let mensajeError = "Error al crear el empleado";
      let detalleError = "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.";

      if (httpError.response?.data?.message) {
        mensajeError = "Error en el registro";
        detalleError = httpError.response.data.message;
      } else if (httpError.message) {
        detalleError = httpError.message;
      }

      // Mostrar mensaje de error
      await Swal.fire({
        icon: "error",
        title: mensajeError,
        text: detalleError,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setGuardando(false);
    }
  };

  const manejarCancelar = async (): Promise<void> => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar creación?",
      text: "Se perderán todos los cambios realizados.",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Continuar editando",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      navigate("/admin/empleados", { replace: true });
    }
  };

  const volverAEmpleados = (): void => {
    navigate("/admin/empleados");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nuevo Empleado"
        subtitle="Crear un nuevo empleado en el sistema"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Empleados", href: "/admin/empleados" },
          { label: "Nuevo", href: "/admin/empleados/nuevo" },
        ]}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Información del Empleado</h3>
              <div className="flex space-x-3"></div>
            </div>
          </div>

          <div className="p-6">
            <EmpleadoForm
              onSubmit={manejarGuardar}
              onCancel={manejarCancelar}
              loading={guardando}
              submitButtonText="Crear Empleado"
              submitButtonIcon={<Save className="h-4 w-4 mr-2" />}
            />
          </div>
        </div>
      </div>

      {/* Botón de regreso */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={volverAEmpleados}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Empleados
        </button>
      </div>
    </div>
  );
};
