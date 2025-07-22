// src/hooks/useWebSocket.ts

import { useEffect, useState, useRef, useCallback } from "react";
import { Client, IMessage, StompHeaders, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Define la estructura del servicio WebSocket que el hook retornará.
 * Incluye el estado de conexión, y funciones para enviar/suscribirse.
 */
interface WebSocketService {
  isConnected: boolean;
  sendMessage: (destination: string, body: object | string, headers?: StompHeaders) => void;
  subscribe: (destination: string, callback: (message: IMessage) => void, headers?: StompHeaders) => () => void;
}

// **IMPORTANTE**: Ajusta esta URL a tu backend de Spring Boot
const WEBSOCKET_URL = "https://localhost:8080/ws-chat"; // Asegúrate de que esta URL sea correcta

export const useWebSocket = (): WebSocketService => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, Set<(message: IMessage) => void>>>(new Map());
  const activeStompSubscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());

  useEffect(() => {
    // --- Captura de referencias para el cleanup del efecto ---
    // Captura el valor actual de clientRef.current
    const currentClient = clientRef.current;
    // Captura el valor actual de activeStompSubscriptionsRef.current
    const currentActiveStompSubscriptions = activeStompSubscriptionsRef.current;
    // Captura el valor actual de subscriptionsRef.current
    const currentSubscriptionsRef = subscriptionsRef.current;
    // --------------------------------------------------------

    // Si ya hay un cliente activo, no creamos uno nuevo.
    if (currentClient && currentClient.active) {
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL) as WebSocket,
      debug: (str: string) => {
        // Opción recomendada: Descomentar para ver logs.
        // console.log(str);
        // Opcional: Si no quieres logs pero quieres silenciar el warning de 'str' no usado:
        void str; // Una forma limpia de marcar una variable como usada para ESLint sin hacer nada
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      console.log("WebSocket Connected!");

      currentSubscriptionsRef.forEach((callbacksForDestination, destination) => {
        // Usa la referencia capturada
        if (callbacksForDestination.size > 0) {
          if (currentActiveStompSubscriptions.has(destination)) {
            // Usa la referencia capturada
            currentActiveStompSubscriptions.get(destination)?.unsubscribe(); // Usa la referencia capturada
            currentActiveStompSubscriptions.delete(destination); // Usa la referencia capturada
          }

          const stompSubscription = client.subscribe(destination, (message: IMessage) => {
            // Asegúrate de usar la referencia actual de subscriptionsRef.current aquí,
            // ya que los callbacks pueden agregarse o removerse dinámicamente.
            subscriptionsRef.current.get(destination)?.forEach((cb) => cb(message));
          });
          currentActiveStompSubscriptions.set(destination, stompSubscription); // Usa la referencia capturada
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      console.log("WebSocket Disconnected!");
      currentActiveStompSubscriptions.clear(); // Usa la referencia capturada
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();
    clientRef.current = client;

    // --- Función de limpieza del efecto ---
    return () => {
      if (currentClient?.active) {
        currentClient.deactivate();
        console.log("WebSocket Client Deactivated.");
      }
      // Limpiar las referencias capturadas en el cleanup
      currentSubscriptionsRef.clear();
      currentActiveStompSubscriptions.clear();
    };
  }, []); // El array de dependencias vacío asegura que este efecto se ejecute una sola vez.

  // Estas funciones `sendMessage` y `subscribe` no necesitan capturar las refs
  // porque son `useCallback`s y el linter no las ve como parte del `useEffect` principal.
  // Además, siempre operan sobre `ref.current` para obtener el estado más actual.
  const sendMessage = useCallback((destination: string, body: object | string, headers: StompHeaders = {}) => {
    if (clientRef.current?.active) {
      const messageBody = typeof body === "object" ? JSON.stringify(body) : body;
      clientRef.current.publish({
        destination,
        body: messageBody,
        headers: { "content-type": "application/json", ...headers },
      });
    } else {
      console.warn("WebSocket not connected. Message not sent to:", destination, "Body:", body);
    }
  }, []);

  const subscribe = useCallback(
    (destination: string, callback: (message: IMessage) => void, headers: StompHeaders = {}) => {
      // Aquí siempre operamos sobre subscriptionsRef.current para manejar los listeners actuales
      if (!subscriptionsRef.current.has(destination)) {
        subscriptionsRef.current.set(destination, new Set());
      }
      subscriptionsRef.current.get(destination)?.add(callback);

      // Aquí también operamos sobre activeStompSubscriptionsRef.current
      if (clientRef.current?.active && !activeStompSubscriptionsRef.current.has(destination)) {
        const stompSubscription = clientRef.current.subscribe(
          destination,
          (message: IMessage) => {
            subscriptionsRef.current.get(destination)?.forEach((cb) => cb(message));
          },
          headers,
        );
        activeStompSubscriptionsRef.current.set(destination, stompSubscription);
      }

      // La función de limpieza retornada por `subscribe` también opera sobre
      // subscriptionsRef.current y activeStompSubscriptionsRef.current para asegurar
      // que se desuscriba del estado más actual de las suscripciones.
      return () => {
        const callbacksForDestination = subscriptionsRef.current.get(destination);
        if (callbacksForDestination) {
          callbacksForDestination.delete(callback);

          if (callbacksForDestination.size === 0) {
            const stompSubscription = activeStompSubscriptionsRef.current.get(destination);
            if (stompSubscription) {
              stompSubscription.unsubscribe();
              activeStompSubscriptionsRef.current.delete(destination);
              console.log(`STOMP Unsubscribed from: ${destination} (no more listeners)`);
            }
            subscriptionsRef.current.delete(destination);
          }
        }
      };
    },
    [],
  );

  return { isConnected, sendMessage, subscribe };
};
