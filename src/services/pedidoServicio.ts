import { interceptorsApiClient } from "./interceptors/axios.interceptors"
import type { PedidosPaginadosDTO } from "../models/dto/PedidoDTO"

export const pedidoServicio = {
  // Obtener lista paginada de pedidos
  async obtenerPedidosPaginados(page = 0, size = 10, estado?: string): Promise<PedidosPaginadosDTO> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })

    if (estado && estado !== "TODOS") {
      params.append("estado", estado)
    }

    const response = await interceptorsApiClient.get(`/pedido/lista?${params.toString()}`)
    return response.data
  },

  // Confirmar pedido
  async confirmarPedido(idPedido: number): Promise<void> {
    await interceptorsApiClient.put(`/pedido/confirmado/${idPedido}`)
  },

  // Rechazar pedido
  async rechazarPedido(idPedido: number): Promise<void> {
    await interceptorsApiClient.put(`/pedido/rechazado/${idPedido}`)
  },
}
