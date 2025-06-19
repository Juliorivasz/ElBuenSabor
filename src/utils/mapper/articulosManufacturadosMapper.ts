import { ArticuloManufacturadoDetalleDto } from "../../models/dto/ArticuloManufacturadoDetalleDto";
import { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto";
import { NuevoArticuloManufacturadoDto } from "../../models/dto/NuevoArticuloManufacturadoDto";

export const mapperInformacionArticuloManufacturadoDtoToNuevoArticuloManufacturadoDto = (
  data: InformacionArticuloManufacturadoDto,
) => {
  const detalles = data.getDetalles().map((articulo) => {
    const newDetalles = new ArticuloManufacturadoDetalleDto(articulo.getIdArticuloInsumo(), articulo.getCantidad());
    return newDetalles;
  });
  const newProduct = new NuevoArticuloManufacturadoDto(
    data.getNombre(),
    data.getDescripcion(),
    data.getReceta(),
    data.getPrecioVenta(),
    data.getTiempoDeCocina(),
    data.isDadoDeAlta(),
    data.getIdCategoria(),
    data.getImagenDto()!,
    detalles,
  );
  return newProduct;
};
