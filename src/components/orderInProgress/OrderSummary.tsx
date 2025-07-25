import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandMoreOutlined, ReceiptOutlined } from "@mui/icons-material";
import type { DetallePedidoCliente } from "../../types/OrderInProgress";

interface OrderSummaryProps {
  numeroOrden: number;
  productos: DetallePedidoCliente[];
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ productos, total }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
      {/* Header colapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <ReceiptOutlined className="text-gray-600 text-sm" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800">Resumen del pedido</p>
            <p className="text-sm text-gray-600">
              {productos.length} {productos.length === 1 ? "producto" : "productos"} • ${total}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}>
          <ExpandMoreOutlined className="text-gray-500" />
        </motion.div>
      </button>

      {/* Contenido expandible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-gray-200">
            <div className="p-4 space-y-3">
              {productos.map((producto, index) => (
                <motion.div
                  key={`${producto.nombreArticulo}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-100">
                  {/* Placeholder para imagen del producto */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs">🍔</span>
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{producto.nombreArticulo}</p>
                    <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${producto.subtotal}</p>
                  </div>
                </motion.div>
              ))}

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="font-bold text-lg text-orange-600">${total}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
