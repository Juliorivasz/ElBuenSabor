import { InsumoDTO } from "../models/dto/InsumoDTO";

type InsumoDtoApi = {
  idArticuloInsumo: number;
  nombre: string;
};

const parseInsumoDTO = (data: InsumoDtoApi) => {
  return new InsumoDTO(data.idArticuloInsumo, data.nombre);
};

export const fetchInsumoAbm = async (): Promise<InsumoDTO[]> => {
  const response = await fetch("http://localhost:8080/insumo/lista");
  const data: InsumoDtoApi[] = await response.json();
  return data.map(parseInsumoDTO);
};
