import { motion } from "framer-motion";
import {
  PrivacyTipOutlined,
  SecurityOutlined,
  DataUsageOutlined,
  ContactSupportOutlined,
  ShieldOutlined,
  CookieOutlined,
} from "@mui/icons-material";
import { PageHeader } from "../../../components/shared/PageHeader";

export const Privacy = () => {
  const sections = [
    {
      icon: DataUsageOutlined,
      title: "Información que Recopilamos",
      content: `Recopilamos diferentes tipos de información para brindarle un mejor servicio:

Información Personal:
• Nombre completo y datos de contacto
• Dirección de entrega y facturación
• Información de pago (procesada de forma segura)
• Preferencias alimentarias y alergias

Información de Uso:
• Páginas visitadas y tiempo de navegación
• Dispositivo y navegador utilizado
• Dirección IP y ubicación aproximada
• Historial de pedidos y preferencias`,
    },
    {
      icon: SecurityOutlined,
      title: "Cómo Usamos su Información",
      content: `Utilizamos su información personal para:

Servicios Principales:
• Procesar y entregar sus pedidos
• Gestionar reservaciones y citas
• Comunicarnos sobre el estado de sus pedidos
• Proporcionar atención al cliente

Mejoras del Servicio:
• Personalizar su experiencia
• Analizar tendencias y preferencias
• Desarrollar nuevos productos y servicios
• Enviar ofertas y promociones (con su consentimiento)`,
    },
    {
      icon: ShieldOutlined,
      title: "Protección de Datos",
      content: `Implementamos múltiples medidas de seguridad:

Seguridad Técnica:
• Encriptación SSL/TLS para todas las transmisiones
• Servidores seguros con acceso restringido
• Monitoreo continuo de amenazas
• Copias de seguridad regulares

Seguridad Organizacional:
• Acceso limitado solo al personal autorizado
• Capacitación regular en privacidad
• Políticas estrictas de manejo de datos
• Auditorías de seguridad periódicas`,
    },
    {
      icon: CookieOutlined,
      title: "Cookies y Tecnologías Similares",
      content: `Utilizamos cookies para mejorar su experiencia:

Tipos de Cookies:
• Esenciales: Necesarias para el funcionamiento del sitio
• Funcionales: Recuerdan sus preferencias
• Analíticas: Nos ayudan a entender cómo usa el sitio
• Publicitarias: Personalizan los anuncios que ve

Puede gestionar las cookies desde la configuración de su navegador o nuestro centro de preferencias.`,
    },
  ];

  const rights = [
    "Acceder a sus datos personales",
    "Rectificar información incorrecta",
    "Eliminar sus datos (derecho al olvido)",
    "Limitar el procesamiento de sus datos",
    "Portabilidad de datos",
    "Oponerse al procesamiento",
    "Retirar el consentimiento en cualquier momento",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <PageHeader
        title="Política de Privacidad"
        subtitle="Conoce cómo protegemos y utilizamos tu información personal"
        showBackButton
        gradient="from-orange-600 via-red-600 to-yellow-600"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex items-center space-x-3">
            <PrivacyTipOutlined className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Última actualización</h3>
              <p className="text-sm text-gray-600">1 de enero de 2025</p>
            </div>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <PrivacyTipOutlined
              className="text-orange-500"
              sx={{ fontSize: 32 }}
            />
            <h2 className="text-2xl font-bold text-gray-800">Nuestro Compromiso</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            En ElBuenSabor, valoramos y respetamos su privacidad. Esta política explica cómo recopilamos, utilizamos,
            protegemos y compartimos su información personal cuando utiliza nuestros servicios. Nos comprometemos a ser
            transparentes sobre nuestras prácticas de datos y a darle control sobre su información personal.
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <section.icon
                    className="text-white"
                    sx={{ fontSize: 24 }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</div>
            </motion.div>
          ))}
        </div>

        {/* Your Rights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <SecurityOutlined className="mr-3 text-orange-500" />
            Sus Derechos de Privacidad
          </h3>
          <p className="text-gray-600 mb-6">Usted tiene los siguientes derechos respecto a sus datos personales:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rights.map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-gray-700">{right}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
            <ContactSupportOutlined
              sx={{ fontSize: 48 }}
              className="mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">¿Preguntas sobre Privacidad?</h2>
            <p className="text-lg mb-6 opacity-90">
              Nuestro oficial de protección de datos está disponible para resolver sus dudas
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:privacidad@elbuensabor.com"
                className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                <span>Contactar DPO</span>
              </a>
              <a
                href="/help"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                <span>Centro de Ayuda</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
