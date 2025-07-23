import type React from "react";
import { motion } from "framer-motion";
import { OrderStatusCard } from "./OrderStatusCard";
import { EstimatedTime } from "./EstimatedTime";
import { DeliveryInfo } from "./DeliveryInfo";
import { OrderSummary } from "./OrderSummary";
import { ChatButton } from "./ChatButton";
import type { OrderInProgress } from "../../types/OrderInProgress";

interface OrderInProgressCardProps {
  order: OrderInProgress;
  onClick?: () => void;
  onOpenChat?: (repartidorTelefono?: string) => void;
}

export const OrderInProgressCard: React.FC<OrderInProgressCardProps> = ({ order, onClick, onOpenChat }) => {
  // Calcular el total del pedido
  const total = order.detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);

  // Formatear la dirección - manejar caso null para retiro en local
  const formatAddress = (direccion: typeof order.direccion) => {
    if (!direccion) {
      return "Retiro en local";
    }

    let address = `${direccion.calle || ""} ${direccion.numero || ""}`.trim();
    if (direccion.piso) address += `, Piso ${direccion.piso}`;
    if (direccion.dpto) address += `, Dpto ${direccion.dpto}`;
    if (direccion.nombreDepartamento) {
      address += `, ${direccion.nombreDepartamento}`;
    }
    return address || "Dirección no disponible";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="w-80 sm:w-96 lg:w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={onClick}>
      {/* Layout vertical para mobile, horizontal para desktop */}
      <div className="lg:flex lg:min-h-80">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white lg:w-80 lg:flex lg:flex-col lg:justify-center lg:flex-shrink-0">
          <div className="flex items-center justify-between lg:flex-col lg:items-start lg:space-y-4">
            <div className="lg:w-full">
              <h3 className="text-lg font-bold lg:text-xl">Pedido #{order.idPedido}</h3>
              <p className="text-orange-100 text-sm lg:text-base">
                {new Date(order.fechaYHora).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right lg:text-left lg:w-full">
              <p className="text-2xl font-bold lg:text-3xl">${total}</p>
              <p className="text-orange-100 text-sm lg:text-base">
                {order.detalles.length} {order.detalles.length === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 space-y-4 lg:flex-1 lg:flex lg:flex-col lg:justify-between lg:p-6 lg:min-h-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0 lg:flex-1 space-y-4">
            {/* Columna izquierda en desktop */}
            <div className="space-y-4 lg:flex lg:flex-col lg:justify-start">
              {/* Estado del pedido */}
              <div className="lg:flex-shrink-0">
                <OrderStatusCard
                  estado={order.estadoPedido}
                  tiempoTranscurrido={order.tiempoTranscurrido}
                />
              </div>

              {/* Tiempo estimado */}
              <div className="lg:flex-shrink-0">
                <EstimatedTime
                  horaEntrega={order.horaEntrega}
                  estado={order.estadoPedido}
                />
              </div>

              {/* Información de entrega */}
              <div className="lg:flex-shrink-0">
                <DeliveryInfo
                  repartidor={order.repartidor}
                  tipoEntrega={order.tipoEnvio}
                  direccionEntrega={order.tipoEnvio === "DELIVERY" ? formatAddress(order.direccion) : "Retiro en local"}
                />
              </div>
            </div>

            {/* Columna derecha en desktop */}
            <div className="space-y-4 lg:flex lg:flex-col lg:justify-start lg:min-h-0">
              {/* Resumen del pedido */}
              <div className="lg:flex-1 lg:min-h-0">
                <OrderSummary
                  numeroOrden={order.idPedido}
                  productos={order.detalles}
                  total={total}
                />
              </div>
            </div>
          </div>

          {/* Botón de chat - siempre al final */}
          <div className="lg:mt-6 lg:flex-shrink-0">
            <ChatButton
              pedidoId={order.idPedido}
              repartidorTelefono={order.repartidor?.telefono}
              onOpenChat={onOpenChat}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
