"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PersonOutlined,
  LogoutOutlined,
  HomeOutlined,
  RestaurantMenuOutlined,
  InfoOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  AccountCircleOutlined,
  LocationOnOutlined,
  HistoryOutlined,
} from "@mui/icons-material";

interface MobileMenuProps {
  isMenuOpen: boolean;
  isAuthenticated: boolean;
  user: any;
  cartItemsCount: number;
  location: any;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  isAuthenticated,
  user,
  cartItemsCount,
  location,
  onClose,
  onLogin,
  onRegister,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Navigation items
  const navItems = isAuthenticated
    ? [{ name: "Inicio", path: "/catalog", icon: HomeOutlined }]
    : [
        { name: "Inicio", path: "/", icon: HomeOutlined },
        { name: "Catálogo", path: "/catalog", icon: RestaurantMenuOutlined },
        { name: "Sobre Nosotros", path: "/about", icon: InfoOutlined },
        { name: "Contacto", path: "/contact", icon: PhoneOutlined },
      ];

  const userMenuItems = [
    { name: "Mi Perfil", path: "/profile", icon: AccountCircleOutlined },
    { name: "Mis Direcciones", path: "/address", icon: LocationOnOutlined },
    { name: "Historial de Pedidos", path: "/orders", icon: HistoryOutlined },
  ];

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-orange-100">
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => handleNavigation(isAuthenticated ? "/catalog" : "/")}>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/logo-elBuenSabor.jpg"
                      alt="ElBuenSabor"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      ElBuenSabor
                    </h2>
                    <p className="text-xs text-gray-600">Sabores que enamoran</p>
                  </div>
                </div>
              </div>

              {/* User Section */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      {user?.picture ? (
                        <img
                          src={user.picture || "/placeholder.svg"}
                          alt={user.name || "Usuario"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <PersonOutlined
                          className="text-white"
                          sx={{ fontSize: 20 }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Usuario"}</p>
                      <p className="text-xs text-gray-600 truncate">{user?.email || "usuario@email.com"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors duration-200">
                    Ver Perfil
                  </button>
                </motion.div>
              ) : (
                <div className="mb-6 space-y-3">
                  <button
                    onClick={() => {
                      onClose();
                      onLogin();
                    }}
                    className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors duration-200">
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onRegister();
                    }}
                    className="w-full px-4 py-3 border border-orange-500 text-orange-500 rounded-xl font-medium hover:bg-orange-50 transition-colors duration-200">
                    Registrarse
                  </button>
                </div>
              )}

              {/* Cart Button */}
              <div className="mb-6">
                <button
                  onClick={() => handleNavigation("/cart")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <ShoppingCartOutlined className="text-orange-600" />
                    <span className="font-medium text-gray-900">Mi Carrito</span>
                  </div>
                  {cartItemsCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Navigation Items */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Navegación</h3>
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200 ${
                          isActive
                            ? "bg-orange-100 text-orange-600 border border-orange-200"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}>
                        <Icon sx={{ fontSize: 20 }} />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Menu Items */}
              {isAuthenticated && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Mi Cuenta</h3>
                  <div className="space-y-2">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200 ${
                            isActive
                              ? "bg-orange-100 text-orange-600 border border-orange-200"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}>
                          <Icon sx={{ fontSize: 20 }} />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Logout Button */}
              {isAuthenticated && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full p-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <LogoutOutlined sx={{ fontSize: 20 }} />
                  <span>Cerrar Sesión</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
