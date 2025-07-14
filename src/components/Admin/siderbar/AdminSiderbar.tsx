"use client";

import type React from "react";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0Store } from "../../../store/auth/useAuth0Store";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Dashboard as DashboardIcon,
  PeopleAlt as PeopleIcon,
  Fastfood as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Category as CategoryIcon,
  RestaurantMenu as KitchenIcon,
  TwoWheeler as DeliveryIcon,
  Assignment as CashierIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  AccountCircle as UserIcon,
} from "@mui/icons-material";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  allowedRoles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: DashboardIcon,
    allowedRoles: ["administrador"],
  },
  {
    name: "Empleados",
    path: "/admin/empleados",
    icon: PeopleIcon,
    allowedRoles: ["administrador"],
  },
  {
    name: "Productos",
    path: "/admin/articulo",
    icon: ProductsIcon,
    allowedRoles: ["administrador"],
  },
  {
    name: "Pedidos",
    path: "/admin/pedidos",
    icon: OrdersIcon,
    allowedRoles: ["administrador"],
  },
  {
    name: "Categorías",
    path: "/admin/categorias",
    icon: CategoryIcon,
    allowedRoles: ["administrador"],
  },
  {
    name: "Cocina",
    path: "/admin/cocina",
    icon: KitchenIcon,
    allowedRoles: ["administrador", "cocinero"],
  },
  {
    name: "Delivery",
    path: "/admin/repartidor",
    icon: DeliveryIcon,
    allowedRoles: ["administrador", "repartidor"],
  },
  {
    name: "Caja",
    path: "/empleado/caja",
    icon: CashierIcon,
    allowedRoles: ["administrador", "cajero"],
  },
];

export const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth0Store();
  const { logout } = useAuth0();

  const userRoles = user?.roles || [];

  // Filtrar items según los roles del usuario
  const filteredItems = sidebarItems.filter((item) =>
    item.allowedRoles.some((role) => userRoles.some((userRole) => userRole.toLowerCase() === role.toLowerCase())),
  );

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg">
        <MenuIcon fontSize="small" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white shadow-xl border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
        `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MenuIcon fontSize="small" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
          )}

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
            <CloseIcon fontSize="small" />
          </button>

          {/* Collapse button for desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 text-gray-500 hover:text-gray-700">
            {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {user?.picture ? (
                <img
                  src={user.picture || "/placeholder.svg"}
                  alt={user.name || "Usuario"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserIcon
                  fontSize="small"
                  className="text-gray-600"
                />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Usuario"}</p>
                <p className="text-xs text-gray-500 truncate">{userRoles.join(", ") || "Sin rol"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-initial p-4 space-y-2">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}>
                <Icon
                  size={20}
                  className="flex-shrink-0"
                />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200
              ${isCollapsed ? "justify-center" : ""}
            `}>
            <LogoutIcon
              fontSize="small"
              className="flex-shrink-0"
            />
            {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </>
  );
};
