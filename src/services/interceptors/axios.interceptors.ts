import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import { API_URL } from "..";
import { createHTTPError } from "../../utils/exceptions/httpError";
let _getAccessTokenSilently:
  | (typeof import("@auth0/auth0-react").useAuth0 extends () => infer R
      ? R extends { getAccessTokenSilently: infer F }
        ? F
        : never
      : never)
  | null = null;

/**
 * Función para setear la función getAccessTokenSilently de Auth0.
 * Se debe llamar una vez que Auth0 esté inicializado en tu aplicación.
 * @param fn La función getAccessTokenSilently de useAuth0().
 */
export const setAccessTokenSilently = (fn: typeof _getAccessTokenSilently): void => {
  _getAccessTokenSilently = fn;
};

export const interceptorsApiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

interceptorsApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Si la función _getAccessTokenSilently ha sido inyectada (lo que sucede después de que Auth0 carga)
    if (_getAccessTokenSilently) {
      try {
        // Obtenemos el token de forma asíncrona. Esto esperará hasta que el token esté listo.
        const token: string = await _getAccessTokenSilently();
        if (token) {
          // Si el token se obtuvo con éxito, lo adjuntamos al encabezado de autorización.
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error: unknown) {
        console.error("Error al obtener el token de Auth0 en el interceptor:", error);
        // Si hay un error al obtener el token, la solicitud se enviará sin él.
        // Tu backend debería manejar la ausencia de token con un 401 Unauthorized.
      }
    }
    // La configuración de la solicitud se devuelve, ya sea con o sin el token.
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// interceptor al recibir la respuesta
interceptorsApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Si el error es porque el token no está listo, no mostrar error
    if (error.message === "Token not ready") {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    let message = error.message || error.response?.data;

    if (status === 404 || status === 400) {
      return Promise.reject(error);
    }

    // Si es un error 500 sin mensaje, damos un mensaje genérico al usuario.
    if (status === 500 && (!message || message === "")) {
      message =
        "Ocurrió un error en nuestro servidor. Por favor, intenta nuevamente más tarde. Si el problema persiste, contacta al equipo de soporte de Ameliahub.";
    }

    if (status) {
      const httpError = createHTTPError(status, message as string);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: httpError.message,
        confirmButtonColor: "#d33",
      });

      return Promise.reject(message);
    }

    // Si no hay status, probablemente hay un error de red.
    Swal.fire({
      icon: "error",
      title: "Ohh, no! Revisa tu conexión",
      text: "No hay conexión a internet o el servidor no está disponible. Por favor, verifica tu conexión y vuelve a intentarlo.",
      confirmButtonColor: "#d33",
    });

    return Promise.reject(error);
  },
);
