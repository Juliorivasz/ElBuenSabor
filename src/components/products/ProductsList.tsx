import React from "react";
import { Product, ProductsListProps } from "./types/products";
import { ProductsCard } from "./ProductsCard";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyProducts } from "./EmptyProducts";

export const ProductsList: React.FC<ProductsListProps> = ({ products, onSelectProduct, categoryKey }) => {
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={categoryKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full">
              <EmptyProducts />
            </div>
          ) : (
            products.map((product: Product) => (
              <ProductsCard
                key={product.id}
                product={product}
                onClick={() => onSelectProduct(product)}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
