import {
  Edit as EditIcon,
  LocalOffer as OfferIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import type React from "react"
import type { Promocion } from "../../models/Promocion"

interface PromocionCardProps {
  promocion: Promocion
  onEdit: (promocion: Promocion) => void
  onToggleStatus: (idPromocion: number) => void
}

export const PromocionCard: React.FC<PromocionCardProps> = ({ promocion, onEdit, onToggleStatus }) => {
  const formatTime = (time: Date | string | null | undefined) => {
    if (!time) return "No especificado"
    
    if (typeof time === "string") {
      // Si ya está en formato HH:MM, devolverlo tal como está
      if (/^\d{2}:\d{2}$/.test(time)) {
        return time
      }
      // Si es otra cadena, tratar de parsearla
      const parsed = new Date(`1970-01-01T${time}`);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    }
    
    if (time instanceof Date && !isNaN(time.getTime())) {
      return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    
    return "No especificado"
  }

  const detalles = promocion.getDetalles() || []
  const precioPromocion = promocion.getPrecioPromocion() ?? 0
  
  // Calcular precio total de los artículos individuales
  const calcularPrecioTotal = () => {
    return detalles.reduce((total, detalle) => {
      // Si el detalle tiene precio, usarlo; sino, usar un precio por defecto o 0
      const precio = detalle.precio || 0
      return total + precio * detalle.cantidad
    }, 0)
  }

  const precioTotal = calcularPrecioTotal()
  const descuento = precioTotal > 0 ? ((precioTotal - precioPromocion) / precioTotal) * 100 : 0
  
  // Verificar si hay artículos inactivos
  const tieneArticulosInactivos = detalles.some(detalle => detalle.activo === false)

  const handleToggleClick = () => {
    onToggleStatus(promocion.getIdPromocion())
  }

  return (
    <div className="relative w-160 h-auto bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Imagen - Full width */}
      <div className="w-full h-100 object-cover">
        <img
          src={promocion.getUrl() || "/placeholder.svg?height=256&width=400&query=promocion"}
          alt={promocion.getTitulo()}
          className={`w-full h-full object-cover transition-all duration-300 ${
            !promocion.getActivo() ? "filter grayscale" : ""
          }`}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=256&width=400"
          }}
        />

        {/* Toggle Switch - Positioned over image */}
        <div className="absolute top-4 right-4 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2">
          <span className={`text-sm font-medium ${promocion.getActivo() ? "text-green-600" : "text-red-600"}`}>
            {promocion.getActivo() ? "Activa" : "Inactiva"}
          </span>

          {/* Indicador de artículo inactivo */}
          {tieneArticulosInactivos && (
            <div className="relative group">
              <WarningIcon className="text-orange-500" fontSize="small" />
              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                Uno o más artículos están dados de baja
              </div>
            </div>
          )}

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={promocion.getActivo()}
              onChange={handleToggleClick}
              className="sr-only peer cursor-pointer"
            />
            <div className="w-11 h-6 bg-red-300 cursor-pointer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-300"></div>
          </label>
        </div>
      </div>

      {/* Contenido - Below image */}
      <div className="pr-6 pl-6 pt-3 pb-3">
        <div className="flex-1">
          {/* Header con título */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-800">{promocion.getTitulo()}</h3>
              {tieneArticulosInactivos && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  <WarningIcon fontSize="small" />
                  <span>Artículos inactivos</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{promocion.getDescripcion()}</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <OfferIcon className="text-gray-800" fontSize="small" />
              <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">Artículos incluidos</span>
            </div>
            <div className="space-y-1">
              {detalles.length > 0 ? (
                detalles.map((articulo, index) => (
                  <div key={articulo.idArticulo || index} className="flex justify-between items-center text-sm">
                    <span className={`${articulo.activo === false ? "text-orange-600" : "text-gray-700"}`}>
                      {articulo.nombreArticulo} x{articulo.cantidad}
                    </span>
                    {articulo.precio && (
                      <span className="text-gray-500">${(articulo.precio * articulo.cantidad).toFixed(2)}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No hay artículos asignados</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Precio Total</div>
              <div className="text-lg font-semibold text-gray-800 line-through">
                ${precioTotal > 0 ? precioTotal.toFixed(2) : "0.00"}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Precio Promoción</div>
              <div className="text-lg font-semibold text-green-600">${precioPromocion.toFixed(2)}</div>
            </div>
            {descuento > 0 && (
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {descuento.toFixed(0)}% de descuento
                </span>
              </div>
            )}
          </div>

          {/* Información de horarios */}
          <div className="grid grid-cols-2 gap-4 mb-1">
            {/* Horario Inicio */}
            <div className="rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <ScheduleIcon className="text-gray-600" fontSize="small" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Inicio</span>
              </div>
              <p className="text-sm font-semibold text-black">{formatTime(promocion.getHorarioInicio())}</p>
            </div>

            {/* Horario Fin */}
            <div className="rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <ScheduleIcon className="text-gray-600" fontSize="small" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fin</span>
              </div>
              <p className="text-sm font-semibold text-black">{formatTime(promocion.getHorarioFin())}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-100">
          <div></div>
          <button
            onClick={() => onEdit(promocion)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
          >
            <EditIcon fontSize="small" />
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}