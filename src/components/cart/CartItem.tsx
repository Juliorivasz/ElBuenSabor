"use client"

import { useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import DeleteIcon from "@mui/icons-material/Delete"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import type { CartItem as CartItemType } from "../../store/cart/types/cart"
import { useCartStore } from "../../store/cart/useCartStore"

interface CartItemProps {
  item: CartItemType
}

const getItemId = (item: CartItemType): string => {
  if (item.type === "product" && item.articulo) {
    return `product-${item.articulo.getIdArticulo()}`
  }
  if (item.type === "promotion" && item.promocion) {
    return `promotion-${item.promocion.getIdPromocion()}`
  }
  return ""
}

export const CartItem = ({ item }: CartItemProps) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    await new Promise((resolve) => setTimeout(resolve, 200))
    removeItem(getItemId(item))
  }

  const isPromotion = item.type === "promotion"

  let name = ""
  let description = ""
  let imageUrl = ""
  let originalPrice = 0
  let finalPrice = 0
  let hasDiscount = false
  let discountPercentage = 0

  if (isPromotion && item.promocion) {
    name = item.promocion.getTitulo()
    description = item.promocion.getDescripcion()
    imageUrl = item.promocion.getUrl() || "/placeholder.svg?height=60&width=60"
    originalPrice = item.promocion.getPrecioBase()
    finalPrice = item.promocion.getPrecioPromocion()
    hasDiscount = true
    discountPercentage = Math.round(item.promocion.getDescuento())
  } else if (item.articulo) {
    name = item.articulo.getDescripcion()
    description = ""
    imageUrl = item.articulo.getUrl() || "/placeholder.svg?height=60&width=60"
    originalPrice = item.articulo.getPrecioVenta()
    finalPrice = item.promocionalDiscount ? originalPrice * (1 - item.promocionalDiscount) : originalPrice
    hasDiscount = item.promocionalDiscount ? item.promocionalDiscount > 0 : false
    discountPercentage = item.promocionalDiscount ? Math.round(item.promocionalDiscount * 100) : 0
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 transition-all duration-200 sm:rounded-xl sm:p-4 ${
        isRemoving ? "opacity-50 scale-95" : ""
      } ${isPromotion ? "border-orange-300 bg-orange-50/30" : ""}`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Imagen del producto/promoción */}
        <div className="flex-shrink-0 relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            className={`w-16 h-16 object-cover rounded-lg border ${
              isPromotion ? "border-orange-500" : "border-yellow-500"
            } sm:w-20 sm:h-20`}
          />
          {isPromotion && (
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
              <LocalOfferIcon sx={{ fontSize: 16 }} />
            </div>
          )}
        </div>

        {/* Información del producto/promoción */}
        <div className="flex-1 min-w-0">
          {isPromotion && (
            <span className="inline-block text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold mb-1">
              PROMOCIÓN
            </span>
          )}
          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate sm:text-base lg:text-lg">{name}</h3>
          {isPromotion && description && <p className="text-xs text-gray-600 mb-1 line-clamp-2">{description}</p>}
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <p className="text-sm text-gray-500 line-through sm:text-base">${originalPrice}</p>
                <p className="text-base font-bold text-green-600 sm:text-lg">${finalPrice}</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                  -{discountPercentage}%
                </span>
              </>
            ) : (
              <p className="text-base font-bold text-gray-900 sm:text-lg">${originalPrice.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Controles de cantidad */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => decreaseQuantity(getItemId(item))}
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors sm:w-10 sm:h-10"
            >
              <RemoveIcon className="text-sm sm:text-base" />
            </button>

            <span className="w-8 text-center font-bold text-lg text-black sm:w-12 sm:text-xl">{item.quantity}</span>

            <button
              onClick={() => increaseQuantity(getItemId(item))}
              className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-700 cursor-pointer flex items-center justify-center transition-colors sm:w-10 sm:h-10"
            >
              <AddIcon className="text-sm sm:text-base" />
            </button>
          </div>

          {/* Botón eliminar */}
          <button
            onClick={handleRemove}
            className="w-8 h-8 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer sm:w-10 sm:h-10 sm:ml-2"
            title="Eliminar producto"
          >
            <DeleteIcon className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    </div>
  )
}
