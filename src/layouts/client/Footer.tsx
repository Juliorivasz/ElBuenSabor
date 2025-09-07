import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LocationOn,
  Phone,
  Email,
  Schedule,
  Instagram,
  Facebook,
  Twitter,
  Favorite,
  Star,
  Restaurant,
  LocalShipping,
  Security,
  EmojiEvents,
} from "@mui/icons-material";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [{ name: "Nuestra Historia", path: "/about" }],
    services: [
      { name: "Catálogo", path: "/catalog" },
      { name: "Delivery", path: "/delivery" },
    ],
    support: [
      { name: "Centro de Ayuda", path: "/help" },
      { name: "Contacto", path: "/contact" },
      { name: "FAQ", path: "/faq" },
      { name: "Términos", path: "/terms" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", color: "from-pink-500 to-purple-500" },
    { icon: Facebook, href: "#", color: "from-blue-500 to-blue-600" },
    { icon: Twitter, href: "#", color: "from-blue-400 to-blue-500" },
  ];

  const features = [
    { icon: Restaurant, text: "Ingredientes Frescos" },
    { icon: LocalShipping, text: "Entrega Rápida" },
    { icon: Security, text: "Pago Seguro" },
    { icon: EmojiEvents, text: "Calidad Premium" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"
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

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full"
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

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-6">
              {/* Logo */}
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}>
                <Link
                  to="/"
                  className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                    className="relative">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
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
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      ElBuenSabor
                    </h3>
                    <p className="text-sm text-gray-400">Sabores que enamoran</p>
                  </div>
                </Link>
              </motion.div>

              <p className="text-gray-300 leading-relaxed">
                Más que un restaurante, somos el lugar donde los sabores cobran vida y las familias se reúnen para crear
                momentos inolvidables.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 text-sm text-gray-300">
                    <feature.icon
                      className="text-orange-400"
                      sx={{ fontSize: 16 }}
                    />
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Rating */}
              <motion.div
                className="flex items-center space-x-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                whileHover={{ scale: 1.02 }}>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: i * 0.1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}>
                      <Star
                        className="text-yellow-400"
                        sx={{ fontSize: 16 }}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 • 50K+ reseñas</span>
              </motion.div>
            </motion.div>

            {/* Links Sections */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}>
                  <h4 className="text-lg font-semibold mb-4 text-white capitalize">
                    {category === "company" ? "Empresa" : category === "services" ? "Servicios" : "Soporte"}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}>
                        <Link
                          to={link.path}
                          className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm flex items-center group">
                          <span className="group-hover:text-orange-400 transition-colors">{link.name}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 space-y-6">
              <h4 className="text-lg font-semibold text-white">Contacto</h4>

              <div className="space-y-4">
                <motion.div
                  className="flex items-start space-x-3 text-sm text-gray-300"
                  whileHover={{ x: 5 }}>
                  <LocationOn
                    className="text-orange-400 mt-0.5"
                    sx={{ fontSize: 16 }}
                  />
                  <div>
                    <p>Av. Principal 123</p>
                    <p>Ciudad, País 12345</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3 text-sm text-gray-300"
                  whileHover={{ x: 5 }}>
                  <Phone
                    className="text-orange-400"
                    sx={{ fontSize: 16 }}
                  />
                  <span>+1 (555) 123-4567</span>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3 text-sm text-gray-300"
                  whileHover={{ x: 5 }}>
                  <Email
                    className="text-orange-400"
                    sx={{ fontSize: 16 }}
                  />
                  <span>info@elbuensabor.com</span>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-3 text-sm text-gray-300"
                  whileHover={{ x: 5 }}>
                  <Schedule
                    className="text-orange-400 mt-0.5"
                    sx={{ fontSize: 16 }}
                  />
                  <div>
                    <p>Lun-Vie: 11:00-23:00</p>
                    <p>Sáb-Dom: 12:00-24:00</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div>
                <h5 className="text-sm font-medium text-white mb-3">Síguenos</h5>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}>
                      <social.icon
                        className="text-white"
                        sx={{ fontSize: 20 }}
                      />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <motion.p
                className="text-sm text-gray-400 flex items-center"
                whileHover={{ scale: 1.02 }}>
                © {currentYear} ElBuenSabor. Hecho con{" "}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                  className="mx-1">
                  <Favorite
                    className="text-red-500"
                    sx={{ fontSize: 16 }}
                  />
                </motion.span>{" "}
                para nuestros clientes.
              </motion.p>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <Link
                  to="/privacy"
                  className="hover:text-orange-400 transition-colors">
                  Privacidad
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-orange-400 transition-colors">
                  Términos
                </Link>
                <Link
                  to="/cookies"
                  className="hover:text-orange-400 transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
