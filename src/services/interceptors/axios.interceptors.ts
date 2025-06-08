import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import { API_URL } from "..";
import { createHTTPError } from "../../utils/exceptions/httpError";

export const interceptorsApiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Interceptor antes de enviar la solicitud
interceptorsApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = "";
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// interceptor al recibir la respuesta
interceptorsApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    let message = error.message || error.response?.data;

    // Si es un error 500 sin mensaje, damos un mensaje genérico al usuario.
    if (status === 500 && (!message || message === "")) {
      message =
        "Ocurrió un error en nuestro servidor. Por favor, intenta nuevamente más tarde. Si el problema persiste, contacta al equipo de soporte de Ameliahub.";
    }

    if (status) {
      const httpError = createHTTPError(status, message as string);
      Swal.fire({
        icon: "error", // Icono de error.
        title: "Oops...", // Título de la alerta.
        text: httpError.message, // Mostramos el mensaje del error.
        confirmButtonColor: "#d33", // Color del botón de confirmación.
      });

      return Promise.reject(message); // Rechazamos el error para que lo capture quien hizo el request.
    }

    // Si no hay status, probablemente hay un error de red.
    Swal.fire({
      icon: "error",
      title: "Ohh, no! Revisa tu conexión",
      text: "No hay conexión a internet o el servidor no está disponible. Por favor, verifica tu conexión y vuelve a intentarlo.",
      confirmButtonColor: "#d33",
    });

    return Promise.reject(error); // Rechazamos el error sin transformar porque no hay status.
  },
);
