"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { PedidoCocineroDTO } from "../../models/dto/PedidoCocineroDTO"
import { KitchenOrderCard } from "./KitchenOrderCard"

interface KitchenOrdersSectionProps {
  title: string
  pedidos: PedidoCocineroDTO[]
  onPedidoActualizado: () => void
  emptyMessage: string
  bgColor: string
  textColor: string
}

export const KitchenOrdersSection: React.FC<KitchenOrdersSectionProps> = ({
  title,
  pedidos,
  onPedidoActualizado,
  emptyMessage,
  bgColor,
  textColor,
}) => {
  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`${bgColor} ${textColor} rounded-lg p-4 mb-6 shadow-sm`}
      >
        <h2 className="text-2xl font-bold flex items-center">
          {title}
          <span className="ml-3 bg-white text-gray-800 px-2 py-1 rounded-md text-sm font-semibold shadow-sm">
            {pedidos.length}
          </span>
        </h2>
      </motion.div>

      {pedidos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidos.map((pedido) => (
            <KitchenOrderCard key={pedido.idPedido} pedido={pedido} onPedidoActualizado={onPedidoActualizado} />
          ))}
        </div>
      )}
    </div>
  )
}
