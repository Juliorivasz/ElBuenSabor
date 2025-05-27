"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ArticuloManufacturado } from "../../../models/ArticuloManufacturado";
import { ProductsGrid } from "../../../components/products/ProductsGrid";
import { SearchSection } from "../../../components/catalog/SearchSection";
import { AdvertisementCarousel } from "../../../components/catalog/AdvertisementCarousel";
import { PopularProduct, PopularProductsCarousel } from "../../../components/catalog/PopularProductsCarousel";

export const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ArticuloManufacturado[]>([]);

  const handleProductSelect = (product: ArticuloManufacturado) => {
    console.log("Producto seleccionado desde búsqueda:", product.getNombre());
    // El modal se abre automáticamente desde SearchSection
  };

  const handleAddToCart = (product: PopularProduct) => {
    console.log("Agregando al carrito:", product);
    // Aquí puedes implementar la lógica para agregar al carrito
  };

  const handleProductsLoad = (loadedProducts: ArticuloManufacturado[]) => {
    setProducts(loadedProducts);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-24 pb-8 px-4 overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Nuestro Catálogo
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre nuestra deliciosa selección de platos preparados con amor
          </motion.p>
        </div>
      </motion.section>

      {/* Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4">
        <SearchSection
          products={products}
          onProductSelect={handleProductSelect}
          onSearchChange={handleSearchChange}
        />
      </motion.section>

      {/* Advertisement Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4">
        <AdvertisementCarousel />
      </motion.section>

      {/* Popular Products Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-4">
        <PopularProductsCarousel onAddToCart={handleAddToCart} />
      </motion.section>

      {/* Products Grid */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="px-4 pb-12 max-w-7xl mx-auto">
        <ProductsGrid
          searchTerm={searchTerm}
          onProductsLoad={handleProductsLoad}
        />
      </motion.main>
    </div>
  );
};
