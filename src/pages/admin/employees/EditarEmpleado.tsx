"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { PageHeader } from "../../../components/shared/PageHeader";
import { EmpleadoForm } from "../../../components/empleados/EmpleadoForm";
import type { EmpleadoResponseDto } from "../../../models/dto/Empleado/EmpleadoResponseDto";
import type { IEmpleadoFormData } from "../../../services/empleadoServicio";
import {
  empleadoServicio,
  transformarEmpleadoAFormData,
  transformarEmpleadoFormDataParaActualizar,
} from "../../../services/empleadoServicio";

interface IHttpError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const EditarEmpleado: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<EmpleadoResponseDto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    if (id) {
      cargarEmpleado(Number.parseInt(id));
    }
  }, [id]);

  const cargarEmpleado = async (empleadoId: number): Promise<void> => {
    try {
      setCargando(true);
      const empleadoObtenido = await empleadoServicio.obtenerEmpleadoPorId(empleadoId);
      setEmpleado(empleadoObtenido);
    } catch (error) {
      console.error("Error al cargar empleado:", error);

      await Swal.fire({
        icon: "error",
        title: "Error al cargar empleado",
        text: "No se pudo cargar la información del empleado. Serás redirigido a la lista.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#EF4444",
        timer: 3000,
        timerProgressBar: true,
      });

      // Redirigir a la lista si no se puede cargar
      navigate("/admin/empleados", { replace: true });
    } finally {
      setCargando(false);
    }
  };

  const manejarGuardar = async (datosFormulario: IEmpleadoFormData): Promise<void> => {
    if (!empleado || !id) return;

    try {
      setGuardando(true);

      // Transformar datos del formulario a DTO de actualización
      const actualizarEmpleadoDto = transformarEmpleadoFormDataParaActualizar(datosFormulario, empleado.getAuth0Id());

      // Actualizar empleado
      await empleadoServicio.actualizarEmpleado(Number.parseInt(id), actualizarEmpleadoDto);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Empleado actualizado exitosamente!",
        text: `Los datos de ${datosFormulario.nombre} ${datosFormulario.apellido} han sido actualizados correctamente.`,
        confirmButtonText: "Continuar",
        confirmButtonColor: "#3B82F6",
        timer: 3000,
        timerProgressBar: true,
      });

      // Redirigir a la lista de empleados
      navigate("/admin/empleados", { replace: true });
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      const httpError = error as IHttpError;

      let mensajeError = "Error al actualizar el empleado";
      let detalleError = "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.";

      if (httpError.response?.data?.message) {
        mensajeError = "Error en la actualización";
        detalleError = httpError.response.data.message;
      } else if (httpError.message) {
        detalleError = httpError.message;
      }

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

  const manejarSubirImagen = async (archivo: File): Promise<void> => {
    if (!empleado || !id) return;

    try {
      setSubiendoImagen(true);

      await empleadoServicio.subirImagenEmpleado(Number.parseInt(id), archivo);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Imagen actualizada!",
        text: "La imagen del empleado ha sido actualizada correctamente.",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#3B82F6",
        timer: 2000,
        timerProgressBar: true,
      });

      // Recargar datos del empleado para mostrar la nueva imagen
      await cargarEmpleado(Number.parseInt(id));
    } catch (error) {
      console.error("Error al subir imagen:", error);
      const httpError = error as IHttpError;

      const mensajeError = "Error al subir la imagen";
      let detalleError = "No se pudo actualizar la imagen. Por favor, intenta nuevamente.";

      if (httpError.response?.data?.message) {
        detalleError = httpError.response.data.message;
      } else if (httpError.message) {
        detalleError = httpError.message;
      }

      await Swal.fire({
        icon: "error",
        title: mensajeError,
        text: detalleError,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setSubiendoImagen(false);
    }
  };

  const manejarCancelar = async (): Promise<void> => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar edición?",
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

  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      manejarSubirImagen(archivo);
    }
  };

  const manejarErrorImagen = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = "/placeholder.svg?height=48&width=48";
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del empleado...</p>
        </div>
      </div>
    );
  }

  if (!empleado) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Empleado no encontrado</h3>
        <p className="text-sm text-gray-500">El empleado que buscas no existe o no tienes permisos para verlo.</p>
        <button
          onClick={volverAEmpleados}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Volver a Empleados
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Editar Empleado: ${empleado.getNombre()} ${empleado.getApellido()}`}
        subtitle="Modificar información del empleado"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Empleados", href: "/admin/empleados" },
          { label: "Editar", href: `/admin/empleados/editar/${id}` },
        ]}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg text-black">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={empleado.getImagen() || "/placeholder.svg?height=48&width=48"}
                    alt={`${empleado.getNombre()} ${empleado.getApellido()}`}
                    onError={manejarErrorImagen}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {empleado.getNombre()} {empleado.getApellido()}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {empleado.getIdUsuario()}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={manejarCambioArchivo}
                    className="hidden"
                    disabled={subiendoImagen}
                  />
                  {subiendoImagen ? (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {subiendoImagen ? "Subiendo..." : "Cambiar Imagen"}
                </label>
              </div>
            </div>
          </div>

          <div className="p-6">
            <EmpleadoForm
              empleadoInicial={transformarEmpleadoAFormData(empleado)}
              onSubmit={manejarGuardar}
              onCancel={manejarCancelar}
              loading={guardando}
              submitButtonText="Actualizar Empleado"
              submitButtonIcon={<Save className="h-4 w-4 mr-2" />}
              esEdicion={true}
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
