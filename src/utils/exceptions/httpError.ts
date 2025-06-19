import { HTTPError } from "../../models/exceptions/HttpError";

export function mapStatusToError(status: number): HTTPError {
  switch (status) {
    case 400:
      return new HTTPError(
        400,
        "No se pudo procesar la solicitud. Verifica los datos ingresados e intenta nuevamente.",
      );
    case 401:
      return new HTTPError(401, "Autenticación requerida. Inicia sesión para continuar.");
    case 403:
      return new HTTPError(403, "No tienes permiso para realizar esta acción.");
    case 404:
      return new HTTPError(404, "Recurso solicitado no encontrado.");
    case 405:
      return new HTTPError(405, "Esta acción no está permitida en el contexto actual.");
    case 500:
      return new HTTPError(
        500,
        "Ocurrió un error interno en el servidor. Por favor, intenta nuevamente más tarde. Si el problema persiste, contacta al soporte técnico.",
      );
    default:
      return new HTTPError(status, `Ocurrió un error inesperado (código ${status}). Intenta nuevamente.`);
  }
}

export function createHTTPError(status: number, serverMessage?: string): HTTPError {
  return serverMessage ? new HTTPError(status, serverMessage) : mapStatusToError(status);
}
