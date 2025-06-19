import { useEffect, useState, useMemo, useCallback, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCategoriasAbm } from "../../services/categoriaServicio";
import { ModalProduct } from "./modal/ModalProduct";
import { ProductsList } from "./ProductsList";
import { CategoryFilters } from "./CategoryFilters";
import { useCartStore } from "../../store/cart/useCartStore";
import { RestaurantMenuOutlined, FilterListOutlined } from "@mui/icons-material";
import { Category } from "./category/Category";
import { Pagination } from "./Pagination";
import { CategoriaDTO } from "../../models/dto/CategoriaDTO";
import { getAllArticulos } from "../../services/articuloServicio";
import { ArticuloDTO } from "../../models/dto/ArticuloDTO";

interface ProductsGridProps {
  searchTerm?: string;
  onProductsLoad?: (products: ArticuloDTO[]) => void;
}

type SortOrder = "asc" | "desc";
type SortKey = "precioVenta" | "tiempoDeCocina" | "orders" | null;

export const ProductsGrid: FC<ProductsGridProps> = ({ searchTerm = "", onProductsLoad }) => {
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<ArticuloDTO | null>(null);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [productos, setProductos] = useState<ArticuloDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pagesTotal, setPagesTotal] = useState<number>(1);

  const addItemToCart = useCartStore((state) => state.addItem);

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const dataCategorias = await fetchCategoriasAbm();
        setCategorias(dataCategorias);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategorias();
  }, []);

  // Cargar productos paginados desde el backend
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getAllArticulos(currentPage - 1);

        setProductos(data.content);
        setPagesTotal(data.page.totalPages);

        // Notificar al componente padre sobre los productos cargados
        if (onProductsLoad) {
          onProductsLoad(data.content);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, onProductsLoad]);

  // Memoizar categorías padre
  const categoriasPadre = useMemo(() => categorias.filter((cat) => !cat.getIdCategoriaPadre()), [categorias]);

  // Memoizar subcategorías
  const subcategoriasConTodos = useMemo(() => {
    if (selectedParentCategory === null) return ["Todos"];

    const subcategorias = categorias
      .filter((cat) => cat.getIdCategoriaPadre() && cat.getIdCategoriaPadre().toString() === selectedParentCategory)
      .map((cat) => cat.getNombre());

    return ["Todos", ...subcategorias];
  }, [categorias, selectedParentCategory]);

  // Memoizar productos filtrados
  const filteredProducts = useMemo(() => {
    let filtered = productos.filter((producto) => {
      const subCategoriasIDs = categorias
        .filter((cat) => cat.getIdCategoriaPadre()?.toString() === selectedParentCategory)
        .map((cat) => cat.getIdCategoria().toString());

      const perteneceACategoriaPadre =
        selectedParentCategory === null ||
        selectedParentCategory === "todos" ||
        producto.getIdCategoria().toString() == selectedParentCategory ||
        subCategoriasIDs.includes(producto.getIdCategoria().toString());

      const perteneceASubcategoria =
        selectedSubCategory === "Todos" ||
        categorias.find(
          (cat) => cat.getNombre() === selectedSubCategory && cat.getIdCategoria() === producto.getIdCategoria(),
        );

      const coincideBusqueda =
        searchTerm === "" ||
        producto.getNombre().toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.getDescripcion().toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.getIdCategoria().toString().includes(searchTerm);

      return perteneceACategoriaPadre && perteneceASubcategoria && coincideBusqueda;
    });

    // Sorting logic
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        if (sortKey === "orders") {
          comparison = (b.getPrecioVenta() || 0) - (a.getPrecioVenta() || 0);
        } else {
          const aValue = sortKey === "precioVenta" ? a.getPrecioVenta() : a.getTiempoDeCocina();
          const bValue = sortKey === "precioVenta" ? b.getPrecioVenta() : b.getTiempoDeCocina();
          comparison = aValue - bValue;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [productos, selectedParentCategory, selectedSubCategory, searchTerm, sortOrder, sortKey, categorias]);

  const handleCategorySelect = useCallback((cat: string | null) => {
    setSelectedParentCategory(cat);
    setSelectedSubCategory("Todos");
    setCurrentPage(1); // Reset to first page when changing category
  }, []);

  const handleSubCategorySelect = useCallback((cat: string) => {
    setSelectedSubCategory(cat);
    setCurrentPage(1); // Reset to first page when changing subcategory
  }, []);

  const handleProductSelect = useCallback((product: ArticuloDTO) => {
    setSelectedProduct(product);
  }, []);

  const handleAddToCart = useCallback(
    (p: ArticuloDTO, quantity: number) => {
      for (let i = 0; i < quantity; i++) {
        addItemToCart(p, p.getImagenDto()?.getUrl());
      }
      setSelectedProduct(null);
    },
    [addItemToCart],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 1600, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback((value: string) => {
    if (value === "default") {
      setSortKey(null);
    } else {
      const [newSortKey, newSortOrder] = value.split("-") as [SortKey, SortOrder];
      setSortKey(newSortKey);
      setSortOrder(newSortOrder);
    }
  }, []);

  return (
    <section className="flex flex-col w-full space-y-6">
      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center mr-2 sm:mr-3">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center mr-2 sm:mr-3">
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

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded-full sm:text-sm sm:px-3">
              {filteredProducts.length} productos encontrados
            </div>

            <select
              id="sortOrder"
              value={sortKey ? `${sortKey}-${sortOrder}` : "default"}
              onChange={(e) => handleSortChange(e.target.value)}
              disabled={isLoading}
              className="block text-black w-full sm:w-auto px-3 py-2 border border-gray-900 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="default">Ordenar por...</option>
              <option value="precioVenta-asc">Precio: Menor a Mayor</option>
              <option value="precioVenta-desc">Precio: Mayor a Menor</option>
              <option value="tiempoDeCocina-asc">Tiempo: Menor a Mayor</option>
              <option value="tiempoDeCocina-desc">Tiempo: Mayor a Menor</option>
              <option value="orders-desc">Más Populares</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-gray-600">Cargando productos...</span>
          </div>
        ) : (
          <ProductsList
            products={filteredProducts}
            onSelectProduct={handleProductSelect}
            categoryKey={selectedSubCategory + searchTerm + currentPage}
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={pagesTotal}
          onPageChange={handlePageChange}
          isLoading={isLoading}
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
