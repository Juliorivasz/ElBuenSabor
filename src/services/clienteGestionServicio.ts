import axios from "axios"
import type { ClienteGestion } from "../models/ClienteGestion"
import type { PageResponse } from "../models/PageResponse"

const API_URL = "https://localhost:8080/cliente"

export class ClienteGestionServicio {
  static async getClientesPaginados(page = 0, size = 10): Promise<PageResponse<ClienteGestion>> {
    try {
      const response = await axios.get<PageResponse<ClienteGestion>>(`${API_URL}/lista`, {
        params: { page, size },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching paginated clients:", error)
      throw error
    }
  }
}
