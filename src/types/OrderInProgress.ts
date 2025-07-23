export interface DetallePedidoCliente {
  nombreArticulo: string;
  cantidad: number;
  subtotal: number;
}

export interface Direccion {
  idDireccion: number;
  nombre: string | null;
  calle: string;
  numero: string;
  piso: string | null;
  dpto: string | null;
  nombreDepartamento: string;
  idDepartamento: number;
}

export interface Repartidor {
  idUsuario: number;
  auth0Id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  ubicacionActual?: { lat: number; lng: number }; // Si se envía la ubicación del repartidor
}

export type EstadoPedido =
  | "A_CONFIRMAR"
  | "EN_PREPARACION"
  | "LISTO"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO"
  | "RECHAZADO";

export type TipoEnvio = "DELIVERY" | "RETIRO_EN_LOCAL";

export type MetodoDePago = "MERCADO_PAGO" | "EFECTIVO";

export interface OrderInProgress {
  idPedido: number;
  fechaYHora: string; // LocalDateTime en Java se serializa como string
  horaEntrega: string; // LocalDateTime en Java se serializa como string
  estadoPedido: EstadoPedido;
  tipoEnvio: TipoEnvio;
  metodoDePago: MetodoDePago;
  detalles: DetallePedidoCliente[];
  direccion: Direccion | null; // Puede ser null para retiro en local
  repartidor: Repartidor | null;
  tiempoTranscurrido: number;
}

// DTO para las actualizaciones de WebSocket desde el backend
export interface OrderStatusUpdate {
  orderId: number; // Corresponde a idPedido
  estado: EstadoPedido; // Corresponde a estadoPedido
  clienteId: number;
  horaEntrega?: string; // Nuevo tiempo estimado (en formato string de LocalDateTime)
  repartidorId?: number;
  repartidorNombre?: string;
  repartidorTelefono?: string; // Si decides enviarlo
  ubicacionRepartidor?: { lat: number; lng: number };
  mensajeActualizacion?: string;
}
