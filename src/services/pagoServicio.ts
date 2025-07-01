import axios from "axios"

export interface ItemDTO {
  title: string
  quantity: number
  unitPrice: number
}

export interface PreferenciaResponse {
  init_point: string
}

class PagoServicio {
  private baseUrl: string

  constructor() {
    this.baseUrl = "http://localhost:8080/api/pagos"
  }

  /**
   * Crea una preferencia de pago en Mercado Pago
   * @param items Lista de items para el pago
   * @returns Respuesta con el init_point para redirigir al checkout
   */
  async crearPreferencia(items: ItemDTO[]): Promise<PreferenciaResponse> {
    try {
      const response = await axios.post<PreferenciaResponse>(`${this.baseUrl}/preferencia`, items)
      return response.data
    } catch (error) {
      console.error("Error al crear preferencia de pago:", error)
      throw new Error("No se pudo crear la preferencia de pago")
    }
  }
}

export const pagoServicio = new PagoServicio()
