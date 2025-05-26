import type React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBagOutlined } from "@mui/icons-material";

interface CartButtonProps {
  cartItemsCount: number;
  cartAnimation: boolean;
  isMobile?: boolean;
  onNavigate?: (path: string) => void;
}

export const CartButton: React.FC<CartButtonProps> = ({
  cartItemsCount,
  cartAnimation,
  isMobile = false,
  onNavigate,
}) => {
  const handleClick = () => {
    if (isMobile && onNavigate) {
      onNavigate("/cart");
    }
  };

  const buttonContent = (
    <>
      <ShoppingBagOutlined
        className="group-hover:scale-110 transition-transform duration-200"
        sx={{ fontSize: { xs: 20, sm: 24 } }}
      />
      <AnimatePresence>
        {cartItemsCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-yellow-400 text-orange-900 text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <motion.span
              key={cartItemsCount}
              initial={{ scale: 1.5, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500 }}>
              {cartItemsCount > 99 ? "99+" : cartItemsCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const buttonClasses = isMobile
    ? "w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
    : "relative p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 group";

  // Animación combinada para el carrito
  const cartAnimationProps = cartAnimation ? { scale: [1, 1.05, 1] } : { opacity: 1, y: 0 };

  if (isMobile) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={cartAnimation ? { ...cartAnimationProps, opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={handleClick}
        className={buttonClasses}>
        <div className="flex items-center space-x-3">
          <ShoppingBagOutlined
            className="group-hover:scale-110 transition-transform"
            sx={{ fontSize: 24 }}
          />
          <span className="font-medium">Mi Carrito</span>
        </div>
        {cartItemsCount > 0 && (
          <div className="bg-yellow-400 text-orange-900 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartItemsCount > 99 ? "99+" : cartItemsCount}
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
      animate={cartAnimation ? { scale: [1, 1.1, 1] } : {}}>
      <Link
        to="/cart"
        className={buttonClasses}>
        {buttonContent}
      </Link>
    </motion.div>
  );
};
