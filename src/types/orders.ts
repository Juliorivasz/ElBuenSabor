// Tipos para los datos que vienen del backend
export interface BackendDireccion {
  idDireccion: number;
  nombre: string | null;
  calle: string;
  numero: string;
  piso: string | null;
  dpto: string | null;
  nombreDepartamento: string;
  idDepartamento: number;
}

export interface BackendDetallePedido {
  nombreArticulo: string;
  cantidad: number;
  subtotal: number;
}

export interface BackendPedido {
  idPedido: number;
  fechaYHora: string;
  horaEntrega: string;
  estadoPedido: string;
  tipoEnvio: string;
  metodoDePago: string;
  detalles: BackendDetallePedido[];
  direccion: BackendDireccion;
  repartidor: string | null;
}

export interface BackendPageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface BackendPaginatedResponse<T> {
  content: T[];
  page: BackendPageInfo;
}

// Tipos para el frontend
export interface OrderAddress {
  id: number;
  name: string | null;
  street: string;
  number: string;
  floor: string | null;
  apartment: string | null;
  department: string;
  departmentId: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  date: string;
  deliveryTime: string;
  status: OrderStatus;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  address: OrderAddress;
  deliveryPerson: string | null;
  total: number;
  fechaCompleta: Date;
}

export type OrderStatus =
  | "a_confirmar"
  | "en_preparacion"
  | "listo"
  | "en_camino"
  | "entregado"
  | "cancelado"
  | "rechazado";

export type DeliveryType = "delivery" | "retiro_en_local";
export type PaymentMethod = "mercado_pago" | "efectivo";

export type TabType = "en_curso" | "historial";

export interface OrderFilters {
  status: string;
  sortBy: string;
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  cancellingOrderId: number | null;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  a_confirmar: "A confirmar",
  en_preparacion: "En preparación",
  listo: "Listo",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
  rechazado: "Rechazado",
};

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  delivery: "Delivery",
  retiro_en_local: "Retiro en local",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mercado_pago: "Mercado Pago",
  efectivo: "Efectivo",
};
