import type { InformacionArticuloNoElaboradoDto } from "../../models/dto/InformacionArticuloNoElaboradoDto";
import { NuevoArticuloNoElaboradoDto } from "../../models/dto/NuevoArticuloNoElaboradoDto";

export const mapperInformacionArticuloNoElaboradoDtoToNuevoArticuloNoElaboradoDto = (
  informacion: InformacionArticuloNoElaboradoDto,
): NuevoArticuloNoElaboradoDto => {
  return new NuevoArticuloNoElaboradoDto(
    informacion.getNombre(),
    informacion.getDescripcion(),
    informacion.getPrecioVenta(),
    informacion.isDadoDeAlta(),
    informacion.getIdCategoria(),
    informacion.getImagenUrl() ?? undefined,
  );
};
