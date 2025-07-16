import React, { useState, useEffect } from "react";
import { useAuth0Store } from "../../../store/auth/useAuth0Store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonOutline, MailOutline, PhoneAndroidOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ClienteRegister, registerClient } from "../../../services/clienteServicio";

interface ProfileFormValues {
  nombre: string;
  apellido: string;
  telefono: string;
}

export const ProfileCompletionForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, setIsProfileComplete, setProfileData } = useAuth0Store();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProfileFormValues>({
    mode: "onChange",
    defaultValues: {
      nombre: user?.name || "",
      apellido: "",
      telefono: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
    reset({
      nombre: user?.name || "",
      apellido: "",
      telefono: "",
    });
  }, [user, navigate, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      Swal.fire("Error", "No hay usuario autenticado para completar el perfil.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload: ClienteRegister = {
        idAuth0: user.id,
        email: user.email,
        nombre: values.nombre,
        apellido: values.apellido,
        telefono: values.telefono || null,
        imagen: user.picture || null,
      };

      const registeredClient = await registerClient(payload);
      console.log("Client registered in DB:", registeredClient);

      setProfileData({
        apellido: registeredClient.apellido,
        telefono: registeredClient.telefono,
        roles: ["CLIENTE"],
        imagen: null,
        email: registeredClient.email,
        name: registeredClient.nombre,
        id: registeredClient.idAuth0,
        picture: user.picture,
      });

      setIsProfileComplete(true);

      Swal.fire("¡Éxito!", "Tu perfil ha sido completado.", "success").then(() => {
        window.location.href = "/catalog";
      });
    } catch (error: unknown) {
      console.error("Error al enviar el formulario de perfil:", error);
      let errorMessage = "Error desconocido";

      type ApiError = {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      Swal.fire("Error", `No se pudo completar el perfil: ${errorMessage}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Cargando datos de usuario...</p>
      </div>
    );
  }

  return (
    <div className="text-black min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 sm:pt-20 lg:pt-20 lg:p-8 pt-16">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md border border-orange-100 mx-auto my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-6">Completa tu Perfil</h2>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          ¡Bienvenido! Para continuar, necesitamos algunos datos adicionales.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6">
          <div className="relative">
            <MailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="email"
              id="email"
              value={user.email || ""}
              readOnly
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-600 cursor-not-allowed text-sm sm:text-base"
            />
            <label
              htmlFor="email"
              className="absolute left-10 -top-2 text-xs text-gray-500 bg-white px-1">
              Email
            </label>
          </div>

          <div className="relative">
            <PersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              id="nombre"
              placeholder="Tu Nombre"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "El nombre es muy corto" },
                maxLength: { value: 50, message: "El nombre es muy largo" },
              })}
            />
            <label
              htmlFor="nombre"
              className="absolute left-10 -top-2 text-xs text-gray-500 bg-white px-1">
              Nombre
            </label>
            {errors.nombre && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div className="relative">
            <PersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              id="apellido"
              placeholder="Tu Apellido"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              {...register("apellido", {
                required: "El apellido es obligatorio",
                minLength: { value: 2, message: "El apellido es muy corto" },
                maxLength: { value: 50, message: "El apellido es muy largo" },
              })}
            />
            <label
              htmlFor="apellido"
              className="absolute left-10 -top-2 text-xs text-gray-500 bg-white px-1">
              Apellido
            </label>
            {errors.apellido && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.apellido.message}</p>}
          </div>

          <div className="relative">
            <PhoneAndroidOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="tel"
              id="telefono"
              placeholder="Tu Teléfono"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              {...register("telefono", {
                required: "El teléfono es obligatorio",
                minLength: { value: 7, message: "El teléfono es muy corto" },
                maxLength: { value: 15, message: "El teléfono es muy largo" },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "El teléfono solo debe contener números",
                },
              })}
            />
            <label
              htmlFor="telefono"
              className="absolute left-10 -top-2 text-xs text-gray-500 bg-white px-1">
              Teléfono
            </label>
            {errors.telefono && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.telefono.message}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-orange-500 text-white py-2 sm:py-3 rounded-xl font-semibold text-base sm:text-lg shadow-md hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isValid}>
            {isLoading ? "Guardando..." : "Completar Perfil"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
