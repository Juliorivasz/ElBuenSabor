import type { NuevoRubroInsumoDto } from "../models/dto/NuevoRubroInsumoDto"
import { RubroInsumoDto } from "../models/dto/RubroInsumoDto"
import { interceptorsApiClient } from "./interceptors/axios.interceptors"

const BASE_URL = "https://localhost:8080"

interface RubroInsumoApiResponse {
  idRubroInsumo: number
  nombre: string
  dadoDeAlta: boolean
  idRubroInsumoPadre?: number | null
}

interface ListaRubrosResponse {
  rubrosDto: RubroInsumoApiResponse[]
}

export class RubroInsumoServicio {
  // GET /rubroInsumo/lista
  static async listarRubros(): Promise<RubroInsumoDto[]> {
    try {
      const response = await interceptorsApiClient(`/rubroInsumo/abm`)

      const data: ListaRubrosResponse = await response.data

      const rubros = data.rubrosDto.map(
        (item): RubroInsumoDto =>
          RubroInsumoDto.fromPlainObject({
            idRubroInsumo: item.idRubroInsumo,
            nombre: item.nombre,
            dadoDeAlta: item.dadoDeAlta,
            idRubroInsumoPadre: item.idRubroInsumoPadre || null,
            subrubros: [],
          }),
      )

      // Organizar jerarquía
      return this.organizarJerarquia(rubros)
    } catch (error) {
      console.error("Error al listar rubros:", error)
      throw error
    }
  }

  // POST /rubroInsumo/nuevo
  static async crearRubro(nuevoRubro: NuevoRubroInsumoDto): Promise<void> {
    try {
      await interceptorsApiClient.post(`/rubroInsumo/nuevo`, nuevoRubro.toJSON())

      /*const data: RubroInsumoApiResponse = await response.json()

      return new RubroInsumoDto(
        data.idRubroInsumo,
        data.nombre,
        data.dadoDeAlta || false,
        data.idRubroInsumoPadre || null,
      )*/
    } catch (error) {
      console.error("Error al crear rubro:", error)
      throw error
    }
  }

  // PUT /rubroInsumo/actualizar/{id} (asumiendo que existe)
  static async actualizarRubro(idRubro: number, rubro: NuevoRubroInsumoDto): Promise<RubroInsumoDto> {
    try {
      const response = await fetch(`${BASE_URL}/rubroInsumo/actualizar/${idRubro}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rubro.toJSON()),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al actualizar rubro: ${response.status} - ${errorText}`)
      }

      const data: RubroInsumoApiResponse = await response.json()

      return RubroInsumoDto.fromPlainObject({
        idRubroInsumo: data.idRubroInsumo,
        nombre: data.nombre,
        dadoDeAlta: data.dadoDeAlta,
        idRubroInsumoPadre: data.idRubroInsumoPadre || null,
        subrubros: [],
      })
    } catch (error) {
      console.error("Error al actualizar rubro:", error)
      throw error
    }
  }

  // POST /rubroInsumo/altaBaja/{id} (asumiendo que existe)
  static async toggleEstadoRubro(idRubro: number): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/rubroInsumo/altaBaja/${idRubro}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al cambiar estado de rubro: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("Error al cambiar estado de rubro:", error)
      throw error
    }
  }

  // Método auxiliar para organizar jerarquía
  private static organizarJerarquia(rubros: RubroInsumoDto[]): RubroInsumoDto[] {
    const rubrosPadre = rubros.filter(
      (rubro) => rubro.getIdRubroInsumoPadre() === null || rubro.getIdRubroInsumoPadre() === 0,
    )

    rubrosPadre.forEach((padre) => {
      const subrubros = this.obtenerSubrubrosRecursivo(padre.getIdRubroInsumo(), rubros)
      padre.setSubrubros(subrubros)
    })

    return rubrosPadre
  }

  private static obtenerSubrubrosRecursivo(idPadre: number, todosLosRubros: RubroInsumoDto[]): RubroInsumoDto[] {
    const subrubros = todosLosRubros.filter((rubro) => rubro.getIdRubroInsumoPadre() === idPadre)

    subrubros.forEach((subrubro) => {
      const subsubrubros = this.obtenerSubrubrosRecursivo(subrubro.getIdRubroInsumo(), todosLosRubros)
      subrubro.setSubrubros(subsubrubros)
    })

    return subrubros
  }
}
