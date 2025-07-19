"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { InsumoAbmDTO } from "../../models/dto/InsumoAbmDTO"
import { NuevoInsumoDTO } from "../../models/dto/NuevoInsumoDTO"
import type { RubroInsumoDTO } from "../../models/dto/RubroInsumoDTO"
import type { UnidadMedidaDTO } from "../../models/dto/UnidadMedidaDTO"

interface InsumoFormProps {
  insumo?: InsumoAbmDTO
  rubros: RubroInsumoDTO[]
  unidadesMedida: UnidadMedidaDTO[]
  onSubmit: (insumo: NuevoInsumoDTO) => Promise<void>
  onCancel: () => void
  loading: boolean
}

interface FormData {
  nombre: string
  stockActual: number
  stockMinimo: number
  stockMaximo: number
  dadoDeAlta: boolean
  idUnidadDeMedida: number
  idRubroInsumo: number
  costo: number
}

export const InsumoForm: React.FC<InsumoFormProps> = ({
  insumo,
  rubros,
  unidadesMedida,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    stockActual: 0,
    stockMinimo: 0,
    stockMaximo: 0,
    dadoDeAlta: true,
    idUnidadDeMedida: 0,
    idRubroInsumo: 0,
    costo: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar datos del insumo para edición
  useEffect(() => {
    if (insumo) {
      setFormData({
        nombre: insumo.getNombre(),
        stockActual: insumo.getStockActual(),
        stockMinimo: insumo.getStockMinimo(),
        stockMaximo: insumo.getStockMaximo(),
        dadoDeAlta: insumo.isDadoDeAlta(),
        idUnidadDeMedida: insumo.getIdUnidadDeMedida(),
        idRubroInsumo: insumo.getIdRubro(),
        costo: insumo.getCosto() ?? 0,
      })
    }
  }, [insumo])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (formData.costo <= 0) {
      newErrors.costo = "El costo debe ser mayor a 0"
    }

    if (formData.stockActual < 0) {
      newErrors.stockActual = "El stock actual no puede ser negativo"
    }

    if (formData.stockMinimo < 0) {
      newErrors.stockMinimo = "El stock mínimo no puede ser negativo"
    }

    if (formData.stockMaximo <= 0) {
      newErrors.stockMaximo = "El stock máximo debe ser mayor a 0"
    }

    if (formData.stockMinimo >= formData.stockMaximo) {
      newErrors.stockMinimo = "El stock mínimo debe ser menor al stock máximo"
    }

    if (formData.idRubroInsumo === 0) {
      newErrors.idRubroInsumo = "Debe seleccionar un rubro"
    }

    if (formData.idUnidadDeMedida === 0) {
      newErrors.idUnidadDeMedida = "Debe seleccionar una unidad de medida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const nuevoInsumo = new NuevoInsumoDTO(
      formData.nombre,
      formData.stockActual,
      formData.stockMinimo,
      formData.stockMaximo,
      formData.dadoDeAlta,
      formData.idUnidadDeMedida,
      formData.idRubroInsumo,
      formData.costo,
    )

    try {
      await onSubmit(nuevoInsumo)
    } catch (error) {
      // El error ya se maneja en el store
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const title = insumo ? "Editar Insumo" : "Nuevo Insumo"

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nombre del insumo"
                  disabled={loading}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Costo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costo === 0 ? "" : formData.costo}
                  onChange={(e) => handleInputChange("costo", Number.parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.costo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.costo && <p className="text-red-500 text-sm mt-1">{errors.costo}</p>}
              </div>

              {/* Rubro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Rubro *</label>
                <select
                  value={formData.idRubroInsumo}
                  onChange={(e) => handleInputChange("idRubroInsumo", Number.parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.idRubroInsumo ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value={0}>Seleccionar rubro</option>
                  {rubros.map((rubro) => (
                    <option key={rubro.getIdRubroInsumo()} value={rubro.getIdRubroInsumo()}>
                      {rubro.getNombre()}
                    </option>
                  ))}
                </select>
                {errors.idRubroInsumo && <p className="text-red-500 text-sm mt-1">{errors.idRubroInsumo}</p>}
              </div>

              {/* Unidad de Medida */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Unidad de Medida *</label>
                <select
                  value={formData.idUnidadDeMedida}
                  onChange={(e) => handleInputChange("idUnidadDeMedida", Number.parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.idUnidadDeMedida ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value={0}>Seleccionar unidad</option>
                  {unidadesMedida.map((unidad) => (
                    <option key={unidad.getIdUnidadDeMedida()} value={unidad.getIdUnidadDeMedida()}>
                      {unidad.getDenominacion()}
                    </option>
                  ))}
                </select>
                {errors.idUnidadDeMedida && <p className="text-red-500 text-sm mt-1">{errors.idUnidadDeMedida}</p>}
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              {/* Stock Actual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Actual</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.stockActual === 0 ? "" : formData.stockActual}
                  onChange={(e) => handleInputChange("stockActual", Number.parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.stockActual ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.stockActual && <p className="text-red-500 text-sm mt-1">{errors.stockActual}</p>}
              </div>

              {/* Stock Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.stockMinimo === 0 ? "" : formData.stockMinimo}
                  onChange={(e) => handleInputChange("stockMinimo", Number.parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.stockMinimo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.stockMinimo && <p className="text-red-500 text-sm mt-1">{errors.stockMinimo}</p>}
              </div>

              {/* Stock Máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Máximo *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.stockMaximo === 0 ? "" : formData.stockMaximo}
                  onChange={(e) => handleInputChange("stockMaximo", Number.parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.stockMaximo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.stockMaximo && <p className="text-red-500 text-sm mt-1">{errors.stockMaximo}</p>}
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dadoDeAlta"
                    checked={formData.dadoDeAlta}
                    onChange={(e) => handleInputChange("dadoDeAlta", e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="dadoDeAlta" className="ml-2 text-sm text-gray-700">
                    Activo
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Guardando..." : insumo ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
