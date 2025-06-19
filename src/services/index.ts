// obtencion de la variable de entorno BACKEND_URL
// para la url de la api
const back = import.meta.env.BACKEND_URL || "http://localhost:8080";
export const API_URL = back;
