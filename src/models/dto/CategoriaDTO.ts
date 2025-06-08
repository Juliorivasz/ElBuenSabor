export class CategoriaDTO {
  private idCategoria: number;
  private nombre: string;
  private categoriaPadre: CategoriaDTO | null;
  private imagen: string | null;
}
