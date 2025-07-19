"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CloseOutlined } from "@mui/icons-material"
import type { Direccion } from "../../models/Direccion"
import type { Departamento } from "../../models/Departamento"
import { DireccionDTO } from "../../models/dto/DireccionDTO"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (direccion: DireccionDTO) => void
  direccion?: Direccion | null
  departamentos: Departamento[]
  isLoading?: boolean
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  direccion,
  departamentos,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<DireccionDTO>(new DireccionDTO())
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (direccion) {
      setFormData(
        new DireccionDTO(
          direccion.nombre,
          direccion.calle,
          direccion.numero,
          direccion.piso,
          direccion.dpto,
          direccion.idDepartamento,
        ),
      )
    } else {
      setFormData(new DireccionDTO())
    }
    setErrors({})
  }, [direccion, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }
    if (!formData.calle.trim()) {
      newErrors.calle = "La calle es obligatoria"
    }
    if (!formData.numero.trim()) {
      newErrors.numero = "El número es obligatorio"
    }
    if (!formData.idDepartamento || formData.idDepartamento === 0) {
      newErrors.idDepartamento = "Debe seleccionar un departamento"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: keyof DireccionDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {direccion ? "Editar Dirección" : "Nueva Dirección"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <CloseOutlined />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Casa, Trabajo, etc."
                  disabled={isLoading}
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calle *</label>
                <input
                  type="text"
                  value={formData.calle}
                  onChange={(e) => handleInputChange("calle", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.calle ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nombre de la calle"
                  disabled={isLoading}
                />
                {errors.calle && <p className="text-red-500 text-xs mt-1">{errors.calle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.numero ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Número de la dirección"
                  disabled={isLoading}
                />
                {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
                  <input
                    type="text"
                    value={formData.piso}
                    onChange={(e) => handleInputChange("piso", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Opcional"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dpto</label>
                  <input
                    type="text"
                    value={formData.dpto}
                    onChange={(e) => handleInputChange("dpto", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Opcional"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                <select
                  value={formData.idDepartamento}
                  onChange={(e) => handleInputChange("idDepartamento", Number.parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.idDepartamento ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  <option value={0}>Seleccionar departamento</option>
                  {departamentos.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nombre}
                    </option>
                  ))}
                </select>
                {errors.idDepartamento && <p className="text-red-500 text-xs mt-1">{errors.idDepartamento}</p>}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
