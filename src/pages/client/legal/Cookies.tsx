import { motion } from "framer-motion";
import { useState } from "react";
import {
  CookieOutlined,
  SettingsOutlined,
  InfoOutlined,
  CheckCircleOutlined,
  SecurityOutlined,
  AnalyticsOutlined,
  AdsClickOutlined,
} from "@mui/icons-material";
import { PageHeader } from "../../../components/shared/PageHeader";

export const Cookies = () => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: true,
    analytics: false,
    advertising: false,
  });

  const cookieTypes = [
    {
      id: "essential",
      icon: SecurityOutlined,
      title: "Cookies Esenciales",
      description: "Necesarias para el funcionamiento básico del sitio web",
      details:
        "Estas cookies son estrictamente necesarias para que el sitio web funcione correctamente. Incluyen cookies de autenticación, carrito de compras y preferencias de idioma.",
      required: true,
      color: "from-red-500 to-red-600",
    },
    {
      id: "functional",
      icon: SettingsOutlined,
      title: "Cookies Funcionales",
      description: "Mejoran la funcionalidad y personalización del sitio",
      details:
        "Estas cookies permiten que el sitio web recuerde las opciones que hace (como su nombre de usuario, idioma o región) y proporcionan características mejoradas y más personales.",
      required: false,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "analytics",
      icon: AnalyticsOutlined,
      title: "Cookies de Análisis",
      description: "Nos ayudan a entender cómo los visitantes interactúan con el sitio",
      details:
        "Estas cookies nos ayudan a contar las visitas y fuentes de tráfico para que podamos medir y mejorar el rendimiento de nuestro sitio.",
      required: false,
      color: "from-green-500 to-green-600",
    },
    {
      id: "advertising",
      icon: AdsClickOutlined,
      title: "Cookies Publicitarias",
      description: "Utilizadas para mostrar anuncios relevantes",
      details:
        "Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios para crear un perfil de sus intereses y mostrarle anuncios relevantes.",
      required: false,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const handlePreferenceChange = (cookieType: string, value: boolean) => {
    if (cookieType === "essential") return; // Cannot disable essential cookies

    setPreferences((prev) => ({
      ...prev,
      [cookieType]: value,
    }));
  };

  const savePreferences = () => {
    // Here you would save the preferences to localStorage or send to server
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    alert("Preferencias guardadas exitosamente");
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
    alert("Todas las cookies han sido aceptadas");
  };

  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      functional: false,
      analytics: false,
      advertising: false,
    };
    setPreferences(onlyEssential);
    localStorage.setItem("cookiePreferences", JSON.stringify(onlyEssential));
    alert("Solo las cookies esenciales han sido aceptadas");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <PageHeader
        title="Política de Cookies"
        subtitle="Gestiona tus preferencias de cookies y conoce cómo las utilizamos"
        showBackButton
        gradient="from-orange-600 via-red-600 to-yellow-600"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <CookieOutlined
              className="text-orange-500"
              sx={{ fontSize: 32 }}
            />
            <h2 className="text-2xl font-bold text-gray-800">¿Qué son las Cookies?</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio
            web. Nos ayudan a hacer que su experiencia sea mejor al recordar sus preferencias y entender cómo utiliza
            nuestro sitio.
          </p>
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-2">
              <InfoOutlined
                className="text-orange-600"
                sx={{ fontSize: 20 }}
              />
              <span className="font-medium text-gray-800">
                Puede gestionar sus preferencias de cookies en cualquier momento desde esta página.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Cookie Types */}
        <div className="space-y-6 mb-8">
          {cookieTypes.map((cookie, index) => (
            <motion.div
              key={cookie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${cookie.color} rounded-full flex items-center justify-center`}>
                    <cookie.icon
                      className="text-white"
                      sx={{ fontSize: 24 }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{cookie.title}</h3>
                    <p className="text-gray-600">{cookie.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {cookie.required ? (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircleOutlined sx={{ fontSize: 16 }} />
                      <span>Requeridas</span>
                    </div>
                  ) : (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[cookie.id as keyof typeof preferences]}
                        onChange={(e) => handlePreferenceChange(cookie.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{cookie.details}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Gestionar Preferencias de Cookies</h3>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={acceptAll}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
              Aceptar Todas
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={savePreferences}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
              Guardar Preferencias
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={rejectAll}
              className="w-full sm:w-auto px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all">
              Solo Esenciales
            </motion.button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            Sus preferencias se guardarán en su navegador. Puede cambiarlas en cualquier momento visitando esta página
            nuevamente.
          </p>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <InfoOutlined className="mr-2 text-blue-600" />
            Información Adicional
          </h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Puede eliminar las cookies desde la configuración de su navegador</p>
            <p>• Algunas funciones del sitio pueden no funcionar correctamente sin cookies</p>
            <p>• Las cookies esenciales no pueden ser deshabilitadas</p>
            <p>
              • Para más información, consulte nuestra{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:underline">
                Política de Privacidad
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
