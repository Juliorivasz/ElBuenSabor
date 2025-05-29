import { ArticuloManufacturado } from "../models/ArticuloManufacturado";
import { Categoria } from "../models/Categoria";
import { ArticuloInsumo } from "../models/ArticuloInsumo";
import { RubroInsumo } from "../models/RubroInsumo";
import { ArticuloManufacturadoDetalle } from "../models/ArticuloManufacturadoDetalle";
import { UnidadDeMedida } from "../models/UnidadDeMedida";

// Definimos los tipos para la API, anidando los tipos para mantener la estructura del JSON.
type UnidadMedidaApi = {
  idUnidadMedida: number;
  nombre: string;
};

type RubroInsumoApi = {
  idRubroInsumo: number;
  nombre: string;
  fechaBaja: string | null;
  listaInsumos: ArticuloInsumoApi[]; //Aunque en el modelo está vacía, la dejo por si acaso
  rubroInsumoPadre: RubroInsumoApi | null;
};

type ArticuloInsumoApi = {
  idInsumo: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  fechaBaja: string | null;
  unidadMedida: UnidadMedidaApi;
  rubroInsumo: RubroInsumoApi;
};

type ArticuloManufacturadoDetalleApi = {
  idArticuloManufacturadoDetalle: number;
  cantidad: number;
  articuloInsumo: ArticuloInsumoApi;
};

type CategoriaApi = {
  idCategoria: number;
  nombre: string;
  margenGanancia: number;
  fechaBaja: string | null;
  listaManufacturados: ArticuloManufacturadoApi[];
  categoriaPadre: CategoriaApi | null;
  imagen: string | null;
};

type ArticuloManufacturadoApi = {
  idArticulo: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  receta: string;
  tiempoDeCocina: number;
  detalles: ArticuloManufacturadoDetalleApi[];
  categoria: CategoriaApi;
  urlImagen: string;
};

type ArticuloManufacturadoPaginadoApi = {
  content: ArticuloManufacturadoApi[];
  totalPages: number;
};

type ArticuloManufacturadoPaginado = {
  content: ArticuloManufacturado[];
  totalPages: number;
};

// Función para parsear UnidadMedida
const parseUnidadMedida = (data: UnidadMedidaApi): UnidadDeMedida => {
  return new UnidadDeMedida(data.idUnidadMedida, data.nombre);
};

// Función para parsear RubroInsumo
const parseRubroInsumo = (data: RubroInsumoApi): RubroInsumo => {
  const rubroInsumoPadre = data.rubroInsumoPadre ? parseRubroInsumo(data.rubroInsumoPadre) : null;
  // Aquí está el cambio importante: mapeamos ArticuloInsumoApi a ArticuloInsumo
  const listaInsumos: ArticuloInsumo[] = data.listaInsumos
    ? data.listaInsumos.map((insumoApi) => parseArticuloInsumo(insumoApi))
    : [];

  return new RubroInsumo(
    data.idRubroInsumo,
    data.nombre,
    data.fechaBaja ? new Date(data.fechaBaja) : new Date(0),
    listaInsumos,
    rubroInsumoPadre,
  );
};

// Función para parsear ArticuloInsumo
const parseArticuloInsumo = (data: ArticuloInsumoApi): ArticuloInsumo => {
  return new ArticuloInsumo(
    data.idInsumo,
    data.nombre,
    data.stockActual,
    data.stockMinimo,
    data.stockMaximo,
    data.fechaBaja ? new Date(data.fechaBaja) : new Date(0),
    parseUnidadMedida(data.unidadMedida),
    parseRubroInsumo(data.rubroInsumo),
  );
};

// Función para parsear ArticuloManufacturadoDetalle
const parseArticuloManufacturadoDetalle = (
  data: ArticuloManufacturadoDetalleApi,
  articuloManufacturado: ArticuloManufacturado,
): ArticuloManufacturadoDetalle => {
  return new ArticuloManufacturadoDetalle(
    data.idArticuloManufacturadoDetalle,
    data.cantidad,
    articuloManufacturado,
    parseArticuloInsumo(data.articuloInsumo),
  );
};

// Función para parsear Categoria (usando tu función original)
const parseCategoria = (data: CategoriaApi): Categoria => {
  const padre = data.categoriaPadre ? parseCategoria(data.categoriaPadre) : null;
  // Corregimos el mapeo de listaManufacturados
  const listaManufacturados: ArticuloManufacturado[] = data.listaManufacturados
    ? data.listaManufacturados.map(parseArticuloManufacturado) // Usamos parseArticuloManufacturado
    : [];

  return new Categoria(
    data.idCategoria,
    data.nombre,
    data.margenGanancia,
    data.fechaBaja ? new Date(data.fechaBaja) : new Date(0),
    listaManufacturados,
    padre,
    data.imagen || null,
  );
};

// Función para parsear ArticuloManufacturado
const parseArticuloManufacturado = (data: ArticuloManufacturadoApi): ArticuloManufacturado => {
  const categoria = parseCategoria(data.categoria);

  // Primero creamos la instancia de ArticuloManufacturado
  const articuloManufacturado = new ArticuloManufacturado(
    data.idArticulo,
    data.nombre,
    data.descripcion,
    data.precioVenta,
    data.receta,
    data.tiempoDeCocina,
    [], // Inicialmente detalles vacío, se llenará después
    categoria,
    data.urlImagen, // Usamos directamente la URL de la imagen
  );

  // Luego parseamos los detalles, pasando la instancia de ArticuloManufacturado
  const detalles = data.detalles.map((detalleApi) =>
    parseArticuloManufacturadoDetalle(detalleApi, articuloManufacturado),
  );

  // Finalmente, retornamos la instancia de ArticuloManufacturado con los detalles parseados
  return new ArticuloManufacturado(
    data.idArticulo,
    data.nombre,
    data.descripcion,
    data.precioVenta,
    data.receta,
    data.tiempoDeCocina,
    detalles,
    categoria,
    data.urlImagen, // Y también aquí
  );
};

// Función para obtener los ArticulosManufacturados
export const fetchArticulosManufacturados = async (): Promise<ArticuloManufacturado[]> => {
  const response = await fetch("/src/services/data/articulosManufacturados.json"); // Ajusta la ruta si es necesario
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ArticuloManufacturadoApi[] = await response.json();
  return data.map(parseArticuloManufacturado);
};

// Función para obtener los ArticulosManufacturados con paginación desde el backend
export const fetchArticulosManufacturadosPaginados = async (page: number): Promise<ArticuloManufacturadoPaginado> => {
  const pagina = page;
  console.log(pagina);
  try {
    const response = await fetch(`/src/services/data/articulosPaginados${page}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArticuloManufacturadoPaginadoApi = await response.json();

    return {
      content: data.content.map(parseArticuloManufacturado),
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    throw error;
  }
};
