"use client"

import type React from "react"
import type { PedidoRepartidorDTO } from "../../models/dto/PedidoRepartidorDTO"
import { DeliveryOrderCard } from "./DeliveryOrderCard"

interface DeliveryOrdersSectionProps {
  title: string
  pedidos: PedidoRepartidorDTO[]
  onUpdate: () => void
  emptyMessage: string
  bgColor: string
  textColor: string
  icon: React.ReactNode
}

export const DeliveryOrdersSection: React.FC<DeliveryOrdersSectionProps> = ({
  title,
  pedidos,
  onUpdate,
  emptyMessage,
  bgColor,
  textColor,
  icon,
}) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm`}>
      {/* Header de la sección */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className={`text-2xl font-bold ${textColor}`}>{title}</h2>
        </div>
        <span className={`${textColor} bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold`}>
          {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid de pedidos */}
      {pedidos.length === 0 ? (
        <div className="bg-white bg-opacity-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidos.map((pedido) => (
            <DeliveryOrderCard key={pedido.idPedido} pedido={pedido} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
