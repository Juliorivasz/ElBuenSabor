"use client";

import { useState, useEffect } from "react";
import { useAuth0Store } from "../../../store/auth/useAuth0Store";
import { TrendingUp, Users, ShoppingCart, DollarSign, CheckCircle, AlertCircle, Package } from "lucide-react";

interface DashboardStats {
  totalPedidos: number;
  pedidosHoy: number;
  ventasHoy: number;
  clientesActivos: number;
}

interface PedidoReciente {
  id: number;
  cliente: string;
  total: number;
  estado: string;
  fecha: string;
}

export const Dashboard = () => {
  const { user } = useAuth0Store();
  const [stats, setStats] = useState<DashboardStats>({
    totalPedidos: 0,
    pedidosHoy: 0,
    ventasHoy: 0,
    clientesActivos: 0,
  });
  const [pedidosRecientes, setPedidosRecientes] = useState<PedidoReciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadDashboardData = async () => {
      setLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Datos simulados
      setStats({
        totalPedidos: 1247,
        pedidosHoy: 23,
        ventasHoy: 15420,
        clientesActivos: 89,
      });

      setPedidosRecientes([
        {
          id: 1001,
          cliente: "Juan Pérez",
          total: 2850,
          estado: "preparando",
          fecha: "2024-01-15 14:30",
        },
        {
          id: 1002,
          cliente: "María García",
          total: 1920,
          estado: "entregado",
          fecha: "2024-01-15 14:15",
        },
        {
          id: 1003,
          cliente: "Carlos López",
          total: 3200,
          estado: "pendiente",
          fecha: "2024-01-15 14:00",
        },
        {
          id: 1004,
          cliente: "Ana Martínez",
          total: 1650,
          estado: "en_camino",
          fecha: "2024-01-15 13:45",
        },
      ]);

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "preparando":
        return "bg-blue-100 text-blue-800";
      case "en_camino":
        return "bg-purple-100 text-purple-800";
      case "entregado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "preparando":
        return "Preparando";
      case "en_camino":
        return "En Camino";
      case "entregado":
        return "Entregado";
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bienvenido de vuelta, {user?.name || "Administrador"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última actualización</p>
            <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Hoy</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pedidosHoy}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% vs ayer</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
              <p className="text-3xl font-bold text-gray-900">${stats.ventasHoy.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8% vs ayer</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPedidos.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+15% este mes</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.clientesActivos}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+5% esta semana</span>
          </div>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pedidosRecientes.map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{pedido.id}</p>
                      <p className="text-sm text-gray-600">{pedido.cliente}</p>
                      <p className="text-xs text-gray-500">{pedido.fecha}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${pedido.total.toLocaleString()}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                        pedido.estado,
                      )}`}>
                      {getEstadoTexto(pedido.estado)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Package className="h-4 w-4 mr-2" />
                Nuevo Producto
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Users className="h-4 w-4 mr-2" />
                Nuevo Empleado
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ver Pedidos
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cocina</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Operativo</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivery</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Operativo</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pagos</span>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600">Lento</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Inventario</span>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Normal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
