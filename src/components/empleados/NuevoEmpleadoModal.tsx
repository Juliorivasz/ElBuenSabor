"use client"

import { Close } from "@mui/icons-material"
import NuevoEmpleadoForm from "./NuevoEmpleadoForm"

interface NuevoEmpleadoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const NuevoEmpleadoModal = ({ isOpen, onClose, onSuccess }: NuevoEmpleadoModalProps) => {
  if (!isOpen) return null

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Nuevo Empleado</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <Close />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto">
            <NuevoEmpleadoForm onSuccess={handleSuccess} onCancel={onClose} showHeader={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
