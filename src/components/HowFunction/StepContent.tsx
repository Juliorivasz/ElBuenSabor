//

import { motion } from "framer-motion";
import { CheckCircleOutlined, ArrowForwardOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface StepContentProps {
  activeStep: {
    id: number;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    features: string[];
    details: string[];
  };
}

export const StepContent: React.FC<StepContentProps> = ({ activeStep }) => {
  const navigate = useNavigate();

  const handleBeginNow = () => {
    // Navegar al catálogo para comenzar a explorar productos
    navigate("/catalog");
  };

  return (
    <motion.div
      key={activeStep.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <motion.div
          className={`w-16 h-16 bg-gradient-to-r ${activeStep.color} rounded-2xl flex items-center justify-center`}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <activeStep.icon className="text-white" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{activeStep.title}</h3>
          <p className="text-gray-600">{activeStep.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <motion.p
        className="text-gray-700 text-lg leading-relaxed mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        {activeStep.description}
      </motion.p>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {activeStep.features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}>
            <CheckCircleOutlined className="text-green-500" />
            <span className="text-gray-700 font-medium">{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-3">
        {activeStep.details.map((detail, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-3 text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}>
            <ArrowForwardOutlined
              className="text-orange-500 mt-0.5"
              sx={{ fontSize: 16 }}
            />
            <span>{detail}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        className="mt-8 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <motion.button
          onClick={handleBeginNow}
          className={`w-full bg-gradient-to-r cursor-pointer ${activeStep.color} text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}>
          <span>Comenzar Ahora</span>
          <ArrowForwardOutlined sx={{ fontSize: 20 }} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
