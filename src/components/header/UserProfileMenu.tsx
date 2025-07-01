// src/components/header/UserProfileMenu.tsx
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PersonOutlined, KeyboardArrowDownOutlined, LogoutOutlined } from "@mui/icons-material";
import { useNavigation } from "../../hooks/useNavigation";
import { IUser } from "../../store/auth/types/user"; // Importa la interfaz de tu store

// Define una interfaz para los ítems de menú con el tipo de icono correcto
interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string; sx?: object }>;
}

interface UserProfileMenuProps {
  user: IUser | undefined; // Ahora el prop 'user' es de tipo IUser o undefined
  userMenuItems: MenuItem[]; // Usa la nueva interfaz MenuItem
  onLogout: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ user, userMenuItems, onLogout }) => {
  const { isUserMenuOpen, toggleUserMenu, userMenuRef } = useNavigation();

  return (
    <div
      className="relative"
      ref={userMenuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleUserMenu}
        className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white border border-orange-200 rounded-xl shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-300 group">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
          {user?.imagen || user?.picture ? (
            <img
              src={user.imagen || user.picture || "/placeholder.svg"}
              alt={user.name || "Usuario"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <PersonOutlined
              className="text-white"
              sx={{ fontSize: 16 }}
            />
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 max-w-20 truncate">
          {user?.name || user?.apellido ? `${user?.name ?? ""} ${user?.apellido ?? ""}`.trim() : "Usuario"}
        </span>
        <KeyboardArrowDownOutlined
          className={`text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
          sx={{ fontSize: 16 }}
        />
      </motion.button>

      {/* User Dropdown Menu */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 py-2 z-50">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  {user?.imagen || user?.picture ? (
                    <img
                      src={user.imagen || user.picture || "/placeholder.svg"}
                      alt={
                        user?.name || user?.apellido ? `${user?.name ?? ""} ${user?.apellido ?? ""}`.trim() : "Usuario"
                      }
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
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || user?.apellido ? `${user?.name ?? ""} ${user?.apellido ?? ""}`.trim() : "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {userMenuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}>
                  <Link
                    to={item.path}
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group">
                    <item.icon className="group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Logout Button */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: userMenuItems.length * 0.05 }}
                className="border-t border-orange-100 mt-1 pt-1 cursor-pointer">
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group">
                  <LogoutOutlined
                    className="group-hover:scale-110 transition-transform duration-200"
                    sx={{ fontSize: 18 }}
                  />
                  <span>Cerrar Sesión</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
