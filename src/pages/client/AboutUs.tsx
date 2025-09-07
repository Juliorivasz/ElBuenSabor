//
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FavoriteOutlined,
  GroupOutlined,
  NatureOutlined,
  StarOutlined,
  ArrowForwardOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { StorySection } from "../../components/aboutUs/StorySection";
import { TimelineSection } from "../../components/aboutUs/TimelineSection";
import { Link } from "react-router-dom";

export const AboutUs: React.FC = () => {
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    {
      icon: FavoriteOutlined,
      title: "Pasión",
      description: "Cada plato es preparado con amor y dedicación absoluta",
      color: "from-red-500 to-pink-500",
      stats: "100% Amor",
    },
    {
      icon: NatureOutlined,
      title: "Sostenibilidad",
      description: "Ingredientes locales y prácticas eco-amigables",
      color: "from-green-500 to-emerald-500",
      stats: "0% Desperdicio",
    },
    {
      icon: StarOutlined,
      title: "Excelencia",
      description: "Calidad premium en cada detalle de la experiencia",
      color: "from-yellow-500 to-orange-500",
      stats: "5 Estrellas",
    },
    {
      icon: GroupOutlined,
      title: "Comunidad",
      description: "Construimos relaciones duraderas con nuestros clientes",
      color: "from-blue-500 to-cyan-500",
      stats: "50K+ Familias",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-6">
            <InfoOutlined
              className="text-orange-500"
              sx={{ fontSize: 16 }}
            />
            <span className="text-sm font-medium text-orange-700">Sobre Nosotros</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Conoce{" "}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ElBuenSabor
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Más que un restaurante, somos una familia que ha dedicado más de una década a crear experiencias culinarias
            inolvidables.
          </p>
        </motion.div>

        {/* Story Section */}
        <StorySection />

        {/* Timeline */}
        <TimelineSection />

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-24">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-800">Nuestros Valores</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                onHoverStart={() => setActiveValue(index)}
                className="group cursor-pointer">
                <div
                  className={`relative p-6 bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                    activeValue === index ? "border-orange-300 shadow-2xl" : "border-gray-100"
                  }`}>
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
                    animate={activeValue === index ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.6 }}>
                    <value.icon
                      className="text-white"
                      sx={{ fontSize: 32 }}
                    />
                  </motion.div>

                  <h4 className="text-xl font-bold text-gray-800 mb-2 text-center">{value.title}</h4>
                  <p className="text-gray-600 text-center mb-4 text-sm">{value.description}</p>

                  <motion.div
                    className={`text-center p-2 bg-gradient-to-r ${value.color} bg-opacity-10 rounded-lg`}
                    animate={activeValue === index ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.5 }}>
                    <span className="text-sm font-bold text-gray-700">{value.stats}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.3%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FavoriteOutlined
                className="text-white"
                sx={{ fontSize: 32 }}
              />
            </motion.div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-4">¿Listo para ser parte de nuestra familia?</h3>
            <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Únete a miles de personas que ya disfrutan de nuestros sabores únicos. Tu próxima experiencia culinaria
              favorita te está esperando.
            </p>

            <Link to={"/catalog"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=" cursor-pointer group inline-flex items-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                <span>Explorar Menú</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowForwardOutlined sx={{ fontSize: 20 }} />
                </motion.div>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
