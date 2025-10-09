import { create } from "zustand"
import type { CartStore } from "./types/cart"

const getItemId = (item: { articulo?: any; promocion?: any; type: "product" | "promotion" }): string => {
  if (item.type === "product" && item.articulo) {
    return `product-${item.articulo.getIdArticulo()}`
  }
  if (item.type === "promotion" && item.promocion) {
    return `promotion-${item.promocion.getIdPromocion()}`
  }
  return ""
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (articulo, imagenUrl, promocionalDiscount) => {
    set((state) => {
      const itemId = `product-${articulo.getIdArticulo()}`
      const existingItem = state.items.find((item) => getItemId(item) === itemId)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          getItemId(item) === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return { items: updatedItems }
      } else {
        return {
          items: [...state.items, { articulo, quantity: 1, imagenUrl, promocionalDiscount, type: "product" as const }],
        }
      }
    })
  },

  addPromotion: (promocion) => {
    set((state) => {
      const itemId = `promotion-${promocion.getIdPromocion()}`
      const existingItem = state.items.find((item) => getItemId(item) === itemId)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          getItemId(item) === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return { items: updatedItems }
      } else {
        return {
          items: [
            ...state.items,
            { promocion, quantity: 1, imagenUrl: promocion.getUrl(), type: "promotion" as const },
          ],
        }
      }
    })
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => getItemId(item) !== itemId),
    }))
  },

  increaseQuantity: (itemId) => {
    set((state) => ({
      items: state.items.map((item) => (getItemId(item) === itemId ? { ...item, quantity: item.quantity + 1 } : item)),
    }))
  },

  decreaseQuantity: (itemId) => {
    set((state) => ({
      items: state.items.map((item) =>
        getItemId(item) === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      if (item.type === "product" && item.articulo) {
        const basePrice = item.articulo.getPrecioVenta() * item.quantity
        const discountedPrice = item.promocionalDiscount ? basePrice * (1 - item.promocionalDiscount) : basePrice
        return total + discountedPrice
      }
      if (item.type === "promotion" && item.promocion) {
        return total + item.promocion.getPrecioPromocion() * item.quantity
      }
      return total
    }, 0)
  },

  isPromocionalDiscount: () => {
    return get().items.some(
      (item) =>
        (item.type === "product" && typeof item.promocionalDiscount === "number" && item.promocionalDiscount > 0) ||
        item.type === "promotion",
    )
  },
}))
