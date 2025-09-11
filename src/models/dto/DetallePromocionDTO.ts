export interface DetallePromocionDto {
  idArticulo: number;
  cantidad: number;
  nombreArticulo?: string;
  precio?: number;
  activo?: boolean;
}
