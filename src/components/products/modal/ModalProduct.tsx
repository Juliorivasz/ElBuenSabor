//
import { useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import type { ModalProductProps } from "../types/products";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginModal } from "./LoginModal";

export const ModalProduct: React.FC<ModalProductProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleAddToCartClick = () => {
    if (!product.getPuedeElaborarse()) {
      return;
    }

    if (isAuthenticated) {
      onAddToCart(product, quantity);
      handleClose();
    } else {
      setShowLoginModal(true);
    }
  };

  // Funciones para los botones del modal de login
  const handleLogin = () => {
    setShowLoginModal(false);
    handleClose();
    loginWithRedirect({ appState: { returnTo: window.location.origin } });
  };

  const handleSignup = () => {
    setShowLoginModal(false);
    handleClose();
    loginWithRedirect({
      authorizationParams: { screen_hint: "signup" },
      appState: { returnTo: window.location.origin },
    });
  };

  // Manejar click en el backdrop para cerrar
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Contenido del modal principal
  const modalContent = (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/40 flex justify-center items-center text-black p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}>
          <motion.div
            key="modal"
            initial={{ scale: 0.7, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.3, rotate: 15, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white rounded-xl max-w-md w-11/12 relative shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 cursor-pointer bg-gray-200 hover:bg-red-500 text-black hover:text-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-all duration-200"
              aria-label="Cerrar">
              <CloseIcon />
            </button>

            <div className="relative bg-gray-300">
              <img
                src={product.getImagenModel() || "/placeholder.svg"}
                alt={product.getNombre()}
                className={`w-full h-48 object-cover ${product.getPuedeElaborarse() ? "" : "grayscale-100"}`}
              />
              <span className="absolute bottom-4 left-2 bg-white text-black text-md px-4 py-2 rounded">
                {product.getTiempoDeCocina()} min
              </span>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold">{product.getNombre()}</h2>
                <p className="text-md font-semibold text-black">${product.getPrecioVenta()}</p>
              </div>

              <p className="text-sm text-gray-600 mb-4">{product.getDescripcion()}</p>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    value={!product.getPuedeElaborarse() ? quantity - 1 : quantity}
                    disabled={!product.getPuedeElaborarse()}
                    min={1}
                    max={10}
                    onChange={handleQuantityChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  disabled={!product.getPuedeElaborarse()}
                  onClick={handleAddToCartClick}
                  className={`h-10 mt-6 px-4 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    product.getPuedeElaborarse()
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}>
                  {product.getPuedeElaborarse()
                    ? `Agregar a mi orden ($${(product.getPrecioVenta() * quantity).toFixed(2)})`
                    : "Sin stock"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Contenido del modal de login con z-index mayor
  const loginModalContent = showLoginModal && (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 flex justify-center items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );

  return (
    <>
      {/* Modal principal */}
      {typeof document !== "undefined" && createPortal(modalContent, document.body)}

      {/* Modal de login con z-index mayor */}
      {typeof document !== "undefined" && showLoginModal && createPortal(loginModalContent, document.body)}
    </>
  );
};
