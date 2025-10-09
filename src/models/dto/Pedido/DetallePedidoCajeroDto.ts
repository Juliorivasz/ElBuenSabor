export class DetallePedidoCajeroDto {
  idDetallePedido: number;
  idArticulo: number | null;
  nombreArticulo: string | null;
  idPromocion: number | null;
  tituloPromocion: string | null;
  cantidad: number;
  subtotal: number;

  constructor(
        idDetallePedido: number,
        idArticulo: number | null,
        nombreArticulo: string | null,
        idPromocion: number | null,
        tituloPromocion: string | null,
        cantidad: number,
        subtotal: number
  ) {
        this.idDetallePedido = idDetallePedido;
        this.idArticulo = idArticulo;
        this.nombreArticulo = nombreArticulo;
        this.idPromocion = idPromocion;
        this.tituloPromocion = tituloPromocion;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }
}