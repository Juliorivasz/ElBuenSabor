import { ArticuloManufacturadoDetalleDto } from "../../models/dto/ArticuloManufacturadoDetalleDto";
import type { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto";
import { NuevoArticuloManufacturadoDto } from "../../models/dto/NuevoArticuloManufacturadoDto";

export const mapperInformacionArticuloManufacturadoDtoToNuevoArticuloManufacturadoDto = (
  informacion: InformacionArticuloManufacturadoDto,
): NuevoArticuloManufacturadoDto => {
  // Mapear los detalles
  const detalles = informacion.getDetalles().map((detalle) => {
    return new ArticuloManufacturadoDetalleDto(detalle.getIdArticuloInsumo(), detalle.getCantidad());
  });

  return new NuevoArticuloManufacturadoDto(
    informacion.getNombre(),
    informacion.getDescripcion(),
    informacion.getReceta(),
    informacion.getPrecioVenta(),
    informacion.getTiempoDeCocina(),
    informacion.isDadoDeAlta(),
    informacion.getIdCategoria(),
    detalles,
    informacion.getImagenUrl() || undefined,
  );
};
