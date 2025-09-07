import { ArticuloDTO } from "../../../models/dto/ArticuloDTO";

export interface ProductsListProps {
  products: ArticuloDTO[];
  onSelectProduct: (product: ArticuloDTO) => void;
  categoryKey: string;
}

export interface ProductCardProps {
  product: ArticuloDTO;
  onClick: () => void;
}
export interface ModalProductProps {
  product: ArticuloDTO;
  onClose: () => void;
  onAddToCart: (product: ArticuloDTO, quantity: number) => void;
}
