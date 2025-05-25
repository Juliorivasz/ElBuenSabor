import { ArticuloManufacturado } from "../../../models/ArticuloManufacturado";

export interface ProductsListProps {
  products: ArticuloManufacturado[];
  onSelectProduct: (product: ArticuloManufacturado) => void;
  categoryKey: string;
}

export interface ProductCardProps {
  product: ArticuloManufacturado;
  onClick: () => void;
}
export interface ModalProductProps {
  product: ArticuloManufacturado;
  onClose: () => void;
  onAddToCart: (product: ArticuloManufacturado, quantity: number) => void;
}
