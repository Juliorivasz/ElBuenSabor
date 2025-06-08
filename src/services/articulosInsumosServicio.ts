import { InsumoDTO } from "../models/dto/InsumoDTO";
import { interceptorsApiClient } from "./interceptors/axios.interceptors";

type InsumoDtoApi = {
  idArticuloInsumo: number;
  unidadDeMedida: string;
  nombre: string;
};

const parseInsumoDTO = (data: InsumoDtoApi) => {
  return new InsumoDTO(data.idArticuloInsumo, data.unidadDeMedida, data.nombre);
};

export const fetchInsumoAbm = async (): Promise<InsumoDTO[]> => {
  const response = interceptorsApiClient.get("http://localhost:8080/insumo/lista");
  const data: InsumoDtoApi[] = (await response).data;
  return data.map(parseInsumoDTO);
};
