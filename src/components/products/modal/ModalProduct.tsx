import React, { useState } from "react";
import { Product } from "../types/products";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProductProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ModalProduct: React.FC<ModalProductProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 400); //desmonta el modal
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            key="modal"
            initial={{ scale: 0.7, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.3, rotate: 15, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white rounded-xl max-w-md w-11/12 relative shadow-xl overflow-hidden">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 cursor-pointer bg-gray-200 hover:bg-red-500 text-black hover:text-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-all duration-200"
              aria-label="Cerrar">
              <CloseIcon />
            </button>

            <div className="relative bg-gray-300">
              <img
                src={product.image}
                alt={product.title}
                className={`w-full h-48 object-cover ${product.stock !== 0 ? "" : "grayscale-100"}`}
              />
              <span className="absolute bottom-4 left-2 bg-white text-black text-md px-4 py-2 rounded">
                {product.cookingTime}
              </span>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold">{product.title}</h2>
                <p className="text-md font-semibold text-black">${product.price}</p>
              </div>

              <p className="text-sm text-gray-600 mb-4">{product.description}</p>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    value={product.stock <= 0 ? quantity - 1 : quantity}
                    disabled={product.stock <= 0}
                    min={1}
                    max={product.stock}
                    onChange={handleQuantityChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  disabled={product.stock <= 0}
                  onClick={() => {
                    onAddToCart(product, quantity);
                    handleClose();
                  }}
                  className={`h-10 mt-6 px-4 rounded-lg whitespace-nowrap transition-colors ${
                    product.stock > 0
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}>
                  {product.stock > 0 ? `Agregar a mi orden ($${(product.price * quantity).toFixed(2)})` : "Sin stock"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
