import { PedidosCajeroDto } from "../../models/dto/Pedido/PedidoCajeroDto";
import { DetallePedidoDTO, PedidoDTO } from "../../models/dto/PedidoDTO";


export const mapperPedidosCajeroDtoToPedidoDTO = (
  pedidosCajeroDto: PedidosCajeroDto,
): PedidoDTO => {
  return new PedidoDTO(
    pedidosCajeroDto.idPedido,
    pedidosCajeroDto.fechaYHora,
    pedidosCajeroDto.estadoPedido,
    pedidosCajeroDto.tipoEnvio,
    pedidosCajeroDto.emailCliente,
    pedidosCajeroDto.detalles.map(detalle => new DetallePedidoDTO(
      detalle.idDetallePedido,
      detalle.cantidad,
      detalle.subtotal,
      detalle.idArticulo,
      detalle.nombreArticulo,
      detalle.tituloPromocion,
      detalle.idPromocion
    )),
    pedidosCajeroDto.horaEntrega,
    pedidosCajeroDto.metodoDePago,
    pedidosCajeroDto.total

  );
};