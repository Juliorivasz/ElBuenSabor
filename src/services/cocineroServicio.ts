import axios from "axios"
import type { PedidosCocineroResponse } from "../models/dto/PedidoCocineroDTO"

class CocineroServicio {
  private baseURL = "http://localhost:8080"

  async obtenerPedidosCocinero(): Promise<PedidosCocineroResponse> {
    try {
      const response = await axios.get<PedidosCocineroResponse>(`${this.baseURL}/pedido/cocinero`)
      return response.data
    } catch (error) {
      console.error("Error al obtener pedidos del cocinero:", error)
      throw error
    }
  }

  async marcarPedidoListo(idPedido: number): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/pedido/listo/${idPedido}`)
    } catch (error) {
      console.error("Error al marcar pedido como listo:", error)
      throw error
    }
  }

  async extenderHorarioEntrega(idPedido: number): Promise<void> {
    try {
      await axios.put(`${this.baseURL}/pedido/extenderHorarioEntrega/${idPedido}`)
    } catch (error) {
      console.error("Error al extender horario de entrega:", error)
      throw error
    }
  }
}

export const cocineroServicio = new CocineroServicio()
