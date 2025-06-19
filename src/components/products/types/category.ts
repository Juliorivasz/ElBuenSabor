import { CategoriaDTO } from "../../../models/dto/CategoriaDTO";

export interface CategoryProps {
  categorias: CategoriaDTO[];
  selected: string | null;
  onSelect: (cat: string) => void;
}

export type CategoryFiltersProps = {
  categories: readonly string[];
  selected: string;
  onSelect: (cat: string) => void;
};
