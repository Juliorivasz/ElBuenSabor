import { ArticuloInsumo } from "./ArticuloInsumo";

export class ActualizacionCosto {
  idActualizacionCosto: number;
  nuevoCosto: number;
  fechaActualizacion: Date;
  articuloInsumo: ArticuloInsumo;

  constructor(
    idActualizacionCosto: number,
    nuevoCosto: number,
    fechaActualizacion: Date,
    articuloInsumo: ArticuloInsumo,
  ) {
    this.idActualizacionCosto = idActualizacionCosto;
    this.nuevoCosto = nuevoCosto;
    this.fechaActualizacion = fechaActualizacion;
    this.articuloInsumo = articuloInsumo;
  }

  public calcularCostoTotal(cantidad: number): number {
    return this.nuevoCosto * cantidad;
  }

  public actualizarCosto(nuevoCosto: number): void {
    this.nuevoCosto = nuevoCosto;
    this.fechaActualizacion = new Date();
  }
  public getCosto(): number {
    return this.nuevoCosto;
  }
  public getFechaActualizacion(): Date {
    return this.fechaActualizacion;
  }
  public getArticuloInsumo(): ArticuloInsumo {
    return this.articuloInsumo;
  }
  public setArticuloInsumo(articuloInsumo: ArticuloInsumo): void {
    this.articuloInsumo = articuloInsumo;
  }
  public setNuevoCosto(nuevoCosto: number): void {
    this.nuevoCosto = nuevoCosto;
  }
  public setFechaActualizacion(fechaActualizacion: Date): void {
    this.fechaActualizacion = fechaActualizacion;
  }
  public setIdActualizacionCosto(idActualizacionCosto: number): void {
    this.idActualizacionCosto = idActualizacionCosto;
  }
  public getIdActualizacionCosto(): number {
    return this.idActualizacionCosto;
  }
  public getNuevoCosto(): number {
    return this.nuevoCosto;
  }
  public getIdArticuloInsumo(): number {
    return this.articuloInsumo.getIdInsumo();
  }
}
