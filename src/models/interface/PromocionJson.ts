export interface IPromocionJson {
  idPromocion: number;
  titulo: string;
  descripcion: string;
  horarioInicio: string;
  horarioFin: string;
  activo: boolean;
  url: string;
  precioPromocion: number;
  detalles: IDetallePromocionJson[];
  tiempoDeCocina?: number;
}

export interface PromocionCatalogo {
  idPromocion: number
  titulo: string
  descripcion: string
  url: string
  horarioInicio: string
  horarioFin: string
  detalles: IDetallePromocionJson[]
}
export interface IDetallePromocionJson {
  idArticulo: number;
  cantidad: number;
  nombreArticulo?: string;
  precio?: number;
}

export interface IPromocionDescuentoJson {
  precioBase: number;
  precioPromocional: number;
  ahorro: number;
}

