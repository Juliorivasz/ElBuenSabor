import { useState, useEffect, useCallback, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import { interceptorsApiClient } from "../services/interceptors/axios.interceptors";
import type { OrderInProgress as OrderInProgressType, OrderStatusUpdate } from "../types/OrderInProgress";
import type { IMessage } from "@stomp/stompjs";
import { NotificationService } from "../utils/notifications";

// Define la estructura de la respuesta paginada de la API
interface ApiResponsePage<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

interface UseOrderInProgressProps {
  clienteId: number | null; // Puede ser null si el usuario no está autenticado
  autoCheck?: boolean;
}

export const useOrderInProgress = ({ clienteId, autoCheck = false }: UseOrderInProgressProps) => {
  const [ordersInProgress, setOrdersInProgress] = useState<OrderInProgressType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, subscribe } = useWebSocket();

  // Usamos un useRef para almacenar las funciones de desuscripción de cada tópico de pedido.
  const activeSubscriptionsRef = useRef<Map<number, () => void>>(new Map());

  // Calcula el tiempo transcurrido para un pedido
  const calculateTiempoTranscurrido = useCallback((order: OrderInProgressType): number => {
    const now = new Date();
    const orderTime = new Date(order.fechaYHora);
    const diffMs = now.getTime() - orderTime.getTime();
    return Math.floor(diffMs / (1000 * 60)); // Diferencia en minutos
  }, []);

  // Función para ordenar pedidos por fecha (más nuevos primero)
  const sortOrdersByDate = useCallback((orders: OrderInProgressType[]): OrderInProgressType[] => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.fechaYHora);
      const dateB = new Date(b.fechaYHora);
      return dateB.getTime() - dateA.getTime(); // Orden descendente (más nuevos primero)
    });
  }, []);

  // Función para obtener el mensaje de notificación según el estado
  const getNotificationMessage = useCallback(
    (estado: string, pedidoId: number): { message: string; type: "success" | "info" | "warning" | "error" } => {
      switch (estado) {
        case "PENDIENTE":
          return {
            message: `Tu pedido #${pedidoId} ha sido recibido y está pendiente de confirmación.`,
            type: "info",
          };
        case "CONFIRMADO":
          return {
            message: `¡Tu pedido #${pedidoId} ha sido confirmado! Comenzamos a prepararlo.`,
            type: "success",
          };
        case "EN_PREPARACION":
          return {
            message: `Tu pedido #${pedidoId} está siendo preparado en la cocina.`,
            type: "info",
          };
        case "LISTO":
          return {
            message: `¡Tu pedido #${pedidoId} está listo! Pronto será enviado.`,
            type: "success",
          };
        case "EN_CAMINO":
          return {
            message: `Tu pedido #${pedidoId} está en camino. ¡Llegará pronto!`,
            type: "info",
          };
        case "ENTREGADO":
          return {
            message: `¡Tu pedido #${pedidoId} ha sido entregado! Gracias por tu compra.`,
            type: "success",
          };
        case "CANCELADO":
          return {
            message: `Tu pedido #${pedidoId} ha sido cancelado.`,
            type: "warning",
          };
        case "RECHAZADO":
          return {
            message: `Tu pedido #${pedidoId} ha sido rechazado. Contacta con nosotros para más información.`,
            type: "error",
          };
        default:
          return {
            message: `Tu pedido #${pedidoId} ha cambiado de estado a: ${estado}`,
            type: "info",
          };
      }
    },
    [],
  );

  // Declaramos fetchOrdersInProgress *antes* de handleOrderStatusUpdate
  // para resolver el error 'used before declaration'.
  // Añadimos el tipo de retorno explícito `Promise<void>`.
  const fetchOrdersInProgress = useCallback(async (): Promise<void> => {
    if (!clienteId) {
      setOrdersInProgress([]);
      setLoading(false);
      activeSubscriptionsRef.current.forEach((unsubscribeFn) => unsubscribeFn());
      activeSubscriptionsRef.current.clear();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await interceptorsApiClient.get<ApiResponsePage<OrderInProgressType>>(`/pedido/cliente/curso`, {
        params: { page: 0, size: 20 },
      });

      if (response.data && response.data.content) {
        const fetchedOrders = response.data.content.map((order) => ({
          ...order,
          tiempoTranscurrido: calculateTiempoTranscurrido(order),
        }));

        // Ordenar los pedidos por fecha (más nuevos primero)
        const sortedOrders = sortOrdersByDate(fetchedOrders);
        setOrdersInProgress(sortedOrders);

        // --- Gestión de Suscripciones WebSocket para cada pedido ---
        if (isConnected) {
          const currentFetchedOrderIds = new Set(fetchedOrders.map((order) => order.idPedido));

          // 1. Desuscribirse de pedidos que ya no están en la lista (se finalizaron o no se encontraron)
          activeSubscriptionsRef.current.forEach((unsubscribeFn, orderId) => {
            if (!currentFetchedOrderIds.has(orderId)) {
              console.log(`🔌 Desuscribiendo de /topic/pedido/updates/${orderId} (pedido ya no en curso).`);
              unsubscribeFn();
              activeSubscriptionsRef.current.delete(orderId);
            }
          });

          // 2. Suscribirse a nuevos pedidos o a aquellos que no tienen una suscripción activa
          fetchedOrders.forEach((order) => {
            const topic = `/topic/pedido/updates/${order.idPedido}`;
            if (!activeSubscriptionsRef.current.has(order.idPedido)) {
              console.log(`🔌 Suscribiendo a ${topic} para el pedido ${order.idPedido}`);
              const unsubscribeFn = subscribe(topic, (message: IMessage) => {
                try {
                  const update = JSON.parse(message.body);
                  console.log(`📨 Mensaje recibido para pedido ${update.idPedido} (estado: ${update.estadoPedido})`);

                  // Llama al manejador de actualización
                  handleOrderStatusUpdate({
                    orderId: update.idPedido,
                    estado: update.estadoPedido,
                    clienteId: update.clienteId,
                    horaEntrega: update.horaEntrega,
                    mensajeActualizacion: update.mensajeActualizacion,
                    repartidorId: update.repartidorId,
                    repartidorNombre: update.repartidorNombre,
                    ubicacionRepartidor: update.ubicacionRepartidor,
                  });
                } catch (err) {
                  console.error("❌ Error al parsear mensaje WebSocket:", err);
                  NotificationService.error("Error al procesar actualización del pedido");
                }
              });
              activeSubscriptionsRef.current.set(order.idPedido, unsubscribeFn);
            }
          });
        }
      } else {
        setOrdersInProgress([]);
        activeSubscriptionsRef.current.forEach((unsubscribeFn) => unsubscribeFn());
        activeSubscriptionsRef.current.clear();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al obtener pedidos en curso.";
      setError(errorMessage);
      console.error("❌ Error al obtener pedidos en curso:", err);
      NotificationService.error("Error al cargar tus pedidos en curso");
      setOrdersInProgress([]);
      activeSubscriptionsRef.current.forEach((unsubscribeFn) => unsubscribeFn());
      activeSubscriptionsRef.current.clear();
    } finally {
      setLoading(false);
    }
  }, [clienteId, isConnected, subscribe, calculateTiempoTranscurrido, sortOrdersByDate]);

  // Handler para procesar las actualizaciones recibidas por WebSocket
  const handleOrderStatusUpdate = useCallback(
    (update: OrderStatusUpdate): void => {
      // Mostrar notificación del cambio de estado
      const notification = getNotificationMessage(update.estado, update.orderId);

      switch (notification.type) {
        case "success":
          NotificationService.success(notification.message);
          break;
        case "info":
          NotificationService.info(notification.message);
          break;
        case "warning":
          NotificationService.warning(notification.message);
          break;
        case "error":
          NotificationService.error(notification.message);
          break;
      }

      // Mostrar mensaje personalizado si existe
      if (update.mensajeActualizacion) {
        console.log("📢 Mensaje de actualización:", update.mensajeActualizacion);
        NotificationService.info(update.mensajeActualizacion, "Mensaje del restaurante");
      }

      setOrdersInProgress((prevOrders) => {
        if (!prevOrders) return [];

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let orderWasFound = false;
        const updatedOrders = prevOrders
          .map((order) => {
            if (order.idPedido === update.orderId) {
              orderWasFound = true;

              if (["ENTREGADO", "CANCELADO", "RECHAZADO"].includes(update.estado)) {
                console.log(`✅ Removiendo pedido ${update.orderId} del listado (estado final: ${update.estado})`);
                const unsubscribeFn = activeSubscriptionsRef.current.get(order.idPedido);
                if (unsubscribeFn) {
                  unsubscribeFn();
                  activeSubscriptionsRef.current.delete(order.idPedido);
                  console.log(`🔌 Desuscrito del tópico /topic/pedido/updates/${order.idPedido}`);
                }
                return null;
              }

              const updatedHoraEntrega = update.horaEntrega
                ? new Date(update.horaEntrega).toISOString()
                : order.horaEntrega;

              const updatedRepartidor = update.repartidorId
                ? {
                    ...order.repartidor,
                    idUsuario: update.repartidorId,
                    nombre: update.repartidorNombre || order.repartidor?.nombre || "",
                    apellido: order.repartidor?.apellido || "",
                    telefono: update.repartidorTelefono || order.repartidor?.telefono || "",
                    auth0Id: order.repartidor?.auth0Id || "",
                    ubicacionActual: update.ubicacionRepartidor || order.repartidor?.ubicacionActual,
                  }
                : order.repartidor;

              return {
                ...order,
                estadoPedido: update.estado as OrderInProgressType["estadoPedido"],
                horaEntrega: updatedHoraEntrega,
                repartidor: updatedRepartidor,
                tiempoTranscurrido: calculateTiempoTranscurrido(order),
              };
            }
            return order;
          })
          .filter(Boolean) as OrderInProgressType[];

        // Reordenar después de la actualización para mantener el orden por fecha
        return sortOrdersByDate(updatedOrders);
      });

      // Lógica para manejar NUEVOS pedidos que no estaban en la lista.
      setTimeout(() => {
        setOrdersInProgress((currentOrders) => {
          if (
            !currentOrders.some((o) => o.idPedido === update.orderId) &&
            !["ENTREGADO", "CANCELADO", "RECHAZADO"].includes(update.estado) &&
            update.clienteId === clienteId
          ) {
            console.log(
              `💡 Detectado pedido ${update.orderId} no presente en lista. Forzando recarga de pedidos en curso.`,
            );
            NotificationService.info(`Nuevo pedido #${update.orderId} detectado`, "Actualizando lista");
            fetchOrdersInProgress();
          }
          return currentOrders;
        });
      }, 50);
    },
    [clienteId, calculateTiempoTranscurrido, fetchOrdersInProgress, sortOrdersByDate, getNotificationMessage],
  );

  // Efecto para la carga inicial de datos y limpieza de todas las suscripciones al desmontar el hook
  useEffect(() => {
    if (autoCheck && clienteId) {
      console.log(`🔄 Iniciando verificación de pedidos para cliente: ${clienteId}`);
      fetchOrdersInProgress();
    }

    // Función de limpieza: desuscribirse de todos los tópicos al desmontar el componente.
    return () => {
      console.log("🔌 Realizando limpieza general de suscripciones WebSocket al desmontar.");
      activeSubscriptionsRef.current.forEach((unsubscribeFn) => unsubscribeFn());
      activeSubscriptionsRef.current.clear();
    };
  }, [autoCheck, clienteId, fetchOrdersInProgress]);

  // Efecto para actualizar el tiempo transcurrido cada minuto
  useEffect(() => {
    if (ordersInProgress.length === 0) return;

    const interval = setInterval(() => {
      setOrdersInProgress((prevOrders) => {
        if (!prevOrders) return prevOrders;

        const updatedOrders = prevOrders.map((order) => {
          if (["ENTREGADO", "CANCELADO", "RECHAZADO"].includes(order.estadoPedido)) {
            return order;
          }
          return {
            ...order,
            tiempoTranscurrido: calculateTiempoTranscurrido(order),
          };
        });

        // Mantener el orden por fecha después de actualizar el tiempo
        return sortOrdersByDate(updatedOrders);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [ordersInProgress.length, calculateTiempoTranscurrido, sortOrdersByDate]);

  return {
    ordersInProgress,
    loading,
    error,
    hasActiveOrders: ordersInProgress.length > 0,
    fetchOrdersInProgress,
  };
};
