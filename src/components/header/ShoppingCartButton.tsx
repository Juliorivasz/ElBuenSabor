import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCartStore } from "../../store/cart/useCartStore";

interface ShoppingCartButtonProps {
  isHiddenOnMobile?: boolean;
}

export const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({ isHiddenOnMobile = false }) => {
  const itemsCount = useCartStore((state) => state.getTotalItems());

  const mobileClass = isHiddenOnMobile ? "hidden md:block" : "";

  return (
    <div className={`relative ${mobileClass}`}>
      <button className="text-white relative cursor-pointer">
        <ShoppingCartIcon />
        {itemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {itemsCount}
          </span>
        )}
      </button>
    </div>
  );
};
