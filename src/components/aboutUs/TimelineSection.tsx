import { motion } from "framer-motion";
import {
  RestaurantOutlined,
  GroupOutlined,
  EmojiEventsOutlined,
  TrendingUpOutlined,
  StarOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";

export const TimelineSection = () => {
  const timelineEvents = [
    {
      year: "2010",
      title: "El Comienzo",
      description: "Abrimos nuestras puertas con una pequeña cocina y grandes sueños",
      icon: RestaurantOutlined,
      color: "from-blue-500 to-cyan-500",
    },
    {
      year: "2015",
      title: "Expansión",
      description: "Duplicamos nuestro espacio y agregamos nuevos platos al menú",
      icon: TrendingUpOutlined,
      color: "from-green-500 to-emerald-500",
    },
    {
      year: "2018",
      title: "Reconocimiento",
      description: "Ganamos el premio 'Mejor Restaurante Local' por tercer año consecutivo",
      icon: EmojiEventsOutlined,
      color: "from-yellow-500 to-orange-500",
    },
    {
      year: "2020",
      title: "Delivery",
      description: "Lanzamos nuestro servicio de entrega a domicilio durante la pandemia",
      icon: LocalShippingOutlined,
      color: "from-purple-500 to-pink-500",
    },
    {
      year: "2022",
      title: "50K Clientes",
      description: "Celebramos haber servido a más de 50,000 clientes satisfechos",
      icon: GroupOutlined,
      color: "from-red-500 to-pink-500",
    },
    {
      year: "2024",
      title: "Excelencia",
      description: "Mantenemos nuestra calificación de 4.9 estrellas y seguimos creciendo",
      icon: StarOutlined,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Nuestro{" "}
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Crecimiento</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Un viaje de más de una década construyendo momentos especiales y sabores inolvidables
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-red-500" />

        <div className="space-y-8 sm:space-y-12">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
              {/* Timeline Dot */}
              <motion.div
                className={`absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 w-8 h-8 bg-gradient-to-r ${event.color} rounded-full flex items-center justify-center shadow-lg z-10`}
                whileHover={{ scale: 1.2 }}
                animate={{
                  boxShadow: ["0 0 0 0 rgba(249, 115, 22, 0.4)", "0 0 0 10px rgba(249, 115, 22, 0)"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.3,
                }}>
                <event.icon
                  className="text-white"
                  sx={{ fontSize: 16 }}
                />
              </motion.div>

              {/* Content */}
              <div
                className={`ml-16 sm:ml-0 sm:w-5/12 ${index % 2 === 0 ? "sm:mr-auto sm:pr-8" : "sm:ml-auto sm:pl-8"}`}>
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}>
                  <div className="flex items-center space-x-3 mb-3">
                    <motion.div
                      className={`w-10 h-10 bg-gradient-to-r ${event.color} rounded-lg flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}>
                      <event.icon
                        className="text-white"
                        sx={{ fontSize: 20 }}
                      />
                    </motion.div>
                    <span className="text-2xl font-bold text-gray-800">{event.year}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
