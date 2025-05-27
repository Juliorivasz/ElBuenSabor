"use client";

import type React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Categoria } from "../../models/Categoria";
import { fetchCategorias } from "../../services/categoriaServicio";
import { Category } from "./category/Category";
import type { ArticuloManufacturado } from "../../models/ArticuloManufacturado";
import { fetchArticulosManufacturados } from "../../services/articuloManufacturadoServicio";
import { ModalProduct } from "./modal/ModalProduct";
import { ProductsList } from "./ProductsList";
import { CategoryFilters } from "./CategoryFilters";
import { useCartStore } from "../../store/cart/useCartStore";
import { RestaurantMenuOutlined, FilterListOutlined } from "@mui/icons-material";

interface ProductsGridProps {
  searchTerm?: string;
  onProductsLoad?: (products: ArticuloManufacturado[]) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ searchTerm = "", onProductsLoad }) => {
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<ArticuloManufacturado | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<ArticuloManufacturado[]>([]);

  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriasData, productosData] = await Promise.all([fetchCategorias(), fetchArticulosManufacturados()]);
        setCategorias(categoriasData);
        setProductos(productosData);

        // Notificar al componente padre sobre los productos cargados
        if (onProductsLoad) {
          onProductsLoad(productosData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [onProductsLoad]);

  // Memoizar categorías padre
  const categoriasPadre = useMemo(() => categorias.filter((cat) => !cat.getcategoriaPadre()), [categorias]);

  // Memoizar subcategorías
  const subcategoriasConTodos = useMemo(() => {
    if (selectedParentCategory === null) return ["Todos"];

    const subcategorias = categorias
      .filter(
        (cat) => cat.getcategoriaPadre() && cat.getcategoriaPadre()?.getcategoriaNombre() === selectedParentCategory,
      )
      .map((cat) => cat.getcategoriaNombre());

    return ["Todos", ...subcategorias];
  }, [categorias, selectedParentCategory]);

  // Memoizar productos filtrados
  const filteredProducts = useMemo(() => {
    return productos.filter((producto) => {
      const perteneceACategoriaPadre =
        selectedParentCategory === null ||
        selectedParentCategory === "todos" ||
        producto.getCategoria()?.getcategoriaNombre() === selectedParentCategory ||
        producto.getCategoria()?.getcategoriaPadre()?.getcategoriaNombre() === selectedParentCategory;

      const perteneceASubcategoria =
        selectedSubCategory === "Todos" || producto.getCategoria()?.getcategoriaNombre() === selectedSubCategory;

      const coincideBusqueda =
        searchTerm === "" ||
        producto.getNombre().toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.getDescripcion().toLowerCase().includes(searchTerm.toLowerCase());

      return perteneceACategoriaPadre && perteneceASubcategoria && coincideBusqueda;
    });
  }, [productos, selectedParentCategory, selectedSubCategory, searchTerm]);

  // Callbacks memoizados
  const handleCategorySelect = useCallback((cat: string | null) => {
    setSelectedParentCategory(cat);
    setSelectedSubCategory("Todos");
  }, []);

  const handleSubCategorySelect = useCallback((cat: string) => {
    setSelectedSubCategory(cat);
  }, []);

  const handleProductSelect = useCallback((product: ArticuloManufacturado) => {
    setSelectedProduct(product);
  }, []);

  const handleAddToCart = useCallback(
    (p: ArticuloManufacturado, quantity: number) => {
      for (let i = 0; i < quantity; i++) {
        addItemToCart(p, p.getUrlImagen()[0]);
      }
      setSelectedProduct(null);
    },
    [addItemToCart],
  );

  return (
    <section className="flex flex-col w-full space-y-6">
      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center mr-2 sm:w-8 sm:h-8 sm:rounded-lg sm:mr-3">
            <FilterListOutlined
              className="text-white"
              sx={{ fontSize: { xs: 14, sm: 16, lg: 18 } }}
            />
          </div>
          <h3 className="text-lg font-bold sm:text-xl">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Categorías
            </span>
          </h3>
        </div>

        <Category
          categorias={categoriasPadre}
          selected={selectedParentCategory}
          onSelect={handleCategorySelect}
        />

        <AnimatePresence>
          {selectedParentCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 sm:mt-6">
              <CategoryFilters
                categories={subcategoriasConTodos}
                selected={selectedSubCategory}
                onSelect={handleSubCategorySelect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
        <div className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center mr-2 sm:w-8 sm:h-8 sm:rounded-lg sm:mr-3">
              <RestaurantMenuOutlined
                className="text-white"
                sx={{ fontSize: { xs: 14, sm: 16, lg: 18 } }}
              />
            </div>
            <h3 className="text-lg font-bold sm:text-xl">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Productos
              </span>
            </h3>
          </div>
          <div className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded-full self-start sm:text-sm sm:px-3">
            {filteredProducts.length} productos encontrados
          </div>
        </div>

        <ProductsList
          products={filteredProducts}
          onSelectProduct={handleProductSelect}
          categoryKey={selectedSubCategory + searchTerm}
        />
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ModalProduct
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
