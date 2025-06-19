import { InformacionArticuloNoElaboradoDto } from "../../models/dto/InformacionArticuloNoElaboradoDto";
import { NuevoArticuloNoElaboradoDto } from "../../models/dto/NuevoArticuloNoElaboradoDto";

export const mapperInformacionArticuloNoElaboradoDtoToNuevoArticuloNoElaboradoDto = (
  data: InformacionArticuloNoElaboradoDto,
) => {
  const newProduct = new NuevoArticuloNoElaboradoDto(
    data.getNombre(),
    data.getDescripcion(),
    data.getPrecioVenta(),
    data.isDadoDeAlta(),
    data.getIdCategoria(),
    data.getImagenDto()!,
  );
  return newProduct;
};
