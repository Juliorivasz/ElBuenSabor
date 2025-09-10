import { CategoriaDTO } from "../models/dto/CategoriaDTO";
import { ImagenDTO } from "../models/dto/ImagenDTO";
import { ImagenApi } from "./types/abm/InformacionArticulosManufacturadoDto";

type CategoriaAbmApi = {
  idCategoria: number;
  nombre: string;
  idCategoriaPadre: number;
  imagenDto: ImagenApi;
};

export const parseCategoriaAbm = (data: CategoriaAbmApi) => {
  const imagenDto = new ImagenDTO(data.imagenDto?.url);
  return new CategoriaDTO(data.idCategoria, data.nombre, data.idCategoriaPadre);
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
