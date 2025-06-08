//
import { useState, useEffect, useRef } from "react";
import { Search, Clear, SearchOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ModalProduct } from "../products/modal/ModalProduct";
import { useCartStore } from "../../store/cart/useCartStore";
import { ArticuloDTO } from "../../models/dto/ArticuloDTO";

interface SearchSectionProps {
  products: ArticuloDTO[];
  onSearchChange?: (searchTerm: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ products, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ArticuloDTO[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState<ArticuloDTO | null>(null);
  const [showNoResults, setShowNoResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addItem } = useCartStore();

  useEffect(() => {
    // Notificar al componente padre sobre el cambio en el término de búsqueda
    onSearchChange?.(searchTerm);

    if (searchTerm.trim()) {
      const filtered = products
        .filter(
          (product) =>
            product.getNombre().toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.getDescripcion().toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 5);

      setSuggestions(filtered);
      setShowSuggestions(true);
      setShowNoResults(filtered.length === 0 && searchTerm.trim().length > 2);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowNoResults(false);
    }
  }, [searchTerm, products, onSearchChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowNoResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleProductSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setShowNoResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleProductSelect = (product: ArticuloDTO) => {
    setSearchTerm(product.getNombre());
    setShowSuggestions(false);
    setShowNoResults(false);
    setSelectedProduct(product);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      setShowNoResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setShowNoResults(false);
    inputRef.current?.focus();
  };

  const handleAddToCart = (product: ArticuloDTO, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, product.getImagenDto()?.getUrl() || "https://placehold.co/150");
    }
    setSelectedProduct(null);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div
        className="w-full max-w-4xl mx-auto mb-8"
        ref={searchRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative">
          <div className="relative flex items-center">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchTerm && setShowSuggestions(true)}
                placeholder="Buscar productos, categorías..."
                className="w-full h-12 pl-12 pr-10 text-gray-700 bg-white border-2 border-gray-200 rounded-l-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                sx={{ fontSize: 20 }}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Clear sx={{ fontSize: 20 }} />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="h-12 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-r-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2">
              <Search sx={{ fontSize: 20 }} />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {(showSuggestions && suggestions.length > 0) || showNoResults ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {suggestions.length > 0 ? (
                  suggestions.map((product, index) => (
                    <motion.div
                      key={product.getIdArticulo()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleProductSelect(product)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                        index === selectedIndex ? "bg-orange-50 border-l-4 border-orange-500" : "hover:bg-gray-50"
                      }`}>
                      <img
                        src={product.getImagenDto()?.getUrl() || "https://placehold.co/400"}
                        alt={product.getNombre()}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.getNombre()}</h4>
                        <p className="text-sm text-gray-500 truncate">{product.getDescripcion()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">${product.getPrecioVenta().toFixed(2)}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {product.getIdCategoria().toString() || "Sin categoría"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : showNoResults ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 text-center">
                    <SearchOff
                      className="text-gray-400 mb-3"
                      sx={{ fontSize: 48 }}
                    />
                    <h4 className="font-medium text-gray-700 mb-2">No encontramos resultados</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      No pudimos encontrar productos que coincidan con "{searchTerm}"
                    </p>
                    <div className="text-xs text-gray-400">
                      <p>• Verifica la ortografía</p>
                      <p>• Intenta con términos más generales</p>
                      <p>• Prueba con el nombre de una categoría</p>
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal Product */}
      {selectedProduct && (
        <ModalProduct
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};
