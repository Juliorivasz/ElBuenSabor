export class RubroInsumoDto {
  private _idRubroInsumo: number
  private _nombre: string
  private _dadoDeAlta: boolean
  private _idRubroInsumoPadre: number | null
  private _subrubros: RubroInsumoDto[]

  constructor(
    idRubroInsumo: number,
    nombre: string,
    dadoDeAlta: boolean,
    idRubroInsumoPadre: number | null = null,
    subrubros: RubroInsumoDto[] = [],
  ) {
    this._idRubroInsumo = idRubroInsumo
    this._nombre = nombre
    this._dadoDeAlta = dadoDeAlta
    this._idRubroInsumoPadre = idRubroInsumoPadre
    this._subrubros = subrubros
  }

  // Getters
  getIdRubroInsumo(): number {
    return this._idRubroInsumo
  }

  getNombre(): string {
    return this._nombre
  }

  getDadoDeAlta(): boolean {
    return this._dadoDeAlta
  }

  getIdRubroInsumoPadre(): number | null {
    return this._idRubroInsumoPadre
  }

  getSubrubros(): RubroInsumoDto[] {
    return this._subrubros
  }

  // Setters
  setSubrubros(subrubros: RubroInsumoDto[]): void {
    this._subrubros = subrubros
  }

  // Métodos de utilidad
  isActivo(): boolean {
    return this._dadoDeAlta
  }

  esRubroPadre(): boolean {
    return this._idRubroInsumoPadre === null || this._idRubroInsumoPadre === 0
  }

  tieneSubrubros(): boolean {
    return this._subrubros.length > 0
  }

  // Método para serialización
  toJSON(): {
    idRubroInsumo: number,
    nombre: string,
    dadoDeAlta: boolean,
    idRubroInsumoPadre: number | null,
    subrubros: ReturnType<RubroInsumoDto['toJSON']>[],
  } {
    return {
      idRubroInsumo: this._idRubroInsumo,
      nombre: this._nombre,
      dadoDeAlta: this._dadoDeAlta,
      idRubroInsumoPadre: this._idRubroInsumoPadre,
      subrubros: this._subrubros.map((sub) => sub.toJSON()),
    }
  }

  // Factory method para crear desde objeto plano
  static fromPlainObject(obj: any): RubroInsumoDto {
    const subrubros = obj.subrubros ? obj.subrubros.map((sub: any) => RubroInsumoDto.fromPlainObject(sub)) : []
    return new RubroInsumoDto(
      obj.idRubroInsumo || obj._idRubroInsumo,
      obj.nombre || obj._nombre,
      obj.dadoDeAlta !== undefined ? obj.dadoDeAlta : obj._dadoDeAlta,
      obj.idRubroInsumoPadre !== undefined ? obj.idRubroInsumoPadre : obj._idRubroInsumoPadre,
      subrubros,
    )
  }
}

// Funciones de utilidad independientes para compatibilidad
export const isRubroActivo = (rubro: RubroInsumoDto): boolean => {
  return rubro.isActivo()
}

export const esRubroPadre = (rubro: RubroInsumoDto): boolean => {
  return rubro.esRubroPadre()
}

export const tieneSubrubros = (rubro: RubroInsumoDto): boolean => {
  return rubro.tieneSubrubros()
}

export const getNombreRubroPadre = (rubro: RubroInsumoDto, rubros: RubroInsumoDto[]): string => {
  if (rubro.esRubroPadre()) return "Rubro Principal"

  const padre = rubros.find((r) => r.getIdRubroInsumo() === rubro.getIdRubroInsumoPadre())
  return padre ? padre.getNombre() : "Sin rubro padre"
}
