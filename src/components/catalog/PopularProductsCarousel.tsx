//
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, AccessTime, ShoppingCart, Star } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ArticuloDTO } from "../../models/dto/ArticuloDTO";
import { getAllArticulos } from "../../services/articuloServicio";

interface PopularProductsCarouselProps {
  onAddToCart: (product: ArticuloDTO) => void;
}

export const PopularProductsCarousel: React.FC<PopularProductsCarouselProps> = ({ onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [direction, setDirection] = useState(0);
  const [popularProducts, setPopularProducts] = useState<ArticuloDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos y seleccionar los más populares
  useEffect(() => {
    const loadPopularProducts = async () => {
      try {
        const allProducts = await getAllArticulos(0);

        // Seleccionar los primeros 5 productos como los más populares
        // En una aplicación real, esto vendría de una API con datos de popularidad
        const popular = allProducts.content.slice(0, 5);
        setPopularProducts(popular);
      } catch (error) {
        console.error("Error loading popular products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularProducts();
  }, []);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || popularProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, popularProducts.length - itemsPerView);
        const newIndex = prev >= maxIndex ? 0 : prev + 1;
        setDirection(newIndex > prev ? 1 : -1);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, itemsPerView, popularProducts.length]);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, popularProducts.length - itemsPerView);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, popularProducts.length - itemsPerView);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 10 : -10,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 10 : -10,
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.3 },
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-12">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg">
              <Star sx={{ fontSize: 24 }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Top 5 Más Populares</h2>
          </div>
          <p className="text-gray-600">Los platos favoritos de nuestros clientes</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (popularProducts.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-12">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg">
              <Star sx={{ fontSize: 24 }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Top 5 Más Populares</h2>
          </div>
          <p className="text-gray-600">No hay productos populares disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg">
            <Star sx={{ fontSize: 24 }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Top 5 Más Populares</h2>
        </div>
        <p className="text-gray-600">Los platos favoritos de nuestros clientes</p>
      </motion.div>

      <div
        className="relative"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}>
        <div className="overflow-hidden">
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className={`grid gap-4 ${
                itemsPerView === 1 ? "grid-cols-1" : itemsPerView === 2 ? "grid-cols-2" : "grid-cols-3"
              }`}>
              {popularProducts.slice(currentIndex, currentIndex + itemsPerView).map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.getUrl() || "/placeholder.svg?height=200&width=300"}
                      alt={product.getNombre()}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      #{index + currentIndex + 1}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{product.getNombre()}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.getDescripcion()}</p>

                    {/* Cooking Time */}
                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                      <AccessTime sx={{ fontSize: 16 }} />
                      <span className="text-sm">{product.getTiempoDeCocina()} min</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-600">
                          ${product.getPrecioVenta().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
                      <ShoppingCart sx={{ fontSize: 20 }} />
                      Agregar al Carrito
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {popularProducts.length > itemsPerView && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute -left-8 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-200 z-10">
              <ChevronLeft sx={{ fontSize: 24 }} />
            </button>
            <button
              onClick={goToNext}
              className="absolute -right-8 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-200 z-10">
              <ChevronRight sx={{ fontSize: 24 }} />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, popularProducts.length - itemsPerView + 1) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-orange-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
