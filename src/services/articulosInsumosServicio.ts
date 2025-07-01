import { InsumoDTO } from "../models/dto/InsumoDTO";
import { interceptorsApiClient } from "./interceptors/axios.interceptors";

type InsumoDtoApi = {
  idArticuloInsumo: number;
  unidadDeMedida: string;
  nombre: string;
  costo: number;
};

const parseInsumoDTO = (data: InsumoDtoApi) => {
  return new InsumoDTO(data.idArticuloInsumo, data.unidadDeMedida, data.nombre, data.costo);
};

export const fetchInsumoAbm = async (): Promise<InsumoDTO[]> => {
  const response = await interceptorsApiClient.get("/insumo/lista");
  const content: InsumoDtoApi[] = response.data.insumos;
  console.log(content);
  return content.map(parseInsumoDTO);
};
