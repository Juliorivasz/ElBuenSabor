import type React from "react";
import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyProducts } from "./EmptyProducts";
import { ProductsCard } from "./ProductsCard";
import type { ProductsListProps } from "./types/products";

export const ProductsList: React.FC<ProductsListProps> = memo(({ products, onSelectProduct, categoryKey }) => {
  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={categoryKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {memoizedProducts.length === 0 ? (
            <div className="col-span-full">
              <EmptyProducts />
            </div>
          ) : (
            memoizedProducts.map((product) => (
              <ProductsCard
                key={product.getIdArticulo()}
                product={product}
                onClick={() => onSelectProduct(product)}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

ProductsList.displayName = "ProductsList";
