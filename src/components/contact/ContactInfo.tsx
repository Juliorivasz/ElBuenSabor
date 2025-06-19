import { motion } from "framer-motion";
import { LocationOnOutlined, PhoneOutlined, EmailOutlined, AccessTimeOutlined } from "@mui/icons-material";

export const ContactInfo = () => {
  const contactInfo = [
    {
      icon: LocationOnOutlined,
      title: "Ubicación",
      details: ["Av. Principal 123", "Ciudad, País 12345"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: PhoneOutlined,
      title: "Teléfono",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: EmailOutlined,
      title: "Email",
      details: ["info@elbuensabor.com", "pedidos@elbuensabor.com"],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: AccessTimeOutlined,
      title: "Horarios",
      details: ["Lun-Vie: 11:00-23:00", "Sáb-Dom: 12:00-24:00"],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="order-1 lg:order-2 space-y-6">
      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}>
                  <info.icon className="text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/20">
        <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="text-center">
            <LocationOnOutlined
              className="text-orange-500 mx-auto mb-2"
              sx={{ fontSize: 48 }}
            />
            <p className="text-gray-600 font-medium">Mapa Interactivo</p>
            <p className="text-sm text-gray-500">Próximamente</p>
          </motion.div>

          {/* Animated dots */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              animate={{
                x: [0, 20, 0],
                y: [0, -15, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
