// obtencion de la variable de entorno BACKEND_URL
// para la url de la api
const env = import.meta.env;
export const API_URL = env.BACKEND_URL;
