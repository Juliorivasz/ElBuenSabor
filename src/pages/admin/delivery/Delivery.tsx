"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { PedidoRepartidorDTO } from "../../../models/dto/PedidoRepartidorDTO";
import { RepartidorServicio } from "../../../services/repartidorServicio";
import { DeliveryOrderCard } from "../../../components/delivery/DeliveryOrderCard";
import { RefreshOutlined, TwoWheeler as DeliveryIcon, CheckCircleOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";

export const Delivery: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoRepartidorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const repartidorServicio = RepartidorServicio.getInstance();

  const cargarPedidos = async () => {
    try {
      const response = await repartidorServicio.obtenerPedidosRepartidor();
      setPedidos(response.pedidos);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los pedidos",
        icon: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarPedidos();
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const pedidosListos = pedidos.filter((p) => p.estadoPedido === "LISTO");
  const pedidosEnCamino = pedidos.filter((p) => p.estadoPedido === "EN_CAMINO");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <DeliveryIcon
              className="text-black mr-3"
              fontSize="large"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel de Repartidor</h1>
              <p className="text-gray-600 mt-1">Gestiona tus entregas de manera eficiente</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50">
            <RefreshOutlined
              className={`${refreshing ? "animate-spin" : ""}`}
              fontSize="small"
            />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* Sección de pedidos listos */}
        <div className="mb-8">
          <div className="bg-green-100 rounded-lg shadow-sm border border-green-200 p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              <CheckCircleOutlined
                className="text-black mr-2"
                fontSize="small"
              />
              Pedidos Listos para Retirar
            </h2>
            {pedidosListos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-700">No hay pedidos listos para retirar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosListos.map((pedido) => (
                  <DeliveryOrderCard
                    key={pedido.idPedido}
                    pedido={pedido}
                    onUpdate={cargarPedidos}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sección de pedidos en camino */}
        <div className="mb-8">
          <div className="bg-orange-100 rounded-lg shadow-sm border border-orange-200 p-6">
            <h2 className="text-xl font-bold text-orange-800 mb-4">
              <DeliveryIcon
                className="text-black mr-2"
                fontSize="small"
              />
              Pedidos En Camino
            </h2>
            {pedidosEnCamino.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-orange-700">No hay pedidos en camino</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosEnCamino.map((pedido) => (
                  <DeliveryOrderCard
                    key={pedido.idPedido}
                    pedido={pedido}
                    onUpdate={cargarPedidos}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
