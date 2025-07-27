"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "../../../store/cart/useCartStore"
import { CartItem } from "../../../components/cart/CartItem"
import { DeliverySelector, type DeliveryType } from "../../../components/cart/DeliverySelector"
import { PaymentMethodSelector, type PaymentMethod } from "../../../components/cart/PaymentMethodSelector"
import { OrderSummary } from "../../../components/cart/OrderSummary"
import { BackToCatalogButton } from "../../../components/cart/BackToCatalogButton"
import { EmptyCart } from "../../../components/cart/EmptyCart"
import { ShoppingCartOutlined, PaymentOutlined, CheckCircleOutlined } from "@mui/icons-material"
import type { Direccion } from "../../../models/Direccion"

export const Cart = () => {
  const navigate = useNavigate()
  const { items, getTotalItems } = useCartStore()
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo")
  const [selectedAddress, setSelectedAddress] = useState<Direccion>()

  const totalItems = getTotalItems()

  // Calcular tiempo estimado basado en el mayor tiempo de cocina de los productos
  const getEstimatedCookingTime = () => {
    if (items.length === 0) return 5 // tiempo mínimo si no hay productos

    // Obtener el mayor tiempo de cocina entre los productos del carrito
    const maxCookingTime = Math.max(
      ...items.map((item) => {
        // Acceder al tiempo de cocina del artículo
        // Asumiendo que el artículo tiene un método getTiempoCocina() o propiedad tiempoCocina
        const tiempoCocina = item.articulo.getTiempoDeCocina()
          ? item.articulo.getTiempoDeCocina()
          : item.articulo.getTiempoDeCocina() || 0
        return tiempoCocina
      }),
    )

    // Si el mayor tiempo de cocina es 0, usar 5 minutos como mínimo
    return maxCookingTime === 0 ? 5 : maxCookingTime
  }

  const handleConfirmOrder = () => {
    alert("¡Pedido confirmado! Gracias por tu compra! ")
  }

  const handleDeliveryTypeChange = (type: DeliveryType) => {
    setDeliveryType(type)
    if (type === "pickup") {
      setSelectedAddress(undefined)
    }
  }

  const handleAddressChange = (address: Direccion) => {
    setSelectedAddress(address)
  }

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }

  // Si el carrito está vacío, mostrar componente de carrito vacío
  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <BackToCatalogButton />
          </div>
          <EmptyCart />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20"
        />
      </div>

      {/* Main Content */}
      <div className="relative pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header del carrito */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          >
            <BackToCatalogButton />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-center flex-1"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
                <ShoppingCartOutlined className="text-white" sx={{ fontSize: 32 }} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Mi Carrito
                </span>
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {totalItems} {totalItems === 1 ? "producto" : "productos"} seleccionados
              </p>
            </motion.div>
            <div className="w-20 hidden sm:block" /> {/* Spacer for centering */}
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <div className="flex items-center space-x-2 sm:space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 shadow-lg border border-orange-100 overflow-x-auto">
              {[
                { icon: ShoppingCartOutlined, label: "Carrito", active: true },
                { icon: PaymentOutlined, label: "Pago", active: false },
                { icon: CheckCircleOutlined, label: "Confirmación", active: false },
              ].map((step, index) => (
                <div key={step.label} className="flex items-center flex-shrink-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                      step.active
                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <step.icon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </div>
                  <span
                    className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                      step.active ? "text-orange-600" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  {index < 2 && <div className="w-4 sm:w-8 h-0.5 bg-gray-200 mx-2 sm:mx-4" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Columna principal - Productos, opciones de entrega y método de pago */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-2 space-y-6"
            >
              {/* Lista de productos */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                    <ShoppingCartOutlined className="text-white" sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </div>
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Productos en tu carrito
                  </span>
                </h2>

                <AnimatePresence>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.articulo.getIdArticulo()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CartItem item={item} />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>

              {/* Opciones de entrega */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <DeliverySelector
                  selectedType={deliveryType}
                  onTypeChange={handleDeliveryTypeChange}
                  selectedAddress={selectedAddress}
                  onAddressChange={handleAddressChange}
                  estimatedTime={getEstimatedCookingTime()}
                />
              </motion.div>

              {/* Método de pago */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <PaymentMethodSelector selectedMethod={paymentMethod} onMethodChange={handlePaymentMethodChange} />
              </motion.div>
            </motion.div>

            {/* Columna lateral - Resumen del pedido */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="xl:col-span-1"
            >
              <div className="sticky top-24">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                      <PaymentOutlined className="text-white" sx={{ fontSize: { xs: 16, sm: 20 } }} />
                    </div>
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Resumen del Pedido
                    </span>
                  </h3>
                  <OrderSummary
                    deliveryType={deliveryType}
                    paymentMethod={paymentMethod}
                    selectedAddress={selectedAddress}
                    onConfirmOrder={handleConfirmOrder}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
