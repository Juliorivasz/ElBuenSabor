"use client";

import { CheckCircleOutlined, RefreshOutlined, RestaurantMenuOutlined } from "@mui/icons-material";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FixedChat } from "../../../components/chat/FixedChat";
import { KitchenOrderCard } from "../../../components/kitchen/KitchenOrderCard";
import { useWebSocket } from "../../../hooks/useWebSocket";
import type { PedidoCocineroDTO } from "../../../models/dto/PedidoCocineroDTO";
import type { PedidoStatusUpdateDto } from "../../../models/dto/PedidoDTO";
import { EstadoPedido } from "../../../models/enum/EstadoPedido";
import { cocineroServicio } from "../../../services/cocineroServicio";

export const Kitchen = () => {
  const { isConnected, subscribe } = useWebSocket();
  const [pedidos, setPedidos] = useState<PedidoCocineroDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cocineroServicio.obtenerPedidosCocinero();
      setPedidos(response.pedidos);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los pedidos. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      setPedidos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarPedidos();
  };

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  // --- Integración WebSocket para el panel de Cocina ---
  useEffect(() => {
    if (isConnected) {
      console.log("Cocina: Suscribiéndose a /topic/kitchen/orders");
      const unsubscribe = subscribe("/topic/kitchen/orders", (message: IMessage) => {
        try {
          const update: PedidoStatusUpdateDto = JSON.parse(message.body);
          console.log("Cocina: Recibido update por WebSocket:", update);

          setPedidos((prevPedidos) => {
            const existingPedidoIndex = prevPedidos.findIndex((p) => p.idPedido === update.idPedido);

            // Si el pedido ya existe, lo actualizamos
            if (existingPedidoIndex !== -1) {
              const updatedPedidos = [...prevPedidos];
              const pedidoToUpdate = { ...updatedPedidos[existingPedidoIndex] };

              pedidoToUpdate.estadoPedido = update.estadoPedido;
              if (update.horaEntrega) {
                pedidoToUpdate.horaEntrega = update.horaEntrega;
              }

              // Si el pedido ya no es relevante para la cocina (ej. entregado, rechazado, cancelado)
              if (
                update.estadoPedido === EstadoPedido.ENTREGADO ||
                update.estadoPedido === EstadoPedido.RECHAZADO ||
                update.estadoPedido === EstadoPedido.CANCELADO
              ) {
                return updatedPedidos.filter((p) => p.idPedido !== update.idPedido); // Lo removemos
              }

              updatedPedidos[existingPedidoIndex] = pedidoToUpdate;
              return updatedPedidos;
            } else {
              // Si es un nuevo pedido y es relevante para la cocina (EN_PREPARACION)
              // Aquí, como el PedidoStatusUpdateDto es ligero, no tenemos todos los detalles del pedido.
              // La forma más sencilla es forzar una recarga completa para obtener el pedido completo.
              if (update.estadoPedido === EstadoPedido.EN_PREPARACION) {
                console.log("Cocina: Nuevo pedido EN_PREPARACION recibido, recargando todos los pedidos.");
                cargarPedidos(); // Forzar recarga completa
                return prevPedidos; // No modificar el estado aquí, la recarga lo hará
              }
              // Si el pedido no existe y no es un nuevo EN_PREPARACION, no hacemos nada (podría ser un update de un pedido ya filtrado/paginado)
              return prevPedidos;
            }
          });
        } catch (error) {
          console.error("Cocina: Error al parsear mensaje WebSocket:", error, message.body);
        }
      });

      return () => {
        console.log("Cocina: Desuscribiéndose de /topic/kitchen/orders");
        unsubscribe();
      };
    }
  }, [isConnected, subscribe, cargarPedidos]);

  const pedidosEnPreparacion = pedidos?.filter((pedido) => pedido.estadoPedido === EstadoPedido.EN_PREPARACION);
  const pedidosListos = pedidos?.filter((pedido) => pedido.estadoPedido === EstadoPedido.LISTO);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <RestaurantMenuOutlined
              className="text-black mr-3"
              fontSize="large"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel de Cocina</h1>
              <p className="text-gray-600 mt-1">Gestiona los pedidos en preparación y listos</p>
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

        {/* Sección de pedidos en preparación */}
        <div className="mb-8">
          <div className="bg-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">
              <RestaurantMenuOutlined
                className="text-black mr-2"
                fontSize="small"
              />
              Pedidos en Preparación
            </h2>
            {pedidosEnPreparacion?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-yellow-700">No hay pedidos en preparación en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosEnPreparacion?.map((pedido) => (
                  <KitchenOrderCard
                    key={pedido.idPedido}
                    pedido={pedido}
                    onPedidoActualizado={cargarPedidos}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sección de pedidos listos */}
        <div>
          <div className="bg-green-100 rounded-lg shadow-sm border border-green-200 p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              <CheckCircleOutlined
                className="text-black mr-2"
                fontSize="small"
              />
              Pedidos Listos
            </h2>
            {pedidosListos?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-700">No hay pedidos listos en este momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidosListos?.map((pedido) => (
                  <KitchenOrderCard
                    key={pedido.idPedido}
                    pedido={pedido}
                    onPedidoActualizado={cargarPedidos}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat fijo para cocinero */}
        <FixedChat userRole="Cocinero" />
      </div>
    </div>
  );
};
