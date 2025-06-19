import { useState } from "react";
import { Store, LocalShipping, Edit } from "@mui/icons-material";
import { motion } from "framer-motion";

type DeliveryType = "pickup" | "delivery";

export const DeliveryOptions = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>("pickup");
  const [customerAddress] = useState("Av. San Martín 1234, Mendoza"); // Esto vendría del perfil del usuario

  const getEstimatedTime = () => {
    return selectedDelivery === "pickup" ? "20-30 minutos" : "45-60 minutos";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tipo de Entrega</h3>

      {/* Opciones de entrega */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedDelivery("pickup")}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedDelivery === "pickup" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
          }`}>
          <div className="flex items-center gap-3">
            <Store className={`w-6 h-6 ${selectedDelivery === "pickup" ? "text-green-600" : "text-gray-600"}`} />
            <div className="text-left">
              <p className={`font-semibold ${selectedDelivery === "pickup" ? "text-green-800" : "text-gray-800"}`}>
                Retiro en Local
              </p>
              <p className="text-sm text-gray-600">Sin costo adicional</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedDelivery("delivery")}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedDelivery === "delivery" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
          }`}>
          <div className="flex items-center gap-3">
            <LocalShipping
              className={`w-6 h-6 ${selectedDelivery === "delivery" ? "text-green-600" : "text-gray-600"}`}
            />
            <div className="text-left">
              <p className={`font-semibold ${selectedDelivery === "delivery" ? "text-green-800" : "text-gray-800"}`}>
                Delivery
              </p>
              <p className="text-sm text-gray-600">$500 adicional</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Información adicional según el tipo de entrega */}
      {selectedDelivery === "delivery" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Dirección de entrega:</p>
              <p className="text-gray-600">{customerAddress}</p>
            </div>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Edit className="w-4 h-4" />
              <span className="font-medium">Cambiar dirección</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Tiempo estimado */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-blue-800 font-medium">⏱️ Tiempo estimado: {getEstimatedTime()}</p>
      </div>
    </div>
  );
};
