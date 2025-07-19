import type { Direccion } from "../Direccion"

export class DireccionesResponseDTO {
  direcciones: Direccion[]

  constructor(direcciones: Direccion[] = []) {
    this.direcciones = direcciones
  }
}
