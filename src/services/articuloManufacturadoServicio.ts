import { InformacionArticuloManufacturadoDto } from "../models/dto/InformacionArticuloManufacturadoDto";
import { InformacionDetalleDto } from "../models/dto/InformacionDetalleDto";
import type { NuevoArticuloManufacturadoDto } from "../models/dto/NuevoArticuloManufacturadoDto";
import { interceptorsApiClient } from "./interceptors/axios.interceptors";
import type {
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
  itemsPerPage = 12,
): Promise<PaginatedResponseAbm> => {
  const response = await interceptorsApiClient.get(`/articuloManufacturado/abm?page=${page}&size=${itemsPerPage}`);
  const data: PaginatedResponseAbmApi = response.data;
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
export const crearArticuloManufacturado = async (producto: NuevoArticuloManufacturadoDto, file?: File) => {
  const formData = new FormData();

  // Agregar el JSON del artículo como string
  formData.append("articulo", JSON.stringify(producto.toJSON()));

  // Agregar el archivo si existe
  if (file) {
    formData.append("file", file);
    console.log("Archivo adjuntado:", file.name, file.type, file.size);
  }

  console.log("Enviando datos:", JSON.stringify(producto.toJSON()));

  const response = await interceptorsApiClient.post("/articuloManufacturado/nuevo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Respuesta del servidor:", response.data);
  return response.data;
};

// Función para actualizar un artículo manufacturado
export const actualizarArticuloManufacturado = async (
  id: number,
  producto: InformacionArticuloManufacturadoDto,
  file?: File,
): Promise<boolean> => {
  const formData = new FormData();

  // Convertir el DTO a la estructura requerida por la API
  const requestBody = {
    idArticulo: producto.getidArticulo(),
    nombre: producto.getNombre(),
    descripcion: producto.getDescripcion(),
    precioVenta: producto.getPrecioVenta(),
    precioModificado: producto.getPrecioModificado(),
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

  // Agregar el JSON del artículo
  formData.append("articulo", JSON.stringify(requestBody));

  // Agregar el archivo si existe
  if (file) {
    formData.append("file", file);
    console.log("Archivo adjuntado para actualización:", file.name, file.type, file.size);
  }
  console.log(requestBody);

  const response = await interceptorsApiClient.put(`/articuloManufacturado/modificar/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Respuesta del servidor para actualización:", response.data);
  return true;
};
