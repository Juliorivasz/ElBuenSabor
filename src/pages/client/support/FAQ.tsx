import { motion } from "framer-motion";
import { useState } from "react";
import {
  ExpandMoreOutlined,
  SearchOutlined,
  QuestionAnswerOutlined,
  LocalShippingOutlined,
  PaymentOutlined,
  PersonOutlined,
  EventOutlined,
  RestaurantMenuOutlined,
} from "@mui/icons-material";
import { PageHeader } from "../../../components/shared/PageHeader";

export const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const categories = [
    { id: "all", name: "Todas", icon: QuestionAnswerOutlined },
    { id: "delivery", name: "Entrega", icon: LocalShippingOutlined },
    { id: "payment", name: "Pagos", icon: PaymentOutlined },
    { id: "account", name: "Cuenta", icon: PersonOutlined },
    { id: "reservations", name: "Reservas", icon: EventOutlined },
    { id: "menu", name: "Menú", icon: RestaurantMenuOutlined },
  ];

  const faqs = [
    {
      category: "delivery",
      question: "¿Cuánto tiempo tarda la entrega?",
      answer:
        "Nuestro tiempo promedio de entrega es de 15-30 minutos, dependiendo de tu ubicación y la demanda del momento. Durante horas pico (12:00-14:00 y 19:00-21:00) puede extenderse hasta 45 minutos.",
    },
    {
      category: "delivery",
      question: "¿Qué zonas cubren para delivery?",
      answer:
        "Cubrimos toda la ciudad y zonas metropolitanas. Puedes verificar si llegamos a tu dirección ingresándola en nuestro sistema de pedidos. El costo de envío varía según la distancia.",
    },
    {
      category: "delivery",
      question: "¿Puedo rastrear mi pedido?",
      answer:
        "Sí, una vez confirmado tu pedido recibirás un enlace de seguimiento por SMS y email. También puedes ver el estado en tiempo real desde tu perfil en nuestra web.",
    },
    {
      category: "payment",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal, transferencias bancarias y pago en efectivo para delivery (con cambio exacto).",
    },
    {
      category: "payment",
      question: "¿Hay cargos adicionales?",
      answer:
        "Solo cobramos el costo de envío según tu zona. No hay cargos ocultos. Los precios mostrados en el menú son finales, excepto el delivery que se calcula según tu ubicación.",
    },
    {
      category: "payment",
      question: "¿Puedo solicitar factura?",
      answer:
        "Sí, puedes solicitar factura fiscal durante el proceso de compra. Solo necesitas proporcionar tus datos fiscales. La factura se envía por email en formato PDF.",
    },
    {
      category: "account",
      question: "¿Cómo creo una cuenta?",
      answer:
        "Puedes crear una cuenta haciendo clic en 'Registrarse' en la parte superior de la página. Solo necesitas tu email, nombre y una contraseña segura. También puedes registrarte con Google o Facebook.",
    },
    {
      category: "account",
      question: "¿Puedo cambiar mi información personal?",
      answer:
        "Sí, puedes actualizar tu información desde tu perfil. Ve a 'Mi Cuenta' > 'Editar Perfil' para cambiar nombre, email, teléfono y direcciones guardadas.",
    },
    {
      category: "reservations",
      question: "¿Cómo hago una reservación?",
      answer:
        "Puedes reservar mesa desde nuestra página de reservaciones, por teléfono al +1 (555) 123-4567, o directamente en el restaurante. Te recomendamos reservar con anticipación, especialmente fines de semana.",
    },
    {
      category: "reservations",
      question: "¿Puedo cancelar mi reserva?",
      answer:
        "Sí, puedes cancelar hasta 2 horas antes sin costo. Para cancelaciones con menos tiempo, puede aplicar un cargo del 50% del consumo mínimo por persona.",
    },
    {
      category: "menu",
      question: "¿Tienen opciones vegetarianas/veganas?",
      answer:
        "Sí, tenemos una amplia selección de platos vegetarianos y veganos claramente marcados en nuestro menú. También podemos adaptar muchos platos según tus preferencias dietéticas.",
    },
    {
      category: "menu",
      question: "¿Manejan alergias alimentarias?",
      answer:
        "Tomamos las alergias muy en serio. Indica tus alergias al hacer el pedido y nuestro chef preparará tu comida con precauciones especiales. Tenemos protocolos estrictos para evitar contaminación cruzada.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <PageHeader
        title="Preguntas Frecuentes"
        subtitle="Encuentra respuestas rápidas a las dudas más comunes"
        showBackButton
        gradient="from-orange-600 via-red-600 to-yellow-600"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-orange-100 border border-white/20"
                }`}>
                <category.icon sx={{ fontSize: 16 }} />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <QuestionAnswerOutlined
                className="text-gray-400 mb-4"
                sx={{ fontSize: 64 }}
              />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleExpanded(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-orange-50 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: expandedItems.includes(index) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}>
                    <ExpandMoreOutlined className="text-orange-500" />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedItems.includes(index) ? "auto" : 0,
                    opacity: expandedItems.includes(index) ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden">
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
                </motion.div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
            <p className="text-lg mb-6 opacity-90">
              Nuestro equipo de soporte está listo para ayudarte con cualquier duda
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="tel:+1555123456"
                className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                <span>Llamar Soporte</span>
              </a>
              <a
                href="mailto:ayuda@elbuensabor.com"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                <span>Enviar Email</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
