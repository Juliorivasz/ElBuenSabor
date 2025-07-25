import type React from "react";
import { motion } from "framer-motion";
import { AccessTimeOutlined, CheckCircleOutlined, ErrorOutlined } from "@mui/icons-material";
import type { EstadoPedido } from "../../types/OrderInProgress";

interface EstimatedTimeProps {
  horaEntrega: string;
  estado: EstadoPedido;
}

export const EstimatedTime: React.FC<EstimatedTimeProps> = ({ horaEntrega, estado }) => {
  // Calcular tiempo restante
  const calculateTimeRemaining = () => {
    const now = new Date();
    const deliveryTime = new Date(horaEntrega);
    const diffInMinutes = Math.ceil((deliveryTime.getTime() - now.getTime()) / (1000 * 60));

    return {
      minutes: diffInMinutes,
      isOverdue: diffInMinutes < 0,
      formattedTime:
        diffInMinutes > 0
          ? diffInMinutes < 60
            ? `${diffInMinutes} min`
            : `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}min`
          : "Tiempo estimado superado",
    };
  };

  const timeInfo = calculateTimeRemaining();

  // Configuración según el estado
  const getStatusConfig = () => {
    if (estado === "ENTREGADO") {
      return {
        icon: CheckCircleOutlined,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        message: "¡Pedido entregado!",
        showTime: false,
      };
    }

    if (estado === "CANCELADO" || estado === "RECHAZADO") {
      return {
        icon: ErrorOutlined,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        message: estado === "CANCELADO" ? "Pedido cancelado" : "Pedido rechazado",
        showTime: false,
      };
    }

    if (timeInfo.isOverdue) {
      return {
        icon: ErrorOutlined,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        message: "Tiempo estimado superado",
        showTime: true,
      };
    }

    return {
      icon: AccessTimeOutlined,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      message: "Tiempo estimado de entrega",
      showTime: true,
    };
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4`}>
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center border ${config.borderColor}`}>
          <IconComponent className={`${config.color} text-sm`} />
        </div>

        <div className="flex-1">
          <p className={`font-medium ${config.color}`}>{config.message}</p>

          {config.showTime && (
            <div className="mt-1">
              <p className="text-lg font-bold text-gray-800">{timeInfo.formattedTime}</p>
              <p className="text-sm text-gray-600">
                Entrega estimada:{" "}
                {new Date(horaEntrega).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Indicador visual adicional */}
        {config.showTime && !timeInfo.isOverdue && (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-3 h-3 bg-orange-500 rounded-full"
          />
        )}
      </div>
    </motion.div>
  );
};
