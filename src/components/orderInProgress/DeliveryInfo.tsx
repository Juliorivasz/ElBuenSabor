import type React from "react";
import { motion } from "framer-motion";
import {
  PersonOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  StorefrontOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import type { Repartidor, TipoEnvio } from "../../types/OrderInProgress";

interface DeliveryInfoProps {
  repartidor: Repartidor | null;
  tipoEntrega: TipoEnvio;
  direccionEntrega?: string;
}

export const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ repartidor, tipoEntrega, direccionEntrega }) => {
  const isDelivery = tipoEntrega === "DELIVERY";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center space-x-2 mb-3">
        {isDelivery ? (
          <LocalShippingOutlined className="text-orange-500" />
        ) : (
          <StorefrontOutlined className="text-orange-500" />
        )}
        <h4 className="font-semibold text-gray-800">{isDelivery ? "Información de Delivery" : "Retiro en Local"}</h4>
      </div>

      {isDelivery ? (
        <div className="space-y-3">
          {/* Información del repartidor */}
          {repartidor ? (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <PersonOutlined className="text-orange-600 text-sm" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {repartidor.nombre} {repartidor.apellido}
                  </p>
                  <p className="text-sm text-gray-600">Repartidor asignado</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <PhoneOutlined className="text-xs" />
                <span>{repartidor.telefono}</span>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-sm text-yellow-800">🚚 Asignando repartidor...</p>
            </div>
          )}

          {/* Dirección de entrega */}
          {direccionEntrega && (
            <div className="flex items-start space-x-3">
              <LocationOnOutlined className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Entregar en:</p>
                <p className="font-medium text-gray-800">{direccionEntrega}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <StorefrontOutlined className="text-green-600 text-sm" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Retiro en local</p>
              <p className="text-sm text-gray-600">Podrás retirar tu pedido cuando esté listo</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
