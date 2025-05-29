"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  discount?: number;
  backgroundColor: string;
  textColor: string;
}

const advertisements: Advertisement[] = [
  {
    id: "1",
    title: "¡50% OFF en Hamburguesas!",
    description: "Todas las hamburguesas con descuento especial",
    image: "/src/assets/hamburguesa.png",
    discount: 50,
    backgroundColor: "from-red-500 to-orange-500",
    textColor: "text-white",
  },
  {
    id: "2",
    title: "Envío Gratis",
    description: "En productos seleccionados",
    image: "/src/assets/adverts/envio-gratis.png",
    backgroundColor: "from-green-500 to-emerald-500",
    textColor: "text-white",
  },
  {
    id: "3",
    title: "Combo Familiar",
    description: "4 hamburguesas + papas + bebidas",
    image: "/src/assets/adverts/hamburguesas-papas-bebidas.png",
    discount: 30,
    backgroundColor: "from-purple-500 to-pink-500",
    textColor: "text-white",
  },
  {
    id: "4",
    title: "Happy Hour",
    description: "2x1 en bebidas de 17:00 a 19:00",
    image: "/src/assets/adverts/happy-hour.png",
    backgroundColor: "from-blue-500 to-cyan-500",
    textColor: "text-white",
  },
];

export const AdvertisementCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % advertisements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisements.length);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-80 sm:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-r px-10 sm:pr-0 ${advertisements[currentIndex].backgroundColor}`}>
            <div className="relative h-full flex items-center">
              {/* Content */}
              <div className="flex-1 p-6 sm:p-8 lg:p-12">
                <div className={advertisements[currentIndex].textColor}>
                  {advertisements[currentIndex].discount && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                      <span className="text-2xl font-bold">{advertisements[currentIndex].discount}% OFF</span>
                    </motion.div>
                  )}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                    {advertisements[currentIndex].title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg sm:text-xl opacity-90 mb-6">
                    {advertisements[currentIndex].description}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/30">
                    Ver Ofertas
                  </motion.button>
                </div>
              </div>

              {/* Image */}
              <div className="hidden sm:block flex-1 h-full relative">
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  src={advertisements[currentIndex].image}
                  alt={advertisements[currentIndex].title}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/30 text-white p-2 rounded-full transition-all duration-200 cursor-pointer">
          <ChevronLeft sx={{ fontSize: 24 }} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/30 text-white p-2 rounded-full transition-all duration-200 cursor-pointer">
          <ChevronRight sx={{ fontSize: 24 }} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
