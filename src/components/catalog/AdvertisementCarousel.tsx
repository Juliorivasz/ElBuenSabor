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
  horarioInicio: string
  horarioFin: string
}

interface PromocionCatalogo {
  idPromocion: number
  titulo: string
  descripcion: string
  idArticulo: number
  descuento: number
  url: string
  horarioInicio: string
  horarioFin: string
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
          horarioInicio: promo.horarioInicio,
          horarioFin: promo.horarioFin,
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

  const isWithinPromotionHours = (horarioInicio: string, horarioFin: string): boolean => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes() // Convert to minutes

    const [inicioHour, inicioMin] = horarioInicio.split(":").map(Number)
    const [finHour, finMin] = horarioFin.split(":").map(Number)

    const inicioMinutes = inicioHour * 60 + inicioMin
    const finMinutes = finHour * 60 + finMin

    return currentTime >= inicioMinutes && currentTime <= finMinutes
  }

  const handleAddToCart = async (advertisement: Advertisement) => {
    const isValidTime = isWithinPromotionHours(advertisement.horarioInicio, advertisement.horarioFin)

    if (!isValidTime) {
      console.log("Promoción fuera del horario válido")
      return
    }

    try {
      // Fetch article information
      const response = await axios.get(`https://localhost:8080/articulo/informacion/${advertisement.idArticulo}`)
      const articleData = response.data

      // Create ArticuloDTO with promotional discount
      const articuloDTO = new (await import("../../models/dto/ArticuloDTO")).ArticuloDTO(
        articleData.idArticulo,
        articleData.nombre,
        articleData.descripcion,
        articleData.precioVenta,
        articleData.tiempoDeCocina,
        articleData.idCategoria,
        articleData.url,
        articleData.puedeElaborarse,
      )

      // Add to cart with promotional discount
      const { useCartStore } = await import("../../store/cart/useCartStore")
      useCartStore.getState().addItem(articuloDTO, articleData.url, advertisement.descuento)

      console.log(
        `Artículo ${advertisement.idArticulo} añadido al carrito con descuento del ${Math.round(advertisement.descuento * 100)}%`,
      )
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
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
            <div className="w-3/5 h-full bg-white flex items-center lg:p-8">
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
                  className="text-base sm:text-lg text-gray-600 mb-4 leading-relaxed"
                >
                  {advertisements[currentIndex].descripcion}
                </motion.p>

                {/* Horario de la promoción */}
                <motion.div          
                  className={`mb-3 mt-0 p-2 rounded-lg border-2 ${
                    isWithinPromotionHours(
                      advertisements[currentIndex].horarioInicio,
                      advertisements[currentIndex].horarioFin,
                    )
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-500 bg-red-50 text-red-700"
                  }`}
                >
                  <p className="font-semibold text-sm">
                    Horario de promoción: {advertisements[currentIndex].horarioInicio} -{" "}
                    {advertisements[currentIndex].horarioFin}
                  </p>
                  {!isWithinPromotionHours(
                    advertisements[currentIndex].horarioInicio,
                    advertisements[currentIndex].horarioFin,
                  ) && <p className="text-xs mt-1">Esta promoción no está disponible en este momento</p>}
                </motion.div>

                {/* Botón más abajo */}
                <motion.button                                    
                  onClick={() => handleAddToCart(advertisements[currentIndex])}
                  disabled={
                    !isWithinPromotionHours(
                      advertisements[currentIndex].horarioInicio,
                      advertisements[currentIndex].horarioFin,
                    )
                  }
                  className={`font-semibold mt-0 mb-0 py-3 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2 border-2 w-fit ${
                    isWithinPromotionHours(
                      advertisements[currentIndex].horarioInicio,
                      advertisements[currentIndex].horarioFin,
                    )
                      ? "bg-white hover:bg-gray-50 text-gray-700 border-black hover:shadow-xl cursor-pointer"
                      : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  <ShoppingCart sx={{ fontSize: 20 }} />
                  {isWithinPromotionHours(
                    advertisements[currentIndex].horarioInicio,
                    advertisements[currentIndex].horarioFin,
                  )
                    ? "Añadir al carrito"
                    : "No disponible"}
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
                index === currentIndex ? "bg-black scale-100" : "bg-gray-700/50 hover:cursor-pointer"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
