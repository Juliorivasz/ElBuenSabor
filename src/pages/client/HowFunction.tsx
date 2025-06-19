import { useState } from "react";
import { motion } from "framer-motion";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  LocalShippingOutlined,
  RestaurantMenuOutlined,
  SwipeOutlined,
} from "@mui/icons-material";
import { StepCard } from "../../components/HowFunction/StepCard";
import { StepContent } from "../../components/HowFunction/StepContent";

export const HowFunction = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      icon: SearchOutlined,
      title: "Explora",
      subtitle: "Descubre nuestro menú",
      description:
        "Navega por nuestra amplia selección de platos deliciosos, desde entradas hasta postres. Cada plato está cuidadosamente preparado con ingredientes frescos y de la más alta calidad.",
      color: "from-blue-500 to-cyan-500",
      features: ["Menú actualizado diariamente", "Filtros por categoría", "Información nutricional"],
      details: [
        "Más de 100 platos únicos disponibles",
        "Opciones vegetarianas y veganas",
        "Ingredientes locales y orgánicos",
        "Recomendaciones personalizadas",
      ],
    },
    {
      id: 2,
      icon: ShoppingCartOutlined,
      title: "Selecciona",
      subtitle: "Agrega a tu carrito",
      description:
        "Elige tus platos favoritos, ajusta las cantidades y agrega ingredientes adicionales. Nuestro sistema te permite crear la comida perfecta para tu gusto.",
      color: "from-green-500 to-emerald-500",
      features: ["Elección completa", "Ingredientes extra", "Notas especiales"],
      details: [
        "Modifica ingredientes según tus preferencias",
        "Agrega instrucciones especiales de cocción",
        "Guarda tus comidas favoritas",
      ],
    },
    {
      id: 3,
      icon: RestaurantMenuOutlined,
      title: "Confirma",
      subtitle: "Realiza tu pedido",
      description:
        "Revisa tu orden, selecciona tu método de pago preferido y confirma tu pedido. Ofrecemos múltiples opciones de pago seguras para tu comodidad.",
      color: "from-orange-500 to-red-500",
      features: ["Pago seguro", "Confirmación instantánea"],
      details: [
        "Tarjetas de crédito y débito",
        "Pagos digitales (MercadoPago)",
        "Pago en efectivo al recibir",
        "Facturación electrónica automática",
      ],
    },
    {
      id: 4,
      icon: LocalShippingOutlined,
      title: "Disfruta",
      subtitle: "Recibe tu pedido",
      description:
        "Nuestro equipo de delivery te llevará tu pedido caliente y fresco directamente a tu puerta. Rastrea tu pedido en tiempo real y disfruta de la mejor comida.",
      color: "from-purple-500 to-pink-500",
      features: ["Entrega rápida", "Seguimiento en tiempo real", "Comida caliente"],
      details: [
        "Tiempo promedio de entrega: 15-30 minutos",
        "Rastreo GPS en tiempo real",
        "Empaque térmico especializado",
        "Garantía de satisfacción 100%",
      ],
    },
  ];

  const handleStepHover = (index: number) => {
    setActiveStep(index);
  };

  const handlePrevious = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (direction === "right" && activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <section className="py-8 sm:py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-full blur-3xl"
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-4 sm:mb-6">
            <RestaurantMenuOutlined
              className="text-orange-500"
              sx={{ fontSize: 16 }}
            />
            <span className="text-sm font-medium text-orange-700">¿Cómo Funciona?</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            Pedir es{" "}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              súper fácil
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            En solo 4 simples pasos tendrás la mejor comida en tu mesa. Descubre lo fácil que es disfrutar de nuestros
            sabores únicos.
          </p>
        </motion.div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={activeStep === index}
                  onHover={() => handleStepHover(index)}
                />
              ))}
            </div>

            {/* Active Step Content */}
            <div className="sticky top-24">
              <StepContent activeStep={steps[activeStep]} />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Carrusel */}
        <div className="lg:hidden">
          {/* Indicadores de paso */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeStep ? "bg-gradient-to-r from-orange-500 to-red-500 scale-125" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Hint de swipe */}
          <motion.div
            className="flex items-center justify-center space-x-2 mb-6 text-sm text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <SwipeOutlined sx={{ fontSize: 16 }} />
            <span>Desliza para ver más pasos</span>
          </motion.div>

          {/* Carrusel de contenido */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${activeStep * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: -(steps.length - 1) * window.innerWidth, right: 0 }}
              onDragEnd={(_, info) => {
                const threshold = 50;
                if (info.offset.x > threshold) {
                  handleSwipe("right");
                } else if (info.offset.x < -threshold) {
                  handleSwipe("left");
                }
              }}>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="w-full flex-shrink-0 p-6">
                  <div className="space-y-6">
                    {/* Step Card */}
                    <StepCard
                      step={step}
                      index={index}
                      isActive={true}
                      onHover={() => {}}
                    />

                    {/* Step Content */}
                    <StepContent activeStep={step} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navegación por botones */}
          <div className="flex justify-between items-center mt-6">
            <motion.button
              onClick={handlePrevious}
              disabled={activeStep === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                activeStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 shadow-lg border border-gray-200"
              }`}
              whileHover={activeStep > 0 ? { scale: 1.05 } : {}}
              whileTap={activeStep > 0 ? { scale: 0.9 } : {}}>
              ←
            </motion.button>

            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">
                {activeStep + 1} de {steps.length}
              </span>
            </div>

            <motion.button
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                activeStep === steps.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              }`}
              whileHover={activeStep < steps.length - 1 ? { scale: 1.05 } : {}}
              whileTap={activeStep < steps.length - 1 ? { scale: 0.9 } : {}}>
              →
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
