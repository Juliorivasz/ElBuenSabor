import type { ArticuloDTO } from "../../../models/dto/ArticuloDTO"
import type { PromocionCatalogoDto } from "../../../models/dto/Promociones/PromocionCatalogoDto"

export interface CartItem {
  articulo?: ArticuloDTO
  promocion?: PromocionCatalogoDto
  quantity: number
  imagenUrl?: string
  promocionalDiscount?: number
  type: "product" | "promotion"
}

export interface CartState {
  items: CartItem[]
}

export interface CartActions {
  addItem: (articulo: ArticuloDTO, imagenUrl?: string, promocionalDiscount?: number) => void
  addPromotion: (promocion: PromocionCatalogoDto) => void
  removeItem: (itemId: string) => void
  increaseQuantity: (itemId: string) => void
  decreaseQuantity: (itemId: string) => void
  clearCart: () => void
}

export interface CartSelectors {
  getTotalItems: () => number
  getTotalPrice: () => number
  isPromocionalDiscount: () => boolean
}

export type CartStore = CartState & CartActions & CartSelectors
