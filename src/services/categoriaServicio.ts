import { CategoriaDTO } from "../models/dto/CategoriaDTO";

type CategoriaAbmApi = {
  idCategoria: number;
  nombre: string;
  idCategoriaPadre: number;
  margenGanancia: number;
  fechaBaja?: Date;
};

export const parseCategoriaAbm = (data: CategoriaAbmApi) => {
  return new CategoriaDTO(data.idCategoria, data.nombre, data.idCategoriaPadre, data.margenGanancia, data.fechaBaja);
};

export const fetchCategoriasAbm = async (): Promise<CategoriaDTO[]> => {
  const response = await fetch("https://localhost:8080/categoria/lista");
  const data: CategoriaAbmApi[] = await response.json();
  return data.map(parseCategoriaAbm);
};

export const fetchCategoriaAbm = async (id: number): Promise<string> => {
  const response = await fetch(`https://localhost:8080/categoria/obtenerNombre/${id}`);
  const data = await response.json();
  return data;
};
