import type React from "react";
import { motion } from "framer-motion";
import {
  HourglassEmptyOutlined,
  RestaurantOutlined,
  CheckCircleOutlined,
  LocalShippingOutlined,
  DoneAllOutlined,
  CancelOutlined,
  ErrorOutlined,
} from "@mui/icons-material";
import type { EstadoPedido } from "../../types/OrderInProgress";

interface OrderStatusCardProps {
  estado: EstadoPedido;
  tiempoTranscurrido: number;
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ estado, tiempoTranscurrido }) => {
  // Configuración de estados
  const statusConfig = {
    A_CONFIRMAR: {
      icon: HourglassEmptyOutlined,
      label: "Esperando confirmación",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      progress: 10,
      description: "Tu pedido está siendo revisado",
    },
    EN_PREPARACION: {
      icon: RestaurantOutlined,
      label: "En preparación",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      progress: 40,
      description: "Nuestros chefs están preparando tu pedido",
    },
    LISTO: {
      icon: CheckCircleOutlined,
      label: "Listo para entregar",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      progress: 70,
      description: "Tu pedido está listo y será enviado pronto",
    },
    EN_CAMINO: {
      icon: LocalShippingOutlined,
      label: "En camino",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      progress: 90,
      description: "Tu pedido está en camino hacia ti",
    },
    ENTREGADO: {
      icon: DoneAllOutlined,
      label: "Entregado",
      color: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
      progress: 100,
      description: "¡Tu pedido ha sido entregado exitosamente!",
    },
    CANCELADO: {
      icon: CancelOutlined,
      label: "Cancelado",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      progress: 0,
      description: "Este pedido ha sido cancelado",
    },
    RECHAZADO: {
      icon: ErrorOutlined,
      label: "Rechazado",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      progress: 0,
      description: "Este pedido ha sido rechazado",
    },
  };

  const config = statusConfig[estado];
  const IconComponent = config.icon;

  // Formatear tiempo transcurrido
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4`}>
      {/* Header del estado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center border ${config.borderColor}`}>
            <IconComponent className={`${config.color} text-lg`} />
          </div>
          <div>
            <h4 className={`font-semibold ${config.color}`}>{config.label}</h4>
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>

        {/* Tiempo transcurrido */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{formatTime(tiempoTranscurrido)}</p>
          <p className="text-xs text-gray-500">transcurrido</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${config.progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2 rounded-full ${
            estado === "CANCELADO" || estado === "RECHAZADO"
              ? "bg-red-400"
              : estado === "ENTREGADO"
              ? "bg-green-500"
              : "bg-gradient-to-r from-orange-400 to-orange-600"
          }`}
        />
      </div>

      {/* Porcentaje de progreso */}
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>Progreso del pedido</span>
        <span className="font-medium">{config.progress}%</span>
      </div>
    </motion.div>
  );
};
