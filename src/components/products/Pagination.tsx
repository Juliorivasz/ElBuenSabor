//
import { motion } from "framer-motion";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isLoading = false }) => {
  if (totalPages <= 1) return null;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const maxPagesToShow = 7;

  const getPages = () => {
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) pages.push(-1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push(-1);

    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 flex-wrap">
      {/* Botón Anterior */}
      <motion.button
        whileHover={{ scale: canGoPrev && !isLoading ? 1.05 : 1 }}
        whileTap={{ scale: canGoPrev && !isLoading ? 0.95 : 1 }}
        onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        disabled={!canGoPrev || isLoading}
        className={`px-3 py-1 sm:py-2 rounded-lg border text-sm sm:text-base transition-all duration-200 font-medium ${
          !canGoPrev || isLoading
            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
            : "border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 bg-white"
        }`}>
        <ChevronLeftOutlined
          sx={{ fontSize: 18 }}
          className="mr-1"
        />
        Anterior
      </motion.button>

      {/* Números de página */}
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((page, i) =>
          page === -1 ? (
            <span
              key={`dots-${i}`}
              className="px-2 text-gray-400 select-none">
              ...
            </span>
          ) : (
            <motion.button
              key={page}
              whileHover={{ scale: page !== currentPage && !isLoading ? 1.05 : 1 }}
              whileTap={{ scale: page !== currentPage && !isLoading ? 0.95 : 1 }}
              onClick={() => page !== currentPage && onPageChange(page)}
              disabled={page === currentPage || isLoading}
              className={`px-3 py-1 rounded-lg border text-sm sm:text-base font-medium transition-all duration-200 ${
                page === currentPage
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent cursor-default"
                  : "border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 bg-white cursor-pointer"
              }`}>
              {page}
            </motion.button>
          ),
        )}
      </div>

      {/* Botón Siguiente */}
      <motion.button
        whileHover={{ scale: canGoNext && !isLoading ? 1.05 : 1 }}
        whileTap={{ scale: canGoNext && !isLoading ? 0.95 : 1 }}
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        className={`px-3 py-1 sm:py-2 rounded-lg border text-sm sm:text-base transition-all duration-200 font-medium ${
          !canGoNext || isLoading
            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
            : "border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 bg-white"
        }`}>
        Siguiente
        <ChevronRightOutlined
          sx={{ fontSize: 18 }}
          className="ml-1"
        />
      </motion.button>
    </motion.div>
  );
};
