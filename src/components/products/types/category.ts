import { Categoria } from "../../../models/Categoria";

export interface CategoryProps {
  categorias: Categoria[];
  selected: string | null;
  onSelect: (cat: string) => void;
}

export type CategoryFiltersProps = {
  categories: readonly string[];
  selected: string;
  onSelect: (cat: string) => void;
};
