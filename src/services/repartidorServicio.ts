import axios from "axios";
import type { PedidosRepartidorResponse } from "../models/dto/PedidoRepartidorDTO";

export class RepartidorServicio {
  private static instance: RepartidorServicio;
  private baseUrl = "https://localhost:8080/pedido";

  public static getInstance(): RepartidorServicio {
    if (!RepartidorServicio.instance) {
      RepartidorServicio.instance = new RepartidorServicio();
    }
    return RepartidorServicio.instance;
  }

  async obtenerPedidosRepartidor(): Promise<PedidosRepartidorResponse> {
    try {
      const response = await axios.get<PedidosRepartidorResponse>(`${this.baseUrl}/repartidor`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener pedidos del repartidor:", error);
      throw error;
    }
  }

  async marcarEnCamino(idPedido: number): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/enCamino/${idPedido}`);
    } catch (error) {
      console.error("Error al marcar pedido en camino:", error);
      throw error;
    }
  }

  async marcarEntregado(idPedido: number): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/entregado/${idPedido}`);
    } catch (error) {
      console.error("Error al marcar pedido como entregado:", error);
      throw error;
    }
  }
}
