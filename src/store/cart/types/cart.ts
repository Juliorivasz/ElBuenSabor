import { ArticuloManufacturado } from "../../../models/ArticuloManufacturado";

export interface CartItem {
  articulo: ArticuloManufacturado;
  quantity: number;
  imagenUrl?: string;
}

export interface CartState {
  items: CartItem[];
}

export interface CartActions {
  addItem: (articulo: ArticuloManufacturado, imagenUrl?: string) => void;
  removeItem: (articuloId: number) => void;
  increaseQuantity: (articuloId: number) => void;
  decreaseQuantity: (articuloId: number) => void;
  clearCart: () => void;
}

export interface CartSelectors {
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export type CartStore = CartState & CartActions & CartSelectors;
