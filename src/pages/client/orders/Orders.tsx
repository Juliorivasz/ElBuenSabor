"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCartOutlined,
  SupportAgentOutlined,
  LocalShippingOutlined,
  RestaurantOutlined,
  AccessTimeOutlined,
  CalendarTodayOutlined,
  ReceiptOutlined,
  RefreshOutlined,
  CancelOutlined,
} from "@mui/icons-material";

import { OrderDetailModal } from "../../../components/orders/OrdersDetailModal";
import { useNavigate } from "react-router-dom";
import { pedidoServicio } from "../../../services/pedidoServicio";
import type { BackendDetallePedido, BackendPedido, OrderStatus } from "../../../types/orders";
import Swal from "sweetalert2";

interface OrderItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen?: string;
}

export interface Order {
  id: number;
  numeroOrden: string;
  fecha: string;
  hora: string;
  tipoEntrega: "delivery" | "takeaway";
  items: OrderItem[];
  estado:
    | "a_confirmar"
    | "en_preparacion"
    | "listo"
    | "en_camino"
    | "demorado"
    | "entregado"
    | "cancelado"
    | "rechazado";
  subtotal: number;
  costoEnvio: number;
  total: number;
  metodoPago: string;
  direccionEntrega?: {
    calle: string;
    numero: string;
    piso?: string;
    departamento?: string;
    ciudad: string;
    localidad: string;
    aclaraciones?: string;
  };
  tiempoEstimado: string;
  fechaCompleta: Date;
}

type TabType = "en_curso" | "pasadas";
type SortType = "mas_recientes" | "mas_antiguas" | "mas_pedidas";
type StatusFilterType =
  | "todos"
  | "a_confirmar"
  | "en_preparacion"
  | "listo"
  | "en_camino"
  | "demorado"
  | "entregado"
  | "cancelado"
  | "rechazado";

const ITEMS_PER_PAGE = 6;

