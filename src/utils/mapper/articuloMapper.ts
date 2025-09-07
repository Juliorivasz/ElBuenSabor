import { ArticuloDTOJson } from "../../models/interface/ArticuloDTOJson";
import { ArticuloDTO } from "../../models/dto/ArticuloDTO";

export const articuloMapper = (data: ArticuloDTOJson): ArticuloDTO => {
  return new ArticuloDTO(
    data.idArticulo,
    data.nombre,
    data.descripcion,
    data.precioVenta,
    data.tiempoDeCocina,
    data.idCategoria,
    data.url,
    data.puedeElaborarse,
  );
};
