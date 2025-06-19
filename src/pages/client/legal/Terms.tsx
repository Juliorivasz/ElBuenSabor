import { motion } from "framer-motion";
import { GavelOutlined, InfoOutlined, ContactSupportOutlined } from "@mui/icons-material";
import { PageHeader } from "../../../components/shared/PageHeader";

export const Terms = () => {
  const sections = [
    {
      title: "1. Aceptación de Términos",
      content: `Al acceder y utilizar los servicios de ElBuenSabor, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.

Estos términos se aplican a todos los usuarios del sitio web, aplicación móvil, servicios de delivery, reservaciones y cualquier otro servicio ofrecido por ElBuenSabor.`,
    },
    {
      title: "2. Servicios Ofrecidos",
      content: `ElBuenSabor ofrece servicios de restaurante que incluyen:
• Servicio de comida en el local
• Delivery a domicilio
• Reservaciones de mesa
• Catering para eventos
• Pedidos en línea a través de nuestra plataforma

Nos reservamos el derecho de modificar, suspender o discontinuar cualquier servicio en cualquier momento sin previo aviso.`,
    },
    {
      title: "3. Registro de Cuenta",
      content: `Para utilizar ciertos servicios, debe crear una cuenta proporcionando información precisa y actualizada. Usted es responsable de:
• Mantener la confidencialidad de su contraseña
• Todas las actividades que ocurran bajo su cuenta
• Notificar inmediatamente cualquier uso no autorizado

Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos.`,
    },
    {
      title: "4. Pedidos y Pagos",
      content: `Al realizar un pedido, usted confirma que:
• Toda la información proporcionada es precisa
• Está autorizado a usar el método de pago seleccionado
• Acepta pagar el precio total mostrado

Los precios pueden cambiar sin previo aviso. Los pedidos están sujetos a disponibilidad y confirmación.`,
    },
    {
      title: "5. Política de Cancelación",
      content: `Pedidos de Delivery:
• Pueden cancelarse hasta 5 minutos después de la confirmación
• Después de este tiempo, la cancelación está sujeta a nuestro criterio

Reservaciones:
• Pueden cancelarse hasta 2 horas antes sin costo
• Cancelaciones tardías pueden incurrir en cargos`,
    },
    {
      title: "6. Responsabilidades del Usuario",
      content: `Los usuarios se comprometen a:
• Usar los servicios de manera legal y apropiada
• No interferir con el funcionamiento del sitio web
• Proporcionar información precisa
• Respetar los derechos de propiedad intelectual
• No realizar actividades fraudulentas o maliciosas`,
    },
    {
      title: "7. Limitación de Responsabilidad",
      content: `ElBuenSabor no será responsable por:
• Daños indirectos, incidentales o consecuenciales
• Pérdida de datos o interrupciones del servicio
• Problemas causados por terceros
• Alergias alimentarias no reportadas adecuadamente

Nuestra responsabilidad máxima se limita al valor del pedido en cuestión.`,
    },
    {
      title: "8. Propiedad Intelectual",
      content: `Todo el contenido del sitio web, incluyendo textos, imágenes, logos, y software, es propiedad de ElBuenSabor y está protegido por leyes de derechos de autor.

Los usuarios no pueden reproducir, distribuir o crear trabajos derivados sin autorización expresa.`,
    },
    {
      title: "9. Modificaciones",
      content: `Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.

Es responsabilidad del usuario revisar periódicamente estos términos para estar al tanto de cualquier cambio.`,
    },
    {
      title: "10. Contacto",
      content: `Para preguntas sobre estos términos y condiciones, puede contactarnos:
• Email: legal@elbuensabor.com
• Teléfono: +1 (555) 123-4567
• Dirección: Av. Principal 123, Ciudad, País`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <PageHeader
        title="Términos y Condiciones"
        subtitle="Conoce los términos que rigen el uso de nuestros servicios"
        showBackButton
        gradient="from-orange-600 via-red-600 to-yellow-600"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-8 border border-orange-200">
          <div className="flex items-center space-x-3">
            <InfoOutlined className="text-orange-600" />
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
            <GavelOutlined
              className="text-orange-500"
              sx={{ fontSize: 32 }}
            />
            <h2 className="text-2xl font-bold text-gray-800">Introducción</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Bienvenido a ElBuenSabor. Estos términos y condiciones describen las reglas y regulaciones para el uso de
            nuestro sitio web, aplicación móvil y servicios. Al acceder a este sitio web y utilizar nuestros servicios,
            asumimos que acepta estos términos y condiciones en su totalidad.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{section.title}</h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
            <ContactSupportOutlined
              sx={{ fontSize: 48 }}
              className="mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas legales?</h2>
            <p className="text-lg mb-6 opacity-90">
              Nuestro equipo legal está disponible para aclarar cualquier duda sobre estos términos
            </p>
            <a
              href="mailto:legal@elbuensabor.com"
              className="inline-flex items-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              <span>Contactar Equipo Legal</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
