import { interceptorsApiClient } from "./interceptors/axios.interceptors";
import type { BackendPaginatedResponse, BackendPedido } from "../types/orders";
import { PedidosPaginadosDTO } from "../models/dto/PedidoDTO";

export const pedidoServicio = {
  // Obtener lista paginada de pedidos
  async obtenerPedidosPaginados(page = 0, size = 10, estado?: string): Promise<PedidosPaginadosDTO> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (estado && estado !== "TODOS") {
      params.append("estado", estado);
    }

    const response = await interceptorsApiClient.get(`/pedido/cajero?${params.toString()}`);
    return response.data;
  },

  // Confirmar pedido
  async confirmarPedido(idPedido: number): Promise<void> {
    await interceptorsApiClient.put(`/pedido/confirmado/${idPedido}`);
  },

  // Rechazar pedido
  async rechazarPedido(idPedido: number): Promise<void> {
    await interceptorsApiClient.put(`/pedido/rechazado/${idPedido}`);
  },

  // Cancelar pedido
  async cancelarPedido(idPedido: number): Promise<void> {
    await interceptorsApiClient.put(`/pedido/cancelado/${idPedido}`);
  },

  // Obtener pedidos en curso del cliente
  async obtenerPedidosEnCursoCliente(page: number, size: number): Promise<BackendPaginatedResponse<BackendPedido>> {
    const response = await interceptorsApiClient.get(`/pedido/cliente/curso?page=${page}&size=${size}`);
    return response.data;
  },

  // Obtener historial de pedidos del cliente
  async obtenerHistorialPedidosCliente(page: number, size: number): Promise<BackendPaginatedResponse<BackendPedido>> {
    const response = await interceptorsApiClient.get(`/pedido/cliente/historial?page=${page}&size=${size}`);
    return response.data;
  },
  // Marcar pedido como entregado
  async marcarComoEntregado(idPedido: number): Promise<void> {
    await interceptorsApiClient.put(`/pedido/entregado/${idPedido}`)
  },
};
