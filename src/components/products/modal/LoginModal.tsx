import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onSignup }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/60 flex justify-center items-center text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            key="login-modal"
            initial={{ scale: 0.8, y: -50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl max-w-sm w-11/12 p-6 relative shadow-2xl text-center">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 cursor-pointer bg-gray-200 hover:bg-red-500 text-black hover:text-white rounded-full w-7 h-7 flex items-center justify-center shadow transition-all duration-200"
              aria-label="Cerrar">
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-red-600">¡Necesitas iniciar sesión!</h2>
            <p className="text-gray-700 mb-6">
              Para agregar productos a tu carrito y realizar pedidos, por favor, inicia sesión o regístrate.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onLogin}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 cursor-pointer rounded-full transition-colors duration-300 ease-in-out">
                INGRESAR
              </button>
              <button
                onClick={onSignup}
                className="bg-white hover:bg-gray-200 text-red-500 border border-red-500 font-bold py-2 px-4 cursor-pointer rounded-full transition-colors duration-300 ease-in-out">
                REGISTRATE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
