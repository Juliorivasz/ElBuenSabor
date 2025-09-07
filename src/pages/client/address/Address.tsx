"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth0 } from "@auth0/auth0-react"
import Swal from "sweetalert2"
import type { Direccion } from "../../../models/Direccion"
import type { Departamento } from "../../../models/Departamento"
import type { DireccionDTO } from "../../../models/dto/DireccionDTO"
import { direccionServicio } from "../../../services/direccionServicio"
import { AddressCard } from "../../../components/address/AddressCard"
import { AddressModal } from "../../../components/address/AddressModal"
import { AddAddressButton } from "../../../components/address/AddAddressButton"
import { useLocation } from "react-router-dom"

export const Address: React.FC = () => {
  const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0()
  const location = useLocation()

  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && !isAuth0Loading) {
      loadInitialData()
    }
  }, [isAuthenticated, isAuth0Loading])

  const loadInitialData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [direccionesData, departamentosData] = await Promise.all([
        direccionServicio.obtenerDireccionesCliente(),
        direccionServicio.obtenerDepartamentosMendoza(),
      ])
      setDirecciones(direccionesData)
      setDepartamentos(departamentosData)

      // Si viene del carrito con la instrucción de abrir el modal
      if (location.state?.openModal) {
        setIsModalOpen(true)
      }
    } catch (err) {
      console.error("Error al cargar datos:", err)
      setError("Error al cargar las direcciones. Intenta de nuevo más tarde.")
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar las direcciones.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDirecciones = async () => {
    try {
      const direccionesData = await direccionServicio.obtenerDireccionesCliente()
      setDirecciones(direccionesData)
    } catch (err) {
      console.error("Error al refrescar direcciones:", err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar las direcciones.",
      })
    }
  }

  const handleAddAddress = () => {
    setSelectedDireccion(null)
    setIsModalOpen(true)
  }

  const handleEditAddress = (direccion: Direccion) => {
    setSelectedDireccion(direccion)
    setIsModalOpen(true)
  }

  const handleDeleteAddress = async (idDireccion: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la dirección permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff7e00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      try {
        await direccionServicio.eliminarDireccion(idDireccion)
        await refreshDirecciones()
        Swal.fire({
          icon: "success",
          title: "¡Eliminada!",
          text: "La dirección ha sido eliminada exitosamente.",
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error("Error al eliminar dirección:", err)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al eliminar la dirección.",
        })
      }
    }
  }

  const handleSaveAddress = async (direccionData: DireccionDTO) => {
    setIsSubmitting(true)
    try {
      if (selectedDireccion) {
        // Editar dirección existente
        await direccionServicio.modificarDireccion(selectedDireccion.idDireccion, direccionData)
        Swal.fire({
          icon: "success",
          title: "¡Actualizada!",
          text: "La dirección ha sido actualizada exitosamente.",
          timer: 1500,
          showConfirmButton: false,
        })
      } else {
        // Crear nueva dirección
        await direccionServicio.crearDireccion(direccionData)
        Swal.fire({
          icon: "success",
          title: "¡Creada!",
          text: "La dirección ha sido creada exitosamente.",
          timer: 1500,
          showConfirmButton: false,
        })
      }

      setIsModalOpen(false)
      await refreshDirecciones()
    } catch (err) {
      console.error("Error al guardar dirección:", err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar la dirección.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDireccion(null)
  }

  if (isAuth0Loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Cargando direcciones...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center">
          <p className="text-gray-600 text-base sm:text-lg">Debes iniciar sesión para ver tus direcciones</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="text-lg sm:text-xl font-semibold mb-2">Error al cargar direcciones</p>
          <p className="text-sm sm:text-base">{error}</p>
          <button
            onClick={loadInitialData}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const canAddMoreAddresses = direcciones.length < 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Mis Direcciones</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gestiona tus direcciones de entrega</p>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          {direcciones.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <p className="text-gray-500 text-lg mb-6">No tienes direcciones guardadas</p>
              <AddAddressButton onClick={handleAddAddress} />
            </motion.div>
          ) : (
            <>
              {direcciones.map((direccion, index) => (
                <motion.div
                  key={direccion.idDireccion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AddressCard direccion={direccion} onEdit={handleEditAddress} onDelete={handleDeleteAddress} />
                </motion.div>
              ))}

              {canAddMoreAddresses ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: direcciones.length * 0.1 }}
                >
                  <AddAddressButton onClick={handleAddAddress} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: direcciones.length * 0.1 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center"
                >
                  <p className="text-yellow-800 text-sm sm:text-base">
                    Sólo se admiten hasta tres direcciones. Si deseas realizar un pedido a una nueva dirección, deberá
                    modificar una dirección existente.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>

        <AddressModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAddress}
          direccion={selectedDireccion}
          departamentos={departamentos}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}
