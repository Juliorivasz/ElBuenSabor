import { ArticuloManufacturado } from "../models/ArticuloManufacturado";
import { Categoria } from "../models/Categoria";

type CategoriaApi = {
  idCategoria: number;
  nombre: string;
  margenGanancia: number;
  fechaBaja: string | null;
  listaManufacturados: ArticuloManufacturado[];
  categoriaPadre: CategoriaApi | null;
  imagen: string | null;
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

export const fetchCategorias = async (): Promise<Categoria[]> => {
  const response = await fetch("/src/services/data/categorias.json");
  const data: CategoriaApi[] = await response.json();
  return data.map(parseCategoria);
};
