"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Add as AddIcon } from "@mui/icons-material"
import { PromocionCard } from "../../../components/promociones/PromocionCard"
import { PromocionModal } from "../../../components/promociones/PromocionModal"
import { promocionServicio } from "../../../services/promocionServicio"
import type { Promocion } from "../../../models/Promocion"
import { NotificationService } from "../../../utils/notifications"
import { LocalOffer } from "@mui/icons-material"

export const Promociones: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPromocion, setEditingPromocion] = useState<Promocion | null>(null)

  const cargarPromociones = async () => {
    try {
      setLoading(true)
      const data = await promocionServicio.obtenerPromociones()
      setPromociones(data)
    } catch (error) {
      console.error("Error al cargar promociones:", error)
      NotificationService.error("Error al cargar las promociones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPromociones()
  }, [])

  const handleNuevaPromocion = () => {
    setEditingPromocion(null)
    setModalOpen(true)
  }

  const handleEditarPromocion = (promocion: Promocion) => {
    setEditingPromocion(promocion)
    setModalOpen(true)
  }

  const handleCambiarEstado = async (idPromocion: number) => {
    try {
      await promocionServicio.cambiarEstadoPromocion(idPromocion)
      NotificationService.success("Estado de la promoción actualizado correctamente")
      await cargarPromociones()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      NotificationService.error("Error al cambiar el estado de la promoción")
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingPromocion(null)
  }

  const handleModalSuccess = () => {
    setModalOpen(false)
    setEditingPromocion(null)
    cargarPromociones()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <LocalOffer className="text-black mr-3" fontSize="large" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Promociones</h1>
              <p className="text-gray-600 mt-1">Administra las promociones y ofertas especiales del restaurante</p>
            </div>
          </div>
        </div>
        {/* Botón Nueva Promoción - Moved to right side */}
        {promociones.length > 0 && (
          <div className="pl-8 mb-8 flex justify-left">
            <button
              onClick={handleNuevaPromocion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <AddIcon fontSize="small" />
              Nueva Promoción
            </button>
          </div>
        )}

        {/* Lista de Promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promociones.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No hay promociones registradas</div>
              <button
                onClick={handleNuevaPromocion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <AddIcon fontSize="small" />
                Crear Primera Promoción
              </button>
            </div>
          ) : (
            <>
              {promociones.map((promocion) => (
                <PromocionCard
                  key={promocion.getIdPromocion()}
                  promocion={promocion}
                  onEdit={handleEditarPromocion}
                  onToggleStatus={handleCambiarEstado}
                />
              ))}              
            </>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <PromocionModal promocion={editingPromocion} onClose={handleModalClose} onSuccess={handleModalSuccess} />
        )}
      </div>
    </div>
  )
}
