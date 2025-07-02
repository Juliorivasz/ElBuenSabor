import { InformacionArticuloManufacturadoDto } from "../models/dto/InformacionArticuloManufacturadoDto";
import { InformacionDetalleDto } from "../models/dto/InformacionDetalleDto";
import { NuevoArticuloManufacturadoDto } from "../models/dto/NuevoArticuloManufacturadoDto";
import { interceptorsApiClient } from "./interceptors/axios.interceptors";
import {
  InformacionArticuloManufacturadoDtoApi,
  InformacionDetalleDTOApi,
  PaginatedResponseAbm,
  PaginatedResponseAbmApi,
} from "./types/abm/InformacionArticulosManufacturadoDto";

const parseDetallesDTO = (data: InformacionDetalleDTOApi) => {
  return new InformacionDetalleDto(data.idArticuloInsumo, data.nombreInsumo, data.unidadDeMedida, data.cantidad);
};

const parseInformacionArticuloManufacturadoDTO = (data: InformacionArticuloManufacturadoDtoApi) => {
  const detalles = data.detalles.map(parseDetallesDTO);

  return new InformacionArticuloManufacturadoDto(
    data.idArticulo,
    data.nombre,
    data.descripcion,
    data.precioVenta,
    data.precioModificado,
    data.receta,
    data.tiempoDeCocina,
    data.dadoDeAlta,
    data.idCategoria,
    data.nombreCategoria,
    data.imagenUrl,
    detalles,
  );
};

export const fetchArticulosManufacturadosAbm = async (
  page: number,
  itemsPerPage: number = 12,
): Promise<PaginatedResponseAbm> => {
  const response = await interceptorsApiClient.get(`/articuloManufacturado/abm?page=${page}&size=${itemsPerPage}`);
  const data: PaginatedResponseAbmApi = response.data;
  console.log({ ...data, content: data.content });
  const content = data.content.map(parseInformacionArticuloManufacturadoDTO);

  return { ...data, content: content };
};

// Función para realizar alta/baja lógica de un producto
export const altaBajaArticuloManufacturado = async (id: number, dadoDeAlta: boolean): Promise<void> => {
  interceptorsApiClient.post("/articuloManufacturado/altaBajaLogica", {
    id,
    dadoDeAlta,
  });
};

// Función para crear un nuevo artículo manufacturado
export const crearArticuloManufacturado = async (producto: NuevoArticuloManufacturadoDto) => {
  // Convertir el DTO a la estructura requerida por la API

  await interceptorsApiClient.post("/articuloManufacturado/nuevo", producto.toJSON());
};

// Función para actualizar un artículo manufacturado
export const actualizarArticuloManufacturado = async (
  id: number,
  producto: InformacionArticuloManufacturadoDto,
): Promise<boolean> => {
  // Convertir el DTO a la estructura requerida por la API

  const requestBody = {
    idArticulo: producto.getidArticulo(),
    nombre: producto.getNombre(),
    descripcion: producto.getDescripcion(),
    precioVenta: producto.getPrecioVenta(),
    receta: producto.getReceta(),
    tiempoDeCocina: producto.getTiempoDeCocina(),
    dadoDeAlta: producto.isDadoDeAlta(),
    idCategoria: producto.getIdCategoria(),
    nombreCategoria: producto.getNombreCategoria(),
    imagenUrl: producto.getImagenUrl() || null,
    detalles: producto.getDetalles().map((detalle) => ({
      idArticuloInsumo: detalle.getIdArticuloInsumo(),
      nombreInsumo: detalle.getNombreInsumo(),
      unidadDeMedida: detalle.getUnidadDeMedida(),
      cantidad: detalle.getCantidad(),
    })),
  };

  interceptorsApiClient.put(`/articuloManufacturado/modificar/${id}`, requestBody);

  return true;
};
