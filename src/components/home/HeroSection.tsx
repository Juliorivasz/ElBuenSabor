import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlayArrowOutlined,
  StarOutlined,
  GroupOutlined,
  AccessTimeOutlined,
  EmojiEventsOutlined,
} from "@mui/icons-material";

export const HeroSection = () => {
  const stats = [
    { icon: GroupOutlined, value: "50K+", label: "Clientes Felices", color: "from-blue-500 to-cyan-500" },
    { icon: StarOutlined, value: "4.9", label: "Calificación", color: "from-yellow-500 to-orange-500" },
    { icon: AccessTimeOutlined, value: "15min", label: "Entrega Promedio", color: "from-green-500 to-emerald-500" },
    { icon: EmojiEventsOutlined, value: "100+", label: "Platos Únicos", color: "from-purple-500 to-pink-500" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden sm:px-6 lg:px-8">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-3xl sm:w-60 sm:h-60 sm:-top-30 sm:-right-30 lg:w-80 lg:h-80 lg:-top-40 lg:-right-40"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl sm:w-60 sm:h-60 sm:-bottom-30 sm:-left-30 lg:w-80 lg:h-80 lg:-bottom-40 lg:-left-40"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Main Title - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl sm:mb-6">
            <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
              Sabores que
            </span>
            <motion.span
              className="block bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}>
              Enamoran
            </motion.span>
          </h1>

          <motion.p
            className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed sm:text-lg md:text-xl lg:max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            Descubre una experiencia culinaria única donde cada plato cuenta una historia y cada bocado despierta
            emociones. Bienvenido a ElBuenSabor.
          </motion.p>
        </motion.div>

        {/* CTA Button - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 sm:mb-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <Link
              to="/catalog"
              className="group relative inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 overflow-hidden text-sm sm:px-8 sm:py-4 sm:text-base">
              <span className="relative z-10">Explorar Menú</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                <PlayArrowOutlined className="text-lg sm:text-xl" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats - Mobile First Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 sm:rounded-2xl sm:p-4 lg:p-6">
                <motion.div
                  className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform sm:w-10 sm:h-10 sm:mb-3 lg:w-12 lg:h-12 xl:w-16 xl:h-16 lg:mb-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}>
                  <stat.icon className="text-white text-sm sm:text-base lg:text-lg xl:text-2xl" />
                </motion.div>
                <motion.h3
                  className="text-lg font-bold text-gray-800 mb-1 sm:text-xl lg:text-2xl xl:text-3xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}>
                  {stat.value}
                </motion.h3>
                <p className="text-xs text-gray-600 font-medium sm:text-sm lg:text-base">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on mobile, visible on larger screens */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
        <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-orange-400 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </section>
  );
};
