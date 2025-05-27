"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, AccessTime, ShoppingCart, Star } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export interface PopularProduct {
  id: string;
  rank: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  cookingTime: number;
  image: string;
  rating: number;
  orders: number;
}

const popularProducts: PopularProduct[] = [
  {
    id: "1",
    rank: 1,
    name: "Double Burger Clásica",
    description: "Doble carne, queso, lechuga, tomate",
    price: 18.99,
    originalPrice: 24.99,
    discount: 24,
    cookingTime: 25,
    image: "https://media-cdn.tripadvisor.com/media/photo-s/1c/d1/7a/44/double-gorilla-burger.jpg",
    rating: 4.8,
    orders: 1250,
  },
  {
    id: "2",
    rank: 2,
    name: "Caesar Salad Premium",
    description: "Pollo grillado, croutons, parmesano",
    price: 16.99,
    cookingTime: 15,
    image:
      "https://popmenucloud.com/cdn-cgi/image/width=1200,height=630,format=auto,fit=cover/kohvqjiu/42a2f374-cd11-4b06-8a63-39597da5226b.jpg",
    rating: 4.7,
    orders: 980,
  },
  {
    id: "3",
    rank: 3,
    name: "Steak BBQ Especial",
    description: "Bife premium con salsa barbacoa",
    price: 28.99,
    originalPrice: 32.99,
    discount: 12,
    cookingTime: 30,
    image: "https://static.spotapps.co/website_images/ab_websites/125921_website_v1/about_s2.jpg",
    rating: 4.9,
    orders: 875,
  },
  {
    id: "4",
    rank: 4,
    name: "Chicken Nuggets Crispy",
    description: "12 nuggets crujientes con salsas",
    price: 14.99,
    cookingTime: 12,
    image: "https://i.ytimg.com/vi/BMiFPfHmGg4/maxresdefault.jpg",
    rating: 4.6,
    orders: 720,
  },
  {
    id: "5",
    rank: 5,
    name: "Vegan Burger Deluxe",
    description: "Hamburguesa 100% vegetal premium",
    price: 22.99,
    cookingTime: 20,
    image:
      "https://dallas.culturemap.com/media-library/true-food-kitchen-beet-burger.jpg?id=31508475&width=2000&height=1500&quality=65&coordinates=0%2C0%2C0%2C0",
    rating: 4.5,
    orders: 650,
  },
];

interface PopularProductsCarouselProps {
  onAddToCart: (product: PopularProduct) => void;
}

export const PopularProductsCarousel: React.FC<PopularProductsCarouselProps> = ({ onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);

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
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, popularProducts.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, popularProducts.length - itemsPerView);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, popularProducts.length - itemsPerView);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const visibleProducts = popularProducts.slice(currentIndex, currentIndex + itemsPerView);

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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`grid gap-4 ${
                itemsPerView === 1 ? "grid-cols-1" : itemsPerView === 2 ? "grid-cols-2" : "grid-cols-3"
              }`}>
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Rank Badge */}
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      #{product.rank}
                    </div>
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                    {/* Rating and Orders */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star sx={{ fontSize: 16, color: "#facc15" }} />
                        <span>{product.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart sx={{ fontSize: 16 }} />
                        <span>{product.orders} pedidos</span>
                      </div>
                    </div>

                    {/* Cooking Time */}
                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                      <AccessTime sx={{ fontSize: 16 }} />
                      <span className="text-sm">{product.cookingTime} min</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-600">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-200 z-10">
              <ChevronLeft sx={{ fontSize: 24 }} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-200 z-10">
              <ChevronRight sx={{ fontSize: 24 }} />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, popularProducts.length - itemsPerView + 1) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
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
