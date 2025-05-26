import { motion } from "framer-motion";
import {
  HelpOutlineOutlined,
  SearchOutlined,
  PhoneOutlined,
  EmailOutlined,
  ChatOutlined,
  AccessTimeOutlined,
  QuestionAnswerOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const contactMethods = [
    {
      icon: PhoneOutlined,
      title: "Teléfono",
      description: "Habla directamente con nuestro equipo",
      contact: "+1 (555) 123-4567",
      hours: "Lun-Dom: 9:00 AM - 11:00 PM",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: EmailOutlined,
      title: "Email",
      description: "Envíanos tu consulta por correo",
      contact: "ayuda@elbuensabor.com",
      hours: "Respuesta en 24 horas",
      color: "from-green-500 to-green-600",
    },
    {
      icon: ChatOutlined,
      title: "Chat en Vivo",
      description: "Chatea con nosotros en tiempo real",
      contact: "Disponible en la web",
      hours: "Lun-Vie: 9:00 AM - 6:00 PM",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const faqCategories = [
    {
      title: "Pedidos y Entrega",
      questions: [
        "¿Cuánto tiempo tarda la entrega?",
        "¿Puedo modificar mi pedido?",
        "¿Qué zonas cubren para delivery?",
        "¿Cómo rastreo mi pedido?",
      ],
    },
    {
      title: "Pagos y Facturación",
      questions: [
        "¿Qué métodos de pago aceptan?",
        "¿Puedo pagar en efectivo?",
        "¿Cómo solicito una factura?",
        "¿Hay cargos adicionales?",
      ],
    },
    {
      title: "Cuenta y Perfil",
      questions: [
        "¿Cómo creo una cuenta?",
        "¿Cómo cambio mi contraseña?",
        "¿Cómo actualizo mis datos?",
        "¿Puedo eliminar mi cuenta?",
      ],
    },
    {
      title: "Reservaciones",
      questions: [
        "¿Cómo hago una reservación?",
        "¿Puedo cancelar mi reserva?",
        "¿Hay costo por reservar?",
        "¿Qué pasa si llego tarde?",
      ],
    },
  ];

  const quickActions = [
    {
      icon: QuestionAnswerOutlined,
      title: "Preguntas Frecuentes",
      description: "Encuentra respuestas rápidas",
      link: "/faq",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: SupportAgentOutlined,
      title: "Contactar Soporte",
      description: "Habla con nuestro equipo",
      link: "/#contact",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: AccessTimeOutlined,
      title: "Estado del Pedido",
      description: "Rastrea tu orden",
      link: "/profile",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <PageHeader
        title="Centro de Ayuda"
        subtitle="Estamos aquí para ayudarte con cualquier duda o problema"
        showBackButton
        gradient="from-orange-600 via-red-600 to-yellow-600"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="¿En qué podemos ayudarte?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}>
              <Link
                to={action.link}
                className="block bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all group">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon
                    className="text-white"
                    sx={{ fontSize: 32 }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Formas de Contacto
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <method.icon
                    className="text-white"
                    sx={{ fontSize: 40 }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">{method.contact}</p>
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <AccessTimeOutlined
                      sx={{ fontSize: 16 }}
                      className="mr-1"
                    />
                    {method.hours}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Temas Populares
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <HelpOutlineOutlined className="mr-2 text-orange-500" />
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.questions.map((question, qIndex) => (
                    <li key={qIndex}>
                      <Link
                        to="/faq"
                        className="text-gray-600 hover:text-orange-600 transition-colors text-sm block py-1 hover:underline">
                        {question}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/faq"
                  className="inline-block mt-4 text-orange-600 font-medium text-sm hover:underline">
                  Ver todas las preguntas →
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda urgente?</h2>
            <p className="text-lg mb-6 opacity-90">
              Para problemas urgentes con tu pedido o reservación, contáctanos directamente
            </p>
            <a
              href="tel:+1555123456"
              className="inline-flex items-center space-x-2 bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              <PhoneOutlined />
              <span>Llamar Ahora: +1 (555) 123-4567</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
