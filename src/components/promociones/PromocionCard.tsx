"use client"

import type React from "react"
import { Edit as EditIcon, Schedule as ScheduleIcon, LocalOffer as OfferIcon } from "@mui/icons-material"
import type { Promocion } from "../../models/Promocion"

interface PromocionCardProps {
  promocion: Promocion
  onEdit: (promocion: Promocion) => void
  onToggleStatus: (idPromocion: number) => void
}

export const PromocionCard: React.FC<PromocionCardProps> = ({ promocion, onEdit, onToggleStatus }) => {
  const formatTime = (time: string) => {
    if (!time) return "No especificado"
    return time
  }

  const formatDiscount = (discount: number) => {
    return `${(discount * 100).toFixed(0)}%`
  }

  return (
    <div className=" relative w-160 h-155 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
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
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={promocion.getActivo()}
              onChange={() => onToggleStatus(promocion.getIdPromocion())}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-red-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-300"></div>
          </label>
        </div>
      </div>

      {/* Contenido - Below image */}
      <div className="pr-6 pl-6 pt-3 pb-3 ">
        <div className="flex-1">
          {/* Header con título */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{promocion.getTitulo()}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{promocion.getDescripcion()}</p>
          </div>

          {/* Información de la promoción */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-1">
            {/* Artículo */}
            <div className="rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <OfferIcon className="text-gray-800" fontSize="small" />
                <span className="text-xs font-medium text-gray-800 uppercase tracking-wide">Artículo</span>
              </div>
              <p className="text-sm font-semibold text-black">{promocion.getNombreArticulo()}</p>
            </div>

            {/* Descuento */}
            <div className="rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-800 font-bold text-lg">%</span>
                <span className="text-xs font-medium text-gray-800 uppercase tracking-wide">Descuento</span>
              </div>
              <p className="text-sm font-semibold text-black">{formatDiscount(promocion.getDescuento())}</p>
            </div>

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

        {/* Botón de editar */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
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
