import { DetallePedidoCajeroDto } from './DetallePedidoCajeroDto';

export class PedidosCajeroDto {
  idPedido: number;
  fechaYHora: string;
  horaEntrega: string;
  tipoEnvio: string;
  metodoDePago: string;
  total: number;
  estadoPedido: string;
  emailCliente: string;
  detalles: DetallePedidoCajeroDto[];

  constructor(
        idPedido: number,
        fechaYHora: string,
        horaEntrega: string,
        tipoEnvio: string,
        metodoDePago: string,
        total: number,
        estadoPedido: string,
        emailCliente: string,
        detalles: DetallePedidoCajeroDto[]
    ) {
        this.idPedido = idPedido;
        this.fechaYHora = fechaYHora;
        this.horaEntrega = horaEntrega;
        this.tipoEnvio = tipoEnvio;
        this.metodoDePago = metodoDePago;
        this.total = total;
        this.estadoPedido = estadoPedido;
        this.emailCliente = emailCliente;
        this.detalles = detalles;
    }

}