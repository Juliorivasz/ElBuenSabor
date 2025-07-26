"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0Store } from "../../../store/auth/useAuth0Store";
import { useAuth0 } from "@auth0/auth0-react";
import { empleadoServicio, type EmpleadoType } from "../../../services/empleadoServicio";
import {
  Dashboard as DashboardIcon,
  PeopleAlt as PeopleIcon,
  Fastfood as ProductsIcon,
  Tapas as RubroIcon,
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
  AdminPanelSettings as AdminIcon,
  BarChart as ChartIcon,
  LocalOffer as PromoIcon,
  Inventory2 as InsumoIcon  
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
    name: "Categorías",
    path: "/admin/categorias",
    icon: CategoryIcon,
    allowedRoles: ["administrador"],
  },
  {
    name: "Rubros",
    path: "/admin/rubros",
    icon: RubroIcon,
    allowedRoles: ["administrador", "cocinero"],
  },
  {
    name: "Insumos",
    path: "/admin/insumos",
    icon: InsumoIcon,
    allowedRoles: ["administrador", "cocinero"],
  },
  {
    name: "Estadisticas",
    path: "/admin/estadisticas",
    icon: ChartIcon,
    allowedRoles: ["administrador"],
  },
  {
    name: "Promociones",
    path: "/admin/promociones",
    icon: PromoIcon,
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
  const [empleadoData, setEmpleadoData] = useState<EmpleadoType | null>(null);
  const [loadingEmpleado, setLoadingEmpleado] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const { user } = useAuth0Store();
  const { logout, isAuthenticated } = useAuth0();

  const userRoles = user?.roles || [];

  // Fetch employee data to get the database image
  useEffect(() => {
    const fetchEmpleadoData = async () => {
      if (!user?.id) {
        setLoadingEmpleado(false);
        return;
      }

      try {
        setLoadingEmpleado(true);
        if (!isAuthenticated) {
          console.warn("Token not ready, skipping employee data fetch");
          return;
        }

        const empleados = await empleadoServicio.obtenerEmpleados();
        const empleadoActual = empleados.find((emp) => emp.getAuth0Id() === user.id);

        if (empleadoActual) {
          setEmpleadoData(empleadoActual);
        }
      } catch (error) {
        console.error("Error al obtener datos del empleado:", error);
      } finally {
        setLoadingEmpleado(false);
      }
    };

    fetchEmpleadoData();
  }, [user?.id]);

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
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-00">
        <MenuIcon fontSize="small" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isCollapsed ? "w-16" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          backdrop-blur-xl border-r border-slate-700/50
          transition-all duration-300 ease-in-out
          flex flex-col
          shadow-2xl
        `}>
        {/* Header */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } p-4 border-b border-slate-700/50`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <AdminIcon
                  fontSize="small"
                  className="text-white"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-slate-400">Sistema de Gestión</p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <AdminIcon
                fontSize="small"
                className="text-white"
              />
            </div>
          )}

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
            <CloseIcon fontSize="small" />
          </button>

          {/* Collapse button for desktop */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
              <ChevronLeftIcon fontSize="small" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isCollapsed && (
          <div className="flex justify-center p-2 border-b border-slate-700/50">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
              <ChevronRightIcon fontSize="small" />
            </button>
          </div>
        )}

        {/* User Info */}
        <div className={`p-4 border-b border-slate-700/50 ${isCollapsed ? "flex justify-center" : ""}`}>
          {isCollapsed ? (
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                  {!loadingEmpleado && (empleadoData?.getImagen() || user?.picture) ? (
                    <img
                      src={empleadoData?.getImagen() || user?.picture || "/placeholder.svg"}
                      alt={user?.name || "Usuario"}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        if (
                          empleadoData?.getImagen() &&
                          e.currentTarget.src === empleadoData.getImagen() &&
                          user?.picture
                        ) {
                          e.currentTarget.src = user.picture;
                        } else {
                          e.currentTarget.style.display = "none";
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.classList.remove("hidden");
                          }
                        }
                      }}
                    />
                  ) : (
                    <UserIcon
                      fontSize="small"
                      className={`text-slate-400 ${loadingEmpleado ? "animate-pulse" : ""}`}
                    />
                  )}
                </div>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                {empleadoData ? `${empleadoData.getNombre()} ${empleadoData.getApellido()}` : user?.name || "Usuario"}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                    {!loadingEmpleado && (empleadoData?.getImagen() || user?.picture) ? (
                      <img
                        src={empleadoData?.getImagen() || user?.picture || "/placeholder.svg"}
                        alt={user?.name || "Usuario"}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          if (
                            empleadoData?.getImagen() &&
                            e.currentTarget.src === empleadoData.getImagen() &&
                            user?.picture
                          ) {
                            e.currentTarget.src = user.picture;
                          } else {
                            e.currentTarget.style.display = "none";
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.classList.remove("hidden");
                            }
                          }
                        }}
                      />
                    ) : (
                      <UserIcon
                        fontSize="medium"
                        className={`text-slate-400 ${loadingEmpleado ? "animate-pulse" : ""}`}
                      />
                    )}
                  </div>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {empleadoData ? `${empleadoData.getNombre()} ${empleadoData.getApellido()}` : user?.name || "Usuario"}
                </p>
                <p className="text-xs text-slate-400 truncate capitalize">{userRoles.join(", ") || "Sin rol"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <div
                key={item.path}
                className="relative">
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    group flex items-center transition-all duration-200 rounded-xl
                    ${isCollapsed ? "justify-center p-3 w-10 h-10 mx-auto" : "space-x-3 px-4 py-3"}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }
                  `}>
                  <Icon
                    size={20}
                    className={`flex-shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {!isCollapsed && <span className="font-medium text-sm tracking-wide">{item.name}</span>}

                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.path && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-700/50">
          <div className="relative">
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHoveredItem("logout")}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group w-full flex items-center transition-all duration-200 text-red-400 hover:text-red-300 
                hover:bg-red-500/10 rounded-xl
                ${isCollapsed ? "justify-center p-3 h-10" : "space-x-3 px-4 py-3"}
              `}>
              <LogoutIcon
                fontSize="small"
                className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              />
              {!isCollapsed && <span className="font-medium text-sm">Cerrar Sesión</span>}
            </button>

            {/* Tooltip for logout when collapsed */}
            {isCollapsed && hoveredItem === "logout" && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50 shadow-lg">
                Cerrar Sesión
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500">© 2024 Admin Panel</p>
          </div>
        )}
      </div>
    </>
  );
};
