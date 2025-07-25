import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeftOutlined, ChevronRightOutlined, AccessTimeOutlined } from "@mui/icons-material";
import { OrderInProgressCard } from "./OrderInProgressCard";
import type { OrderInProgress } from "../../types/OrderInProgress";

interface OrdersInProgressCarouselProps {
  orders: OrderInProgress[];
  onOrderClick?: (order: OrderInProgress) => void;
  onOpenChat?: (repartidorTelefono?: string) => void;
  onRefreshAllOrders?: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const OrdersInProgressCarousel: React.FC<OrdersInProgressCarouselProps> = ({
  orders,
  onOrderClick,
  onOpenChat,
  onRefreshAllOrders,
  loading = false,
  error = null,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTo = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        // En desktop, navegar por índices
        const newIndex =
          direction === "left" ? Math.max(0, currentIndex - 1) : Math.min(orders.length - 1, currentIndex + 1);
        goToSlide(newIndex);
      } else {
        // En mobile, scroll normal
        const scrollAmount = direction === "left" ? -384 : 384;
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const goToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        // En desktop, cada slide ocupa toda la pantalla
        scrollContainerRef.current.scrollTo({
          left: index * scrollContainerRef.current.clientWidth,
          behavior: "smooth",
        });
      } else {
        // En mobile, usar el ancho de la tarjeta
        scrollContainerRef.current.scrollTo({
          left: index * 384,
          behavior: "smooth",
        });
      }
    }
    setCurrentIndex(index);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        // Calcular el índice actual basado en el scroll
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const containerWidth = scrollContainerRef.current.clientWidth;
        const newIndex = Math.round(scrollLeft / containerWidth);
        setCurrentIndex(Math.min(newIndex, orders.length - 1));
      }
      updateScrollState();
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      updateScrollState();

      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [orders]);

  useEffect(() => {
    // Actualizar estado de navegación cuando cambie el índice
    if (orders.length > 0) {
      setCanScrollLeft(currentIndex > 0);
      setCanScrollRight(currentIndex < orders.length - 1);
    }
  }, [currentIndex, orders.length]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2 text-gray-600">Cargando pedidos...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          {onRefreshAllOrders && (
            <button
              onClick={onRefreshAllOrders}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AccessTimeOutlined className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No tienes pedidos en curso</h3>
          <p className="text-gray-600">Cuando realices un pedido, aparecerá aquí para que puedas seguir su progreso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header del carousel */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Pedidos en Curso</h2>
          <p className="text-gray-600 text-sm mt-1">
            {orders.length} {orders.length === 1 ? "pedido activo" : "pedidos activos"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Refresh button */}
          {onRefreshAllOrders && (
            <button
              onClick={onRefreshAllOrders}
              disabled={loading}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                loading
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-orange-500 text-orange-500 hover:bg-orange-50 hover:scale-105"
              }`}
              title="Actualizar pedidos">
              <svg
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}

          {/* Navigation buttons - Solo en desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? "border-orange-500 text-orange-500 hover:bg-orange-50 hover:scale-105 shadow-md"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }`}>
              <ChevronLeftOutlined className="text-xl" />
            </button>

            <button
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? "border-orange-500 text-orange-500 hover:bg-orange-50 hover:scale-105 shadow-md"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }`}>
              <ChevronRightOutlined className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor del carousel */}
      <div className="relative">
        {/* Scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 lg:gap-0 overflow-x-auto lg:overflow-hidden scrollbar-hide pb-4 lg:pb-0"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
          }}>
          {orders.map((order, index) => (
            <motion.div
              key={order.idPedido}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 lg:w-full"
              style={{ scrollSnapAlign: "start" }}>
              <OrderInProgressCard
                order={order}
                onClick={() => onOrderClick?.(order)}
                onOpenChat={onOpenChat}
              />
            </motion.div>
          ))}
        </div>

        {/* Indicador de scroll en mobile */}
        <div className="lg:hidden flex justify-center mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>←</span>
            <span>Desliza para ver más pedidos</span>
            <span>→</span>
          </div>
        </div>

        {/* Indicadores de puntos - Solo en desktop */}
        {orders.length > 1 && (
          <div className="hidden lg:flex justify-center mt-6 space-x-2">
            {orders.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-orange-500 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
