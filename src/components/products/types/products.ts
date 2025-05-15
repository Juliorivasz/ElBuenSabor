export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  cookingTime: string;
  stock: number;
  category: "carne" | "pollo" | "veganas";
  image: string;
};

export interface ProductsListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  categoryKey: string;
}

export interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export type ProductProps = {
  product: Product;
};
