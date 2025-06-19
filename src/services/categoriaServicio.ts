import { ArticuloManufacturado } from "../models/ArticuloManufacturado";
import { Categoria } from "../models/Categoria";
import { CategoriaDTO } from "../models/dto/CategoriaDTO";
import { ImagenDTO } from "../models/dto/ImagenDTO";
import { ImagenApi } from "./articuloManufacturadoServicio";

type CategoriaApi = {
  idCategoria: number;
  nombre: string;
  margenGanancia: number;
  fechaBaja: string | null;
  listaManufacturados: ArticuloManufacturado[];
  categoriaPadre: CategoriaApi | null;
  imagen: string | null;
};

type CategoriaAbmApi = {
  idCategoria: number;
  nombre: string;
  idCategoriaPadre: number;
  imagenDto: ImagenApi;
};

export const parseCategoria = (data: CategoriaApi): Categoria => {
  const padre = data.categoriaPadre ? parseCategoria(data.categoriaPadre) : null;

  return new Categoria(
    data.idCategoria,
    data.nombre,
    data.margenGanancia,
    data.fechaBaja ? new Date(data.fechaBaja) : new Date(),
    data.listaManufacturados || [],
    padre,
    data.imagen || null,
  );
};

export const parseCategoriaAbm = (data: CategoriaAbmApi) => {
  const imagenDto = new ImagenDTO(data.imagenDto?.url);
  return new CategoriaDTO(data.idCategoria, data.nombre, data.idCategoriaPadre, imagenDto);
};

export const fetchCategorias = async (): Promise<Categoria[]> => {
  const response = await fetch("/src/services/data/categorias.json");
  const data: CategoriaApi[] = await response.json();
  return data.map(parseCategoria);
};

export const fetchCategoriasAbm = async (): Promise<CategoriaDTO[]> => {
  const response = await fetch("http://localhost:8080/categoria/lista");
  const data: CategoriaAbmApi[] = await response.json();
  return data.map(parseCategoriaAbm);
};

export const fetchCategoriaAbm = async (id: number): Promise<string> => {
  const response = await fetch(`http://localhost:8080/categoria/obtenerNombre/${id}`);
  const data = await response.json();
  return data;
};
