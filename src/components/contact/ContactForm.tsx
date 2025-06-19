//

import { useState } from "react";
import { motion } from "framer-motion";
import { SendOutlined, PersonOutlined, EmailOutlined, MessageOutlined } from "@mui/icons-material";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const subjects = ["Consulta General", "Reservas", "Catering", "Sugerencias", "Reclamos", "Trabajo"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="order-2 lg:order-1">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Hablemos!{" "}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Contáctanos
            </span>
          </h2>
          <p className="text-gray-600">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <div className="relative">
              <PersonOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="Tu nombre completo"
              />
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <div className="relative">
              <EmailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                placeholder="tu@email.com"
              />
            </div>
          </motion.div>

          {/* Subject Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <option value="">Selecciona un asunto</option>
              {subjects.map((subject) => (
                <option
                  key={subject}
                  value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Message Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
            <div className="relative">
              <MessageOutlined className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <SendOutlined />
                  <span>Enviar Mensaje</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};
