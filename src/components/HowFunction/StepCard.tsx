import type React from "react";
import { motion } from "framer-motion";
import { CheckCircleOutlined } from "@mui/icons-material";

interface StepCardProps {
  step: {
    id: number;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    color: string;
    features: string[];
  };
  index: number;
  isActive: boolean;
  onHover: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index, isActive, onHover }) => {
  return (
    <motion.div
      className="group cursor-pointer"
      onHoverStart={onHover}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}>
      <div
        className={`relative p-6 bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
          isActive ? "border-orange-300 shadow-2xl shadow-orange-500/20" : "border-gray-100 hover:border-orange-200"
        }`}>
        {/* Step Number */}
        <motion.div
          className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}>
          {index + 1}
        </motion.div>

        {/* Icon */}
        <motion.div
          className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
          animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.6 }}>
          <step.icon className="text-white" />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{step.title}</h3>
        <p className="text-sm text-gray-600 text-center mb-4">{step.subtitle}</p>

        {/* Features */}
        <div className="space-y-2">
          {step.features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center space-x-2 text-xs text-gray-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}>
              <CheckCircleOutlined
                className="text-green-500"
                sx={{ fontSize: 12 }}
              />
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
