"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StoreIcon from "@mui/icons-material/Store"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { direccionServicio } from "../../services/direccionServicio"
import type { Direccion } from "../../models/Direccion"
import { useAuth0 } from "@auth0/auth0-react"

export type DeliveryType = "pickup" | "delivery"

interface DeliverySelectorProps {
  selectedType: DeliveryType
  onTypeChange: (type: DeliveryType) => void
  selectedAddress?: Direccion
  onAddressChange?: (address: Direccion) => void
  estimatedTime: number // tiempo en minutos
}

export const DeliverySelector = ({
  selectedType,
  onTypeChange,
  selectedAddress,
  onAddressChange,
  estimatedTime,
}: DeliverySelectorProps) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth0()
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  useEffect(() => {
    if (selectedType === "delivery" && isAuthenticated) {
      loadDirecciones()
    }
  }, [selectedType, isAuthenticated])

  const loadDirecciones = async () => {
    setIsLoadingAddresses(true)
    try {
      const direccionesData = await direccionServicio.obtenerDireccionesCliente()
      setDirecciones(direccionesData)
    } catch (error) {
      console.error("Error al cargar direcciones:", error)
      setDirecciones([])
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const getEstimatedTime = () => {
    const totalTime = selectedType === "pickup" ? estimatedTime : estimatedTime + 15
    return `${totalTime} min`
  }

  const formatAddress = (direccion: Direccion) => {
    let address = `${direccion.calle} ${direccion.numero}`
    if (direccion.piso) {
      address += `, Piso ${direccion.piso}`
    }
    if (direccion.dpto) {
      address += `, Dpto ${direccion.dpto}`
    }
    address += `, ${direccion.nombreDepartamento}`
    return address
  }

  const handleCreateNewAddress = () => {
    navigate("/address", { state: { openModal: true } })
  }

  const handleManageAddresses = () => {
    navigate("/address")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Tipo de Entrega</h3>

      {/* Opciones de entrega */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Retiro en local */}
        <button
          onClick={() => onTypeChange("pickup")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedType === "pickup"
              ? "border-yellow-500 bg-yellow-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedType === "pickup" ? "bg-yellow-100" : "bg-gray-100"}`}>
              <StoreIcon className={`w-6 h-6 ${selectedType === "pickup" ? "text-yellow-600" : "text-gray-500"}`} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Retiro en Local</p>
              <p className="text-sm text-gray-600">Sin costo adicional</p>
            </div>
          </div>
        </button>

        {/* Delivery */}
        <button
          onClick={() => onTypeChange("delivery")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedType === "delivery"
              ? "border-yellow-500 bg-yellow-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedType === "delivery" ? "bg-yellow-100" : "bg-gray-100"}`}>
              <LocalShippingIcon
                className={`w-6 h-6 ${selectedType === "delivery" ? "text-yellow-600" : "text-gray-500"}`}
              />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Delivery</p>
              <p className="text-sm text-gray-600">$2000 adicional</p>
            </div>
          </div>
        </button>
      </div>

      {/* Sección de direcciones (solo si es delivery) */}
      {selectedType === "delivery" && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
          {isLoadingAddresses ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando direcciones...</p>
            </div>
          ) : direcciones.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">No tienes direcciones guardadas</p>
              <button
                onClick={handleCreateNewAddress}
                className="text-yellow-600 hover:text-yellow-700 font-medium underline transition-colors"
              >
                Crear nueva dirección
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-medium text-gray-900">Selecciona una dirección de entrega:</p>
                <button
                  onClick={handleManageAddresses}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium underline transition-colors"
                >
                  Gestionar direcciones
                </button>
              </div>

              <div className="space-y-3">
                {direcciones.map((direccion) => (
                  <button
                    key={direccion.idDireccion}
                    onClick={() => onAddressChange?.(direccion)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedAddress?.idDireccion === direccion.idDireccion
                        ? "border-yellow-500 bg-yellow-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <LocationOnIcon
                        className={`w-5 h-5 mt-0.5 ${
                          selectedAddress?.idDireccion === direccion.idDireccion ? "text-yellow-600" : "text-gray-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{direccion.nombre}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{formatAddress(direccion)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tiempo estimado */}
      <div className="bg-[#242424] rounded-lg p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <AccessTimeIcon className="w-5 h-5 text-white" />
          <div>
            <p className="text-sm font-medium text-white">
              Tiempo estimado de {selectedType === "pickup" ? "preparación" : "entrega"}
            </p>
            <p className="text-lg font-bold text-white">{getEstimatedTime()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
