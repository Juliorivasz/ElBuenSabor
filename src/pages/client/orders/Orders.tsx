import type React from "react";
import { useState, useMemo } from "react";
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

interface OrderItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen?: string;
}

interface Order {
  id: number;
  numeroOrden: string;
  fecha: string;
  hora: string;
  tipoEntrega: "delivery" | "takeaway";
  items: OrderItem[];
  estado: "en_preparacion" | "listo" | "en_camino" | "demorado" | "entregado" | "cancelado";
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
}

type TabType = "en_curso" | "pasadas";
type SortType = "mas_recientes" | "mas_antiguas" | "mas_pedidas";
type StatusFilterType = "todos" | "en_preparacion" | "listo" | "en_camino" | "demorado" | "entregado" | "cancelado";

const ITEMS_PER_PAGE = 6;

export const Orders: React.FC = () => {
  const navigateTo = useNavigate();

  // Estado de ejemplo - en producción vendría de una API
  const [orders] = useState<Order[]>([
    {
      id: 1,
      numeroOrden: "7341",
      fecha: "2024-01-15",
      hora: "14:30",
      tipoEntrega: "delivery",
      items: [
        { id: 1, nombre: "Hamburguesa Clásica", cantidad: 2, precio: 1200 },
        { id: 2, nombre: "Papas Fritas", cantidad: 1, precio: 800 },
        { id: 3, nombre: "Coca Cola 500ml", cantidad: 2, precio: 400 },
      ],
      estado: "en_preparacion",
      subtotal: 3200,
      costoEnvio: 300,
      total: 3500,
      metodoPago: "Tarjeta de Crédito",
      direccionEntrega: {
        calle: "Av. San Martín",
        numero: "1234",
        piso: "2",
        departamento: "A",
        ciudad: "Mendoza",
        localidad: "Ciudad",
        aclaraciones: "Portero eléctrico, tocar timbre 2A",
      },
      tiempoEstimado: "30-45 minutos",
    },
    {
      id: 2,
      numeroOrden: "7340",
      fecha: "2024-01-14",
      hora: "19:45",
      tipoEntrega: "takeaway",
      items: [
        { id: 3, nombre: "Pizza Margherita", cantidad: 1, precio: 1800 },
        { id: 4, nombre: "Coca Cola 500ml", cantidad: 2, precio: 400 },
      ],
      estado: "entregado",
      subtotal: 2600,
      costoEnvio: 0,
      total: 2600,
      metodoPago: "Efectivo",
      tiempoEstimado: "15-20 minutos",
    },
    {
      id: 3,
      numeroOrden: "7339",
      fecha: "2024-01-13",
      hora: "12:15",
      tipoEntrega: "delivery",
      items: [
        { id: 5, nombre: "Ensalada César", cantidad: 1, precio: 1400 },
        { id: 6, nombre: "Agua Mineral", cantidad: 1, precio: 200 },
      ],
      estado: "en_camino",
      subtotal: 1600,
      costoEnvio: 250,
      total: 1850,
      metodoPago: "Tarjeta de Débito",
      direccionEntrega: {
        calle: "Belgrano",
        numero: "567",
        ciudad: "Mendoza",
        localidad: "Godoy Cruz",
        aclaraciones: "Casa con portón verde",
      },
      tiempoEstimado: "25-35 minutos",
    },
  ]);

  const [activeTab, setActiveTab] = useState<TabType>("en_curso");
  const [sortBy, setSortBy] = useState<SortType>("mas_recientes");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar órdenes por tab
  const filteredOrders = useMemo(() => {
    const enCursoStates = ["en_preparacion", "listo", "en_camino", "demorado"];
    const pasadasStates = ["entregado", "cancelado"];

    let filtered = orders.filter((order) => {
      if (activeTab === "en_curso") {
        return enCursoStates.includes(order.estado);
      } else {
        return pasadasStates.includes(order.estado);
      }
    });

    // Aplicar filtro de estado
    if (statusFilter !== "todos") {
      filtered = filtered.filter((order) => order.estado === statusFilter);
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case "mas_recientes":
        filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        break;
      case "mas_antiguas":
        filtered.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        break;
      case "mas_pedidas":
        filtered.sort((a, b) => b.items.length - a.items.length);
        break;
    }

    return filtered;
  }, [orders, activeTab, sortBy, statusFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "en_preparacion":
        return "bg-yellow-100 text-yellow-800";
      case "listo":
        return "bg-blue-100 text-blue-800";
      case "en_camino":
        return "bg-purple-100 text-purple-800";
      case "demorado":
        return "bg-red-100 text-red-800";
      case "entregado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
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
    // Lógica para agregar items al carrito
    console.log("Repetir orden:", order);
    navigateTo("/cart");
  };

  const handleCancelOrder = (orderId: number) => {
    // Lógica para cancelar orden
    console.log("Cancelar orden:", orderId);
  };

  const handleViewInvoice = (orderId: number) => {
    // Lógica para ver factura
    console.log("Ver factura:", orderId);
  };

  const canCancelOrder = (estado: string) => {
    return ["en_preparacion", "listo"].includes(estado);
  };

  const formatItems = (items: OrderItem[]) => {
    const itemsText = items.map((item) => `${item.cantidad}x ${item.nombre}`).join(", ");
    return itemsText.length > 50 ? itemsText.substring(0, 50) + "..." : itemsText;
  };

  // Si no hay órdenes
  if (orders.length === 0) {
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes órdenes aún</h2>
              <p className="text-gray-600 mb-8">¡Explora nuestro delicioso catálogo y haz tu primer pedido!</p>
              <button
                onClick={() => navigateTo("/catalog")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Ir al Catálogo
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16">
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
              onClick={() => {
                setActiveTab("en_curso");
                setCurrentPage(1);
                setStatusFilter("todos");
              }}
              className={`flex-1 py-3 sm:py-4 px-4 text-sm sm:text-base font-medium transition-colors duration-200 ${
                activeTab === "en_curso"
                  ? "text-orange-600 border-b-2 border-orange-600 bg-gray-100"
                  : "text-gray-600 hover:text-gray-800"
              }`}>
              Órdenes en Curso
            </button>
            <button
              onClick={() => {
                setActiveTab("pasadas");
                setCurrentPage(1);
                setStatusFilter("todos");
              }}
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
                      <option value="en_preparacion">En Preparación</option>
                      <option value="listo">Listo</option>
                      <option value="en_camino">En Camino</option>
                      <option value="demorado">Demorado</option>
                    </>
                  ) : (
                    <>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
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
              {paginatedOrders.map((order, index) => (
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
                              className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm">
                              <CancelOutlined sx={{ fontSize: 16 }} />
                              <span>Cancelar</span>
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
                                handleViewInvoice(order.id);
                              }}
                              className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm">
                              <ReceiptOutlined sx={{ fontSize: 16 }} />
                              <span>Factura</span>
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
              {paginatedOrders.map((order, index) => (
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
                              className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                              Cancelar
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
                                handleViewInvoice(order.id);
                              }}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              Factura
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
                className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200">
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}>
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200">
                  Siguiente
                </button>
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
