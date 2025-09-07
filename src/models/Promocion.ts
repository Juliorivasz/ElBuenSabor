export class Promocion {
  private idPromocion: number
  private titulo: string
  private descripcion: string
  private descuento: number
  private horarioInicio: string
  private horarioFin: string
  private activo: boolean
  private url: string
  private idArticulo: number
  private nombreArticulo: string
  private articuloActivo: boolean

  constructor(
    idPromocion: number,
    titulo: string,
    descripcion: string,
    descuento: number,
    horarioInicio: string,
    horarioFin: string,
    activo: boolean,
    url: string,
    idArticulo: number,
    nombreArticulo: string,
    articuloActivo = true,
  ) {
    this.idPromocion = idPromocion
    this.titulo = titulo
    this.descripcion = descripcion
    this.descuento = descuento
    this.horarioInicio = horarioInicio
    this.horarioFin = horarioFin
    this.activo = activo
    this.url = url
    this.idArticulo = idArticulo
    this.nombreArticulo = nombreArticulo
    this.articuloActivo = articuloActivo
  }

  // Getters
  getIdPromocion(): number {
    return this.idPromocion
  }

  getTitulo(): string {
    return this.titulo
  }

  getDescripcion(): string {
    return this.descripcion
  }

  getDescuento(): number {
    return this.descuento
  }

  getHorarioInicio(): string {
    return this.horarioInicio
  }

  getHorarioFin(): string {
    return this.horarioFin
  }

  getActivo(): boolean {
    return this.activo
  }

  getUrl(): string {
    return this.url
  }

  getIdArticulo(): number {
    return this.idArticulo
  }

  getNombreArticulo(): string {
    return this.nombreArticulo
  }

  getArticuloActivo(): boolean {
    return this.articuloActivo
  }

  // Setters
  setIdPromocion(idPromocion: number): void {
    this.idPromocion = idPromocion
  }

  setTitulo(titulo: string): void {
    this.titulo = titulo
  }

  setDescripcion(descripcion: string): void {
    this.descripcion = descripcion
  }

  setDescuento(descuento: number): void {
    this.descuento = descuento
  }

  setHorarioInicio(horarioInicio: string): void {
    this.horarioInicio = horarioInicio
  }

  setHorarioFin(horarioFin: string): void {
    this.horarioFin = horarioFin
  }

  setActivo(activo: boolean): void {
    this.activo = activo
  }

  setUrl(url: string): void {
    this.url = url
  }

  setIdArticulo(idArticulo: number): void {
    this.idArticulo = idArticulo
  }

  setNombreArticulo(nombreArticulo: string): void {
    this.nombreArticulo = nombreArticulo
  }

  setArticuloActivo(articuloActivo: boolean): void {
    this.articuloActivo = articuloActivo
  }

  // Método para verificar si la promoción puede ser activada
  puedeSerActivada(): boolean {
    return this.articuloActivo
  }
}
