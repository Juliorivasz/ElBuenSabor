import type React from "react";
import { motion } from "framer-motion";
import { ArrowBackOutlined, ArrowForwardOutlined } from "@mui/icons-material";

interface MobileStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onStepClick?: (step: number) => void;
}

export const MobileStepNavigation: React.FC<MobileStepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onStepClick,
}) => {
  return (
    <div className="lg:hidden">
      {/* Indicadores de pasos táctiles */}
      <div className="flex justify-center items-center space-x-3 mb-6">
        {[...Array(totalSteps)].map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onStepClick?.(index)}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
              index === currentStep
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110"
                : index < currentStep
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 text-gray-600"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={index > currentStep}>
            {index < currentStep ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lg">
                ✓
              </motion.div>
            ) : (
              <span>{index + 1}</span>
            )}

            {/* Línea conectora */}
            {index < totalSteps - 1 && (
              <div
                className={`absolute top-1/2 left-full w-8 h-0.5 -translate-y-1/2 transition-colors duration-300 ${
                  index < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Barra de progreso visual */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Paso {currentStep + 1} de {totalSteps}
          </span>
          <span className="text-sm font-semibold text-orange-600">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Navegación por swipe/botones */}
      <div className="flex justify-between items-center">
        <motion.button
          onClick={onPrevious}
          disabled={currentStep === 0}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            currentStep === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 shadow-lg border border-gray-200 active:scale-95"
          }`}
          whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
          whileTap={currentStep > 0 ? { scale: 0.9 } : {}}>
          <ArrowBackOutlined sx={{ fontSize: 24 }} />
        </motion.button>

        {/* Navegación por swipe hint */}
        <div className="flex-1 mx-4 text-center">
          <motion.div
            className="text-xs text-gray-500 bg-gray-50 rounded-full py-2 px-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            👆 Toca los números o desliza
          </motion.div>
        </div>

        <motion.button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            currentStep === totalSteps - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg active:scale-95"
          }`}
          whileHover={currentStep < totalSteps - 1 ? { scale: 1.05 } : {}}
          whileTap={currentStep < totalSteps - 1 ? { scale: 0.9 } : {}}>
          <ArrowForwardOutlined sx={{ fontSize: 24 }} />
        </motion.button>
      </div>

      {/* Información del paso actual */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center">
        <div className="text-xs text-gray-600 bg-orange-50 rounded-lg py-2 px-3">
          {currentStep === 0 && "🍔 Explora nuestro menú"}
          {currentStep === 1 && "🛒 Agrega a tu carrito"}
          {currentStep === 2 && "📦 Recibe tu pedido"}
        </div>
      </motion.div>
    </div>
  );
};
