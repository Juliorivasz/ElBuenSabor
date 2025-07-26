"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

interface Advertisement {
  id: string
  titulo: string
  descripcion: string
  idArticulo: number
  descuento: number
  url: string
}

interface PromocionCatalogo {
  idPromocion: number
  titulo: string
  descripcion: string
  idArticulo: number
  descuento: number
  url: string
}

export const AdvertisementCarousel: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await axios.get<PromocionCatalogo[]>("https://localhost:8080/promocion/catalogo")

        const promocionesFormateadas: Advertisement[] = response.data.map((promo) => ({
          id: promo.idPromocion.toString(),
          titulo: promo.titulo,
          descripcion: promo.descripcion,
          idArticulo: promo.idArticulo,
          descuento: promo.descuento,
          url: promo.url,
        }))

        setAdvertisements(promocionesFormateadas)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar promociones:", error)
        setLoading(false)
      }
    }

    fetchPromociones()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || advertisements.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % advertisements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, advertisements.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisements.length)
  }

  const handleAddToCart = async (idArticulo: number) => {
    try {
      // Aquí implementarías la lógica para añadir al carrito
      // Por ejemplo, usando un store de carrito o llamando a un servicio
      console.log(`Añadiendo artículo ${idArticulo} al carrito`)

      // Ejemplo de implementación (ajustar según tu store de carrito):
      // await cartStore.addItem(idArticulo, 1)

      // Mostrar notificación de éxito
      // showNotification('Producto añadido al carrito', 'success')
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
      // showNotification('Error al añadir al carrito', 'error')
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-12">
        <div className="h-80 sm:h-64 lg:h-80 rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Cargando promociones...</span>
        </div>
      </div>
    )
  }

  if (advertisements.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-12">
        <div className="h-80 sm:h-64 lg:h-80 rounded-2xl bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">No hay promociones disponibles</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-80 sm:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl bg-white"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex"
          >
            {/* Imagen a la izquierda */}
            <div className="w-2/5 h-full">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                src={advertisements[currentIndex].url}
                alt={advertisements[currentIndex].titulo}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenido a la derecha */}
            <div className="w-3/6 h-full bg-white flex items-center lg:p-8">
              <div className="flex-1 flex flex-col justify-center">
                {/* Título */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight"
                >
                  {advertisements[currentIndex].titulo}
                </motion.h2>

                {/* Descripción */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed"
                >
                  {advertisements[currentIndex].descripcion}
                </motion.p>

                {/* Botón más abajo */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => handleAddToCart(advertisements[currentIndex].idArticulo)}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 border-2 border-black w-fit"
                >
                  <ShoppingCart sx={{ fontSize: 20 }} />
                  Añadir al carrito
                </motion.button>
              </div>

              {/* Porcentaje de descuento más centrado */}
              <div className="ml-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="bg-gray-800 text-white rounded-full w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center shadow-lg"
                >
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {Math.round(advertisements[currentIndex].descuento * 100)}%
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 cursor-pointer z-10"
        >
          <ChevronLeft sx={{ fontSize: 24 }} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 cursor-pointer z-10"
        >
          <ChevronRight sx={{ fontSize: 24 }} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-red-500 scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
