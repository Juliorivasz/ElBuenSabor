import { motion } from "framer-motion";
import {
  LocalShippingOutlined,
  AccessTimeOutlined,
  LocationOnOutlined,
  PaymentOutlined,
  CheckCircleOutlined,
} from "@mui/icons-material";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Link } from "react-router-dom";

export const Delivery = () => {
  const deliveryZones = [
    { name: "Centro", time: "15-20 min", price: "$2.99" },
    { name: "Norte", time: "20-25 min", price: "$3.99" },
    { name: "Sur", time: "25-30 min", price: "$4.99" },
    { name: "Este", time: "20-25 min", price: "$3.99" },
    { name: "Oeste", time: "25-30 min", price: "$4.99" },
  ];

  const features = [
    {
      icon: AccessTimeOutlined,
      title: "Entrega Rápida",
      description: "Promedio de 15-30 minutos según tu zona",
    },
    {
      icon: LocationOnOutlined,
      title: "Seguimiento en Tiempo Real",
      description: "Rastrea tu pedido desde la cocina hasta tu puerta",
    },
    {
      icon: PaymentOutlined,
      title: "Pago Seguro",
      description: "Múltiples métodos de pago disponibles",
    },
    {
      icon: CheckCircleOutlined,
      title: "Garantía de Calidad",
      description: "Si no estás satisfecho, te devolvemos tu dinero",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <PageHeader
        title="Delivery"
        subtitle="Llevamos los mejores sabores directamente a tu puerta"
        showBackButton
        gradient="from-orange-600 via-red-600 to-yellow-600"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon
                  className="text-white"
                  sx={{ fontSize: 32 }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Delivery Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Zonas de Entrega
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryZones.map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{zone.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <AccessTimeOutlined
                      sx={{ fontSize: 16 }}
                      className="mr-1"
                    />
                    {zone.time}
                  </span>
                  <span className="font-bold text-orange-600">{zone.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">¿Listo para ordenar?</h2>
            <p className="text-xl mb-6 opacity-90">
              Explora nuestro menú y disfruta de la mejor comida en la comodidad de tu hogar
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              <span>Ver Menú</span>
              <LocalShippingOutlined />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
