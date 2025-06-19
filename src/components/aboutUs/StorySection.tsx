import { motion } from "framer-motion";
import { FavoriteOutlined, GroupOutlined, EmojiEventsOutlined, TrendingUpOutlined } from "@mui/icons-material";

export const StorySection = () => {
  const values = [
    {
      icon: FavoriteOutlined,
      title: "Pasión",
      description: "Cada plato es preparado con amor y dedicación",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: GroupOutlined,
      title: "Familia",
      description: "Creamos momentos especiales para compartir",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: EmojiEventsOutlined,
      title: "Calidad",
      description: "Solo los mejores ingredientes en nuestros platos",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: TrendingUpOutlined,
      title: "Innovación",
      description: "Constantemente mejorando nuestras recetas",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Story Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full">
          <FavoriteOutlined
            className="text-orange-500"
            sx={{ fontSize: 16 }}
          />
          <span className="text-sm font-medium text-orange-700">Nuestra Historia</span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Una historia de{" "}
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            sabor y tradición
          </span>
        </h2>

        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Desde 2010, ElBuenSabor ha sido más que un restaurante: es el hogar donde las familias se reúnen, los amigos
            celebran y los sabores cobran vida. Nuestra historia comenzó con una simple misión: crear experiencias
            culinarias que toquen el corazón.
          </p>
          <p>
            Con más de una década de experiencia, hemos perfeccionado cada receta, cuidado cada detalle y construido una
            comunidad de amantes de la buena comida que confían en nosotros para sus momentos más especiales.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <h3 className="text-2xl font-bold text-orange-600">50K+</h3>
            <p className="text-sm text-gray-600">Clientes Satisfechos</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <h3 className="text-2xl font-bold text-red-600">13+</h3>
            <p className="text-sm text-gray-600">Años de Experiencia</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Values Grid */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <motion.div
                className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}>
                <value.icon className="text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
