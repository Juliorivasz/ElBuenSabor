import { motion } from "framer-motion";
import {
  RestaurantOutlined,
  LocalDrinkOutlined,
  CakeOutlined,
  LocalPizzaOutlined,
  IcecreamOutlined,
  FastfoodOutlined,
} from "@mui/icons-material";

export const FloatingElements = () => {
  const foodIcons = [
    { icon: RestaurantOutlined, color: "from-orange-400 to-red-500", delay: 0 },
    { icon: LocalDrinkOutlined, color: "from-blue-400 to-cyan-500", delay: 0.5 },
    { icon: CakeOutlined, color: "from-pink-400 to-purple-500", delay: 1 },
    { icon: LocalPizzaOutlined, color: "from-yellow-400 to-orange-500", delay: 1.5 },
    { icon: IcecreamOutlined, color: "from-green-400 to-emerald-500", delay: 2 },
    { icon: FastfoodOutlined, color: "from-red-400 to-pink-500", delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {foodIcons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center shadow-lg`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            delay: item.delay,
            ease: "easeInOut",
          }}
          style={{
            left: `${10 + ((index * 15) % 80)}%`,
            top: `${20 + ((index * 20) % 60)}%`,
          }}>
          <item.icon
            className="text-white"
            sx={{ fontSize: 24 }}
          />
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-orange-300 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};