export const Orders: React.FC = () => {
  const navigateTo = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("en_curso");
  const [sortBy, setSortBy] = useState<SortType>("mas_recientes");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<number | null>(null);

  // Mapear datos del backend al formato del frontend
  const mapBackendOrderToFrontend = (backendOrder: BackendPedido): Order => {
    const fechaYHora = new Date(backendOrder.fechaYHora);
    const horaEntrega = new Date(backendOrder.horaEntrega);

    // Calcular subtotal y total
    const subtotal = backendOrder.detalles.reduce(
      (sum: number, detalle: BackendDetallePedido) => sum + detalle.subtotal,
      0,
    );
    const costoEnvio = backendOrder.tipoEnvio === "DELIVERY" ? 300 : 0; // Valor estimado
    const total = subtotal + costoEnvio;

    // Mapear items
    const items: OrderItem[] = backendOrder.detalles.map((detalle: BackendDetallePedido, index: number) => ({
      id: index + 1,
      nombre: detalle.nombreArticulo,
      cantidad: detalle.cantidad,
      precio: detalle.subtotal / detalle.cantidad,
    }));

    // Mapear dirección si existe
    let direccionEntrega;
    if (backendOrder.direccion) {
      direccionEntrega = {
        calle: backendOrder.direccion.calle,
        numero: backendOrder.direccion.numero,
        piso: backendOrder.direccion.piso || undefined,
        departamento: backendOrder.direccion.dpto || undefined,
        ciudad: backendOrder.direccion.nombreDepartamento,
        localidad: backendOrder.direccion.nombreDepartamento,
        aclaraciones: backendOrder.direccion.nombre || undefined,
      };
    }

    // Calcular tiempo estimado
    const tiempoRestante = Math.max(0, Math.floor((horaEntrega.getTime() - new Date().getTime()) / (1000 * 60)));
    const tiempoEstimado = tiempoRestante > 0 ? `${tiempoRestante} minutos` : "Tiempo cumplido";

    return {
      id: backendOrder.idPedido,
      numeroOrden: backendOrder.idPedido.toString(),
      fecha: fechaYHora.toISOString().split("T")[0],
      hora: fechaYHora.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      tipoEntrega: backendOrder.tipoEnvio === "DELIVERY" ? "delivery" : "takeaway",
      items,
      estado: backendOrder.estadoPedido.toLowerCase().replace("_", "_") as OrderStatus,
      subtotal,
      costoEnvio,
      total,
      metodoPago: backendOrder.metodoDePago === "MERCADO_PAGO" ? "Mercado Pago" : "Efectivo",
      direccionEntrega,
      tiempoEstimado,
      fechaCompleta: fechaYHora,
    };
  };

  // Cargar órdenes desde el backend
  const loadOrders = async (tab: TabType, page = 0) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (tab === "en_curso") {
        response = await pedidoServicio.obtenerPedidosEnCursoCliente(page, ITEMS_PER_PAGE);
      } else {
        response = await pedidoServicio.obtenerHistorialPedidosCliente(page, ITEMS_PER_PAGE);
      }

      const mappedOrders = response.content.map(mapBackendOrderToFrontend);
      setOrders(mappedOrders);
      setTotalPages(response.page.totalPages);
      setTotalElements(response.page.totalElements);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Error al cargar las órdenes. Por favor, intenta nuevamente.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar órdenes cuando cambia el tab o la página
  useEffect(() => {
    loadOrders(activeTab, currentPage - 1);
  }, [activeTab, currentPage]);

  // Filtrar y ordenar órdenes localmente
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Aplicar filtro de estado
    if (statusFilter !== "todos") {
      filtered = filtered.filter((order) => order.estado === statusFilter);
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case "mas_recientes":
        // Más recientes: fechas más cercanas a la fecha actual (descendente)
        filtered.sort((a, b) => b.fechaCompleta.getTime() - a.fechaCompleta.getTime());
        break;
      case "mas_antiguas":
        // Más antiguas: fechas más lejanas a la fecha actual (ascendente)
        filtered.sort((a, b) => a.fechaCompleta.getTime() - b.fechaCompleta.getTime());
        break;
      case "mas_pedidas":
        // Más pedidas: por cantidad de items (descendente)
        filtered.sort((a, b) => {
          const totalItemsA = a.items.reduce((sum, item) => sum + item.cantidad, 0);
          const totalItemsB = b.items.reduce((sum, item) => sum + item.cantidad, 0);
          return totalItemsB - totalItemsA;
        });
        break;
    }

    return filtered;
  }, [orders, sortBy, statusFilter]);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "a_confirmar":
        return "bg-yellow-100 text-yellow-800";
      case "en_preparacion":
        return "bg-orange-100 text-orange-800";
      case "listo":
        return "bg-blue-100 text-blue-800";
      case "en_camino":
        return "bg-purple-100 text-purple-800";
      case "demorado":
        return "bg-red-100 text-red-800";
      case "entregado":
        return "bg-green-100 text-green-800";
      case "cancelado":
      case "rechazado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "a_confirmar":
        return "A Confirmar";
      case "en_preparacion":
        return "En Preparación";
      case "listo":
        return "Listo";
      case "en_camino":
        return "En Camino";
      case "demorado":
        return "Demorado";
      case "entregado":
        return "Entregado";
      case "cancelado":
        return "Cancelado";
      case "rechazado":
        return "Rechazado";
      default:
        return estado;
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleRepeatOrder = (order: Order) => {
    console.log(order);
    navigateTo("/cart");
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setCancellingOrderId(orderId);
      await pedidoServicio.cancelarPedido(orderId);

      // Recargar las órdenes después de cancelar
      await loadOrders(activeTab, currentPage - 1);

      // Mostrar mensaje de éxito (opcional)
      console.log("Pedido cancelado exitosamente");
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
      setError("Error al cancelar el pedido. Por favor, intenta nuevamente.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
    setDownloadingInvoiceId(orderId);
    try {
      // Mostrar indicador de carga
      Swal.fire({
        title: "Generando factura...",
        text: "Por favor espera mientras se genera la factura.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Realizar la petición para descargar la factura
      const response = await fetch(`https://localhost:8080/factura/descargar/${orderId}`, {
        method: "GET",
        headers: {
          // Incluir headers de autenticación si son necesarios
          // 'Authorization': `Bearer ${token}`,
        },
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error al descargar la factura: ${response.status} ${response.statusText}`);
      }

      // Obtener el blob de la respuesta
      const blob = await response.blob();

      // Obtener el nombre del archivo de las cabeceras de la respuesta o usar uno predeterminado
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `factura-pedido-${orderId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);

      // Simular un clic en el enlace para iniciar la descarga
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mostrar mensaje de éxito
      Swal.fire({
        title: "¡Factura descargada!",
        text: "La factura se ha descargado correctamente.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      console.error("Error al generar factura:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al generar la factura. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const canCancelOrder = (estado: string) => {
    // Solo se puede cancelar antes de que el pedido esté listo
    return ["a_confirmar", "en_preparacion"].includes(estado);
  };

  const formatItems = (items: OrderItem[]) => {
    const itemsText = items.map((item) => `${item.cantidad}x ${item.nombre}`).join(", ");
    return itemsText.length > 50 ? itemsText.substring(0, 50) + "..." : itemsText;
  };

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setStatusFilter("todos");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando órdenes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            <button
              onClick={() => {
                setError(null);
                loadOrders(activeTab, currentPage - 1);
              }}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay órdenes
  if (!loading && orders.length === 0 && totalElements === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCartOutlined
                  className="text-orange-600"
                  sx={{ fontSize: 40 }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeTab === "en_curso" ? "No tienes órdenes en curso" : "No tienes órdenes pasadas"}
              </h2>
              <p className="text-gray-600 mb-8">
                {activeTab === "en_curso"
                  ? "¡Explora nuestro delicioso catálogo y haz tu primer pedido!"
                  : "Cuando realices pedidos, aparecerán aquí tu historial."}
              </p>
              {activeTab === "en_curso" && (
                <button
                  onClick={() => navigateTo("/catalog")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Ir al Catálogo
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Mis Órdenes</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gestiona y revisa tus pedidos</p>
        </motion.div>

        {/* Support Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end mb-4">
          <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg shadow-md transition-colors duration-200 text-sm">
            <SupportAgentOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
            <span className="hidden sm:inline">Soporte</span>
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => handleTabChange("en_curso")}
              className={`flex-1 py-3 sm:py-4 px-4 text-sm sm:text-base font-medium transition-colors duration-200 ${
                activeTab === "en_curso"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-gray-100"
                  : "text-gray-600 hover:text-gray-800"
              }`}>
              Órdenes en Curso
            </button>
            <button
              onClick={() => handleTabChange("pasadas")}
              className={`flex-1 py-3 sm:py-4 px-4 text-sm sm:text-base font-medium transition-colors duration-200 ${
                activeTab === "pasadas"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-gray-100"
                  : "text-gray-600 hover:text-gray-800"
              }`}>
              Órdenes Pasadas
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b bg-gray-50 rounded-b-2xl text-black">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sort Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                  <option value="mas_recientes">Más Recientes</option>
                  <option value="mas_antiguas">Más Antiguas</option>
                  <option value="mas_pedidas">Más Pedidas</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                  <option value="todos">Todos</option>
                  {activeTab === "en_curso" ? (
                    <>
                      <option value="a_confirmar">A Confirmar</option>
                      <option value="en_preparacion">En Preparación</option>
                      <option value="listo">Listo</option>
                      <option value="en_camino">En Camino</option>
                      <option value="demorado">Demorado</option>
                    </>
                  ) : (
                    <>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="rechazado">Rechazado</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12">
            <p className="text-gray-600">No se encontraron órdenes con los filtros seleccionados.</p>
          </motion.div>
        ) : (
          <>
            {/* Desktop Cards */}
            <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleOrderClick(order)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Orden #{order.numeroOrden}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <AccessTimeOutlined sx={{ fontSize: 16 }} />
                          <span>{order.hora}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {order.tipoEntrega === "delivery" ? (
                            <LocalShippingOutlined sx={{ fontSize: 16 }} />
                          ) : (
                            <RestaurantOutlined sx={{ fontSize: 16 }} />
                          )}
                          <span>{order.tipoEntrega === "delivery" ? "Delivery" : "Retiro"}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                      {getStatusText(order.estado)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                    <CalendarTodayOutlined sx={{ fontSize: 16 }} />
                    <span>{new Date(order.fecha).toLocaleDateString()}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2">Productos:</p>
                    <p className="text-sm text-gray-600">{formatItems(order.items)}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-semibold text-lg text-gray-800">${order.total}</span>
                    <div className="flex space-x-2">
                      {activeTab === "en_curso" ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRepeatOrder(order);
                            }}
                            className="flex items-center space-x-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm">
                            <RefreshOutlined sx={{ fontSize: 16 }} />
                            <span>Repetir</span>
                          </button>
                          {canCancelOrder(order.estado) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order.id);
                              }}
                              disabled={cancellingOrderId === order.id}
                              className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                              <CancelOutlined sx={{ fontSize: 16 }} />
                              <span>{cancellingOrderId === order.id ? "Cancelando..." : "Cancelar"}</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRepeatOrder(order);
                            }}
                            className="flex items-center space-x-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm">
                            <RefreshOutlined sx={{ fontSize: 16 }} />
                            <span>Repetir</span>
                          </button>
                          {order.estado === "entregado" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadInvoice(order.id);
                              }}
                              disabled={downloadingInvoiceId === order.id}
                              className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                              <ReceiptOutlined sx={{ fontSize: 16 }} />
                              <span>{downloadingInvoiceId === order.id ? "Descargando..." : "Factura"}</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile List */}
            <div className="sm:hidden space-y-4 mb-8">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-4 cursor-pointer"
                  onClick={() => handleOrderClick(order)}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">Orden #{order.numeroOrden}</h3>
                      <p className="text-xs text-gray-600">{new Date(order.fecha).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                      {getStatusText(order.estado)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <AccessTimeOutlined sx={{ fontSize: 14 }} />
                      <span>{order.hora}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {order.tipoEntrega === "delivery" ? (
                        <LocalShippingOutlined sx={{ fontSize: 14 }} />
                      ) : (
                        <RestaurantOutlined sx={{ fontSize: 14 }} />
                      )}
                      <span>{order.tipoEntrega === "delivery" ? "Delivery" : "Retiro"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3">{formatItems(order.items)}</p>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-semibold text-gray-800">${order.total}</span>
                    <div className="flex space-x-2">
                      {activeTab === "en_curso" ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRepeatOrder(order);
                            }}
                            className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                            Repetir
                          </button>
                          {canCancelOrder(order.estado) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order.id);
                              }}
                              disabled={cancellingOrderId === order.id}
                              className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                              {cancellingOrderId === order.id ? "Cancelando..." : "Cancelar"}
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRepeatOrder(order);
                            }}
                            className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                            Repetir
                          </button>
                          {order.estado === "entregado" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadInvoice(order.id);
                              }}
                              disabled={downloadingInvoiceId === order.id}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                              {downloadingInvoiceId === order.id ? "Descargando..." : "Factura"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center">
                {/* Desktop Pagination */}
                <div className="hidden sm:flex space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200">
                    Anterior
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === page
                            ? "bg-orange-500 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}>
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200">
                    Siguiente
                  </button>
                </div>

                {/* Mobile Pagination - Solo navegación simple */}
                <div className="sm:hidden w-full max-w-sm mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-4">
                    {/* Indicador de página actual */}
                    <div className="text-center mb-4">
                      <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(currentPage / totalPages) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Botones de navegación */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-1 px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 transition-colors duration-200">
                        <span className="text-sm">← Anterior</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        {/* Input para ir a página específica */}
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = Number.parseInt(e.target.value);
                            if (page >= 1 && page <= totalPages) {
                              handlePageChange(page);
                            }
                          }}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <button
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-1 px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 transition-colors duration-200">
                        <span className="text-sm">Siguiente →</span>
                      </button>
                    </div>

                    {/* Navegación rápida */}
                    <div className="flex justify-center space-x-2 mt-3">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200">
                        Primera
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200">
                        Última
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};
