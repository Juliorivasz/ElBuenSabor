//
import { motion } from "framer-motion";
import { LoginOutlined, PersonAddOutlined } from "@mui/icons-material";

interface AuthButtonsProps {
  onLogin: () => void;
  onRegister: () => void;
  isMobile?: boolean;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ onLogin, onRegister, isMobile = false }) => {
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3">
        <button
          onClick={onLogin}
          className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
          <LoginOutlined sx={{ fontSize: 20 }} />
          <span>Iniciar Sesión</span>
        </button>
        <button
          onClick={onRegister}
          className="w-full px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-all duration-300 flex items-center justify-center space-x-2">
          <PersonAddOutlined sx={{ fontSize: 20 }} />
          <span>Registrarse</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="hidden sm:flex items-center space-x-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        <button
          onClick={onLogin}
          className="flex items-center space-x-2 px-4 py-2.5 cursor-pointer text-gray-700 border border-orange-200 rounded-xl font-medium hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all duration-300 group">
          <LoginOutlined
            className="group-hover:scale-110 transition-transform duration-200"
            sx={{ fontSize: 16 }}
          />
          <span>Iniciar Sesión</span>
        </button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        <button
          onClick={onRegister}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r cursor-pointer from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 group">
          <PersonAddOutlined
            className="group-hover:scale-110 transition-transform duration-200"
            sx={{ fontSize: 16 }}
          />
          <span>Registrarse</span>
        </button>
      </motion.div>
    </div>
  );
};
