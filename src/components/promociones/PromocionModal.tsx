"use client"

import { Close as CloseIcon, CloudUpload as UploadIcon } from "@mui/icons-material"
import type React from "react"
import { useEffect, useState } from "react"
import type { DetallePromocionDto } from "../../models/dto/DetallePromocionDTO"
import type { Promocion } from "../../models/Promocion"
import { promocionServicio, type ArticuloListado } from "../../services/promocionServicio"
import { NotificationService } from "../../utils/notifications"

interface PromocionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onSubmit: (data: FormData) => Promise<void> // Ahora acepta FormData
  articulos: ArticuloListado[]
  promocion?: Promocion | null
}

export const PromocionModal: React.FC<PromocionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  articulos,
  promocion,
}) => {
  type Seleccionado = { id: number; cantidad: number }

  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [horarioInicio, setHorarioInicio] = useState("")
  const [horarioFin, setHorarioFin] = useState("")
  const [precioPromocion, setPrecioPromocion] = useState(0)
  const [seleccionados, setSeleccionados] = useState<Seleccionado[]>([])
  const [file, setFile] = useState<File | undefined>(undefined)
  const [eliminarImagen, setEliminarImagen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (promocion) {
      setNombre(promocion.getTitulo())
      setDescripcion(promocion.getDescripcion())
      setHorarioInicio(promocion.getHorarioInicio() ?? "")
      setHorarioFin(promocion.getHorarioFin() ?? "")
      setPrecioPromocion(promocion.getPrecioPromocion() ?? 0)
      setSeleccionados((promocion.getDetalles() || []).map((d) => ({ id: d.idArticulo, cantidad: d.cantidad })))
      setEliminarImagen(false)
      setFile(undefined)
    } else {
      setNombre("")
      setDescripcion("")
      setHorarioInicio("")
      setHorarioFin("")
      setPrecioPromocion(0)
      setSeleccionados([])
      setEliminarImagen(false)
      setFile(undefined)
    }
    setIsSubmitting(false)
  }, [promocion, isOpen])

  const handleGuardar = async () => {
    if (isSubmitting) return

    // Validaciones
    if (!nombre.trim()) return NotificationService.error("El nombre de la promoción es obligatorio")
    if (!descripcion.trim()) return NotificationService.error("La descripción es obligatoria")
    if (!horarioInicio || !horarioFin) return NotificationService.error("Los horarios de inicio y fin son obligatorios")
    if (precioPromocion <= 0) return NotificationService.error("El precio de promoción debe ser mayor a 0")
    if (seleccionados.length === 0) return NotificationService.error("Seleccione al menos un artículo para la promoción")

    if (!promocion) {
      for (const seleccionado of seleccionados) {
        const articulo = articulos.find((a) => a.idArticulo === seleccionado.id)
        if (articulo) {
          try {
            const tieneStock = await promocionServicio.obtenerArticulosConDisponibilidad()
            if (!tieneStock) return NotificationService.error(`El artículo "${articulo.nombre}" no tiene stock suficiente o está inactivo`)
          } catch {
            return NotificationService.error(`Error al verificar el stock del artículo "${articulo.nombre}"`)
          }
        }
      }
    }

    setIsSubmitting(true)

    try {
      const detalles: DetallePromocionDto[] = seleccionados.map((s) => {
        const articulo = articulos.find((a) => a.idArticulo === s.id)
        return { idArticulo: s.id, cantidad: s.cantidad, nombreArticulo: articulo?.nombre }
      })

      const dto = {
        titulo: nombre,
        activo: true,
        descripcion,
        horarioInicio,
        horarioFin,
        precioPromocional: precioPromocion,
        detalles,
        eliminarImagen,
      }

      // Crear FormData
      const formData = new FormData()
      formData.append("promocion", new Blob([JSON.stringify(dto)], { type: "application/json" }))
      if (file) formData.append("file", file)
      if (promocion?.getUrl()) formData.append("url", promocion.getUrl())

      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Error al guardar la promoción:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSeleccionArticulo = (id: number) => {
    setSeleccionados((prev) => {
      const existe = prev.find((s) => s.id === id)
      if (existe) return prev.filter((s) => s.id !== id)
      return [...prev, { id, cantidad: 1 }]
    })
  }

  const handleCantidadArticulo = (id: number, cantidad: number) => {
    if (cantidad < 1) return
    setSeleccionados((prev) => prev.map((s) => (s.id === id ? { ...s, cantidad } : s)))
  }

  const precioTotal = seleccionados.reduce((total, seleccionado) => {
    const articulo = articulos.find((a) => a.idArticulo === seleccionado.id)
    return total + (articulo?.precioVenta || 0) * seleccionado.cantidad
  }, 0)

  if (!isOpen) return null

  function calcularPrecioSugerido(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault()
    if (seleccionados.length === 0) {
      NotificationService.error("Seleccione al menos un artículo para calcular el precio sugerido")
      return
    }
    const descuento = 0.2
    const sugerido = precioTotal > 0 ? +(precioTotal * (1 - descuento)).toFixed(2) : 0
    setPrecioPromocion(sugerido)
    NotificationService.success(`Precio sugerido aplicado: $${sugerido.toFixed(2)}`)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/20 z-50">
      <div className="bg-white text-gray-900 p-6 rounded-lg w-11/12 max-w-lg relative shadow-2xl border max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 disabled:opacity-50"
        >
          <CloseIcon />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {promocion ? "Editar Promoción" : "Nueva Promoción"}
        </h2>

        <div className="flex flex-col gap-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la promoción *</label>
            <input
              type="text"
              placeholder="Ej: Happy Hour 2x1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea
              placeholder="Describe los detalles de la promoción..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horario de inicio *</label>
              <input
                type="time"
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:border-blue-500 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer disabled:opacity-50"
                style={{ colorScheme: "light" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horario de fin *</label>
              <input
                type="time"
                value={horarioFin}
                onChange={(e) => setHorarioFin(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:border-blue-500 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer disabled:opacity-50"
                style={{ colorScheme: "light" }}
              />
            </div>
          </div>

          {/* Precio */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Precio de promoción *</label>
              <button
                type="button"
                onClick={calcularPrecioSugerido}
                disabled={isSubmitting || seleccionados.length === 0}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed underline"
              >
                Calcular precio sugerido
              </button>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={precioPromocion}
              onChange={(e) => setPrecioPromocion(Number(e.target.value))}
              disabled={isSubmitting}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
              style={{ colorScheme: "light" }}
            />
          </div>

          {/* Selección de artículos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar artículos *</label>
            <p className="text-xs text-gray-500 mb-2">Elija los artículos que formarán parte de esta promoción</p>
            <div className="max-h-40 overflow-y-auto border border-gray-300 p-2 rounded mt-1 bg-white">
              {articulos.map((a) => {
                const seleccionado = seleccionados.find((s) => s.id === a.idArticulo)
                const esDisponible = a.disponible !== false
                return (
                  <div key={a.idArticulo} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={!!seleccionado}
                      onChange={() => handleSeleccionArticulo(a.idArticulo)}
                      disabled={isSubmitting || !esDisponible}
                      className="text-blue-600 disabled:opacity-50"
                    />
                    <span className={`flex-1 text-sm ${!esDisponible ? "text-red-500 line-through" : "text-gray-900"}`}>
                      {a.nombre}{!esDisponible && <span className="text-xs text-red-500 ml-1">(Sin stock)</span>}
                    </span>
                    {seleccionado && (
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-gray-600">Cant:</label>
                        <input
                          type="number"
                          min={1}
                          value={seleccionado.cantidad}
                          onChange={(e) => handleCantidadArticulo(a.idArticulo, Number(e.target.value))}
                          disabled={isSubmitting}
                          className="w-16 border border-gray-300 rounded p-1 bg-white text-gray-900 focus:border-blue-500 focus:outline-none text-sm disabled:opacity-50"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Información de precios */}
          {seleccionados.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio total de artículos:</span>
                <span className="font-semibold">${precioTotal.toFixed(2)}</span>
              </div>
              {precioPromocion > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Precio de promoción:</span>
                    <span className="font-semibold text-green-600">${precioPromocion.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ahorro:</span>
                    <span className="font-semibold text-red-600">
                      ${(precioTotal - precioPromocion).toFixed(2)} ({precioTotal > 0 ? (((precioTotal - precioPromocion) / precioTotal) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Imagen */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="block text-sm font-medium text-gray-700">Imagen de la promoción</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0])}
              disabled={isSubmitting}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:border-blue-500 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500">
              {file ? `Archivo seleccionado: ${file.name}` : "No se ha seleccionado ningún archivo"}
            </p>
            {promocion?.getUrl() && (
              <label className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={eliminarImagen}
                  onChange={(e) => setEliminarImagen(e.target.checked)}
                  disabled={isSubmitting}
                  className="text-blue-600 disabled:opacity-50"
                />
                <span className="text-sm text-gray-900">Eliminar imagen actual</span>
              </label>
            )}
          </div>

          {/* Botón Guardar */}
          <button
            onClick={handleGuardar}
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 mt-4 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadIcon />
            {isSubmitting ? (promocion ? "Actualizando..." : "Creando...") : (promocion ? "Actualizar Promoción" : "Crear Promoción")}
          </button>
        </div>
      </div>
    </div>
  )
}
