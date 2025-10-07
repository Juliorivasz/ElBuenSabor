"use client"

import { Add as AddIcon, LocalOffer } from "@mui/icons-material"
import type React from "react"
import { useEffect, useState } from "react"
import { PromocionCard } from "../../../components/promociones/PromocionCard"
import { PromocionModal } from "../../../components/promociones/PromocionModal"
import { PromotionsFilters } from "../../../components/promociones/PromotionFilters"
import type { Promocion } from "../../../models/Promocion"
import type { ArticuloListado } from "../../../services/promocionServicio"
import { promocionServicio } from "../../../services/promocionServicio"
import { NotificationService } from "../../../utils/notifications"

export const Promociones: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPromocion, setEditingPromocion] = useState<Promocion | null>(null)
  const [articulos, setArticulos] = useState<ArticuloListado[]>([])

  const [filtroActual, setFiltroActual] = useState<"todas" | "activas" | "inactivas">("todas")
  const [busqueda, setBusqueda] = useState("")

  // Implementación razonable de setArticulosDisponibles
  function setArticulosDisponibles(articulosCompatibles: ArticuloListado[]) {
    setArticulos(articulosCompatibles)
  }

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

  const cargarArticulos = async () => {
    try {
        console.log('Iniciando carga de artículos...');
        const articulos = await promocionServicio.obtenerArticulos();
        console.log('Artículos cargados:', articulos);
        
        // Mapear la nueva estructura a la esperada por el componente
        const articulosCompatibles: ArticuloListado[] = articulos.map(articulo => ({
            idArticulo: articulo.idArticulo,
            nombre: articulo.nombre,
            // Agregar campos faltantes con valores por defecto si no los necesitas
            descripcion: '', // No viene en ArticuloPromocionDto
            precioVenta: articulo.precioVenta,
            tiempoDeCocina: 0, // No viene en ArticuloPromocionDto  
            idCategoria: 0, // No viene en ArticuloPromocionDto
            url: null, // No viene en ArticuloPromocionDto
            puedeElaborarse: articulo.puedeElaborarse,
            // Nuevos campos disponibles
            activo: articulo.activo,
            disponible: articulo.disponible
        }));
        
        setArticulosDisponibles(articulosCompatibles);
    } catch (error) {
        console.error('Error al cargar artículos:', error);
        NotificationService.error('Error al cargar los artículos disponibles');
    }
};

  useEffect(() => {
    cargarPromociones()
    cargarArticulos()
  }, [])

  const getPromocionesFiltradas = () => {
    let filtradas = [...promociones]

    // Apply search filter
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase()
      filtradas = filtradas.filter(
        (promocion) =>
          promocion.getTitulo().toLowerCase().includes(busquedaLower) ||
          promocion.getDescripcion().toLowerCase().includes(busquedaLower),
      )
    }

    // Apply status filter
    switch (filtroActual) {
      case "activas":
        filtradas = filtradas.filter((promocion) => promocion.getActivo())
        break
      case "inactivas":
        filtradas = filtradas.filter((promocion) => !promocion.getActivo())
        break
      case "todas":
      default:
        break
    }

    return filtradas
  }

  const getEstadisticas = () => {
    return {
      total: promociones.length,
      activas: promociones.filter((p) => p.getActivo()).length,
      inactivas: promociones.filter((p) => !p.getActivo()).length,
    }
  }

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
      if (error instanceof Error && error.message.includes("artículo correspondiente se encuentra dado de baja")) {
        NotificationService.error(error.message)
      } else {
        NotificationService.error("El artículo correspondiente a esta promoción se encuentra dado de baja")
      }
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingPromocion(null)
  }

  // Simplificamos esta función - solo maneja el envío
  const handleModalSubmit = async (formData: FormData) => {
  try {
    if (editingPromocion) {
      await promocionServicio.actualizarPromocion(editingPromocion.getIdPromocion(), formData)
      NotificationService.success("Promoción actualizada correctamente")
    } else {
      await promocionServicio.crearPromocion(formData)
      NotificationService.success("Promoción creada correctamente")
    }
    
    await cargarPromociones()
  } catch (error) {
    console.error("Error al guardar promoción:", error)
    NotificationService.error(
      editingPromocion ? "Error al actualizar la promoción" : "Error al crear la promoción"
    )
    throw error
  }
}


  const promocionesFiltradas = getPromocionesFiltradas()
  const estadisticas = getEstadisticas()

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
          <button
            onClick={handleNuevaPromocion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <AddIcon fontSize="small" />
            Nueva Promoción
          </button>
        </div>

        <div className="mb-6">
          <PromotionsFilters
            totalPromociones={estadisticas.total}
            promocionesActivas={estadisticas.activas}
            promocionesInactivas={estadisticas.inactivas}
            filtroActual={filtroActual}
            onFiltroChange={setFiltroActual}
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promocionesFiltradas.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {busqueda || filtroActual !== "todas"
                  ? "No se encontraron promociones con los filtros aplicados"
                  : "No hay promociones registradas"}
              </div>
              {!busqueda && filtroActual === "todas" && (
                <button
                  onClick={handleNuevaPromocion}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <AddIcon fontSize="small" />
                  Crear Primera Promoción
                </button>
              )}
            </div>
          ) : (
            promocionesFiltradas.map((promocion) => (
              <PromocionCard
                key={promocion.getIdPromocion()}
                promocion={promocion}
                onEdit={handleEditarPromocion}
                onToggleStatus={handleCambiarEstado}
              />
            ))
          )}
        </div>

        {modalOpen && (
          <PromocionModal
            promocion={editingPromocion}
            onClose={handleModalClose}
            onSuccess={() => {}} // Función vacía ya que el éxito se maneja en onSubmit
            isOpen={modalOpen}
            onSubmit={handleModalSubmit} // Simplificado
            articulos={articulos}
          />
        )}
      </div>
    </div>
  )
}


