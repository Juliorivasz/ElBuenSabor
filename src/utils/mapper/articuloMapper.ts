import { ArticuloDTOJson } from "../../models/interface/ArticuloDTOJson";
import { ArticuloDTO } from "../../models/dto/ArticuloDTO";
import { ImagenDTO } from "../../models/dto/ImagenDTO";

export const articuloMapper = (data: ArticuloDTOJson): ArticuloDTO => {
  const imagenDto = new ImagenDTO(data.imagenDto?.url ?? "");

  return new ArticuloDTO(
    data.idArticulo,
    data.nombre,
    data.descripcion,
    data.precioVenta,
    data.tiempoDeCocina,
    data.idCategoria,
    imagenDto,
    data.puedeElaborarse,
  );
};
