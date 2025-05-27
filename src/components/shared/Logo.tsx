import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  linkTo?: string;
}

export const Logo = ({ size = "md", showText = true, className = "", linkTo }: LogoProps) => {
  const { isAuthenticated } = useAuth0();

  const sizes = {
    sm: { logo: "w-8 h-8", text: "text-lg", subtitle: "text-xs" },
    md: { logo: "w-10 h-10 sm:w-12 sm:h-12", text: "text-xl sm:text-2xl", subtitle: "text-xs" },
    lg: { logo: "w-16 h-16", text: "text-3xl", subtitle: "text-sm" },
  };

  // Determinar la ruta según el estado de autenticación
  const logoLink = linkTo || (isAuthenticated ? "/catalog" : "/");
  console.log(isAuthenticated, logoLink);

  const LogoContent = () => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 group ${className}`}>
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
        className="relative">
        <div className={`${sizes[size].logo} bg-white rounded-full flex items-center justify-center overflow-hidden`}>
          <img
            src="/logo-t.png"
            alt="ElBuenSabor"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
      {showText && (
        <div className="hidden sm:block">
          <motion.h1
            className={`${sizes[size].text} font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent`}
            whileHover={{ scale: 1.05 }}>
            ElBuenSabor
          </motion.h1>
          <motion.p
            className={`${sizes[size].subtitle} text-gray-600 -mt-1`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            Sabores que enamoran
          </motion.p>
        </div>
      )}
    </motion.div>
  );

  return (
    <Link
      to={logoLink}
      className="block">
      <LogoContent />
    </Link>
  );
};
