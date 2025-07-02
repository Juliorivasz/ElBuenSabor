import { interceptorsApiClient } from "./interceptors/axios.interceptors";

export const deleteImageClient = async () => {
  await interceptorsApiClient.delete(`/cliente/imagen/delete`);
};

export const uploadImageEmployee = async () => {
  await interceptorsApiClient.post("/articuloManufacturado/nuevo");
};

export const uploadImageArticule = async () => {
  await interceptorsApiClient.post("/articuloManufacturado/nuevo");
};
