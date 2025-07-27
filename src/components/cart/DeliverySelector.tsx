"use client"

import { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import StoreIcon from "@mui/icons-material/Store"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import EditIcon from "@mui/icons-material/Edit"
import { direccionServicio } from "../../services/direccionServicio"
import type { Direccion } from "../../models/Direccion"

export type DeliveryType = "pickup" | "delivery"

interface DeliverySelectorProps {
  selectedType: DeliveryType
  onTypeChange: (type: DeliveryType) => void
  onChangeAddress?: () => void
  selectedAddressId?: number
  onAddressSelect?: (addressId: number | undefined) => void
}

export const DeliverySelector = ({
  selectedType,
  onTypeChange,
  onChangeAddress,
  selectedAddressId,
  onAddressSelect,
}: DeliverySelectorProps) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddresses, setShowAddresses] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar direcciones del usuario cuando se selecciona delivery
  useEffect(() => {
    if (selectedType === "delivery" && isAuthenticated) {
      cargarDirecciones()
    }
  }, [selectedType, isAuthenticated])

  const cargarDirecciones = async () => {
    try {
      setLoading(true)
      setError(null)
      await getAccessTokenSilently() // Obtener token para autenticación
      const direccionesUsuario = await direccionServicio.obtenerDireccionesCliente()
      setDirecciones(direccionesUsuario)

      // Si no hay dirección seleccionada y hay direcciones disponibles, seleccionar la primera
      if (!selectedAddressId && direccionesUsuario.length > 0) {
        onAddressSelect?.(direccionesUsuario[0].idDireccion)
      }
    } catch (error) {
      console.error("Error al cargar direcciones:", error)
      setError("Error al cargar las direcciones")
    } finally {
      setLoading(false)
    }
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

  const getSelectedAddress = () => {
    return direcciones.find((dir) => dir.idDireccion === selectedAddressId)
  }

  const getEstimatedTime = () => {
    return selectedType === "pickup" ? "30-40 min" : "45-60 min"
  }

  const handleTypeChange = (type: DeliveryType) => {
    onTypeChange(type)
    if (type === "pickup") {
      // Limpiar selección de dirección si cambia a pickup
      onAddressSelect?.(undefined)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Tipo de Entrega</h3>

      {/* Opciones de entrega */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Retiro en local */}
        <button
          onClick={() => handleTypeChange("pickup")}
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
          onClick={() => handleTypeChange("delivery")}
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
              <p className="text-sm text-gray-600">Envío a domicilio</p>
            </div>
          </div>
        </button>
      </div>

      {/* Selección de dirección (solo si es delivery) */}
      {selectedType === "delivery" && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LocationOnIcon className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-gray-900">Dirección de entrega</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onChangeAddress}
                className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors px-3 py-1 rounded-md hover:bg-yellow-50"
                title="Gestionar direcciones"
              >
                <EditIcon sx={{ fontSize: 16 }} />
                Gestionar
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
              <span className="ml-2 text-sm text-gray-600">Cargando direcciones...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button onClick={cargarDirecciones} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                Reintentar
              </button>
            </div>
          ) : direcciones.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-2">No tienes direcciones guardadas</p>
              <button onClick={onChangeAddress} className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                Agregar dirección
              </button>
            </div>
          ) : (
            <div>
              {/* Dirección seleccionada */}
              {selectedAddressId && getSelectedAddress() && (
                <div className="mb-3">
                  <div
                    className="bg-white rounded-lg p-3 border border-yellow-200 cursor-pointer hover:border-yellow-300 transition-colors"
                    onClick={() => setShowAddresses(!showAddresses)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{getSelectedAddress()?.nombre}</p>
                        <p className="text-sm text-gray-600">{formatAddress(getSelectedAddress()!)}</p>
                      </div>
                      {direcciones.length > 1 && (
                        <div className="flex items-center text-yellow-600">
                          {showAddresses ? (
                            <ExpandLessIcon sx={{ fontSize: 20 }} />
                          ) : (
                            <ExpandMoreIcon sx={{ fontSize: 20 }} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de direcciones (expandible si hay más de una) */}
              {showAddresses && direcciones.length > 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">Selecciona una dirección:</p>
                  {direcciones
                    .filter((dir) => dir.idDireccion !== selectedAddressId)
                    .map((direccion) => (
                      <button
                        key={direccion.idDireccion}
                        onClick={() => {
                          onAddressSelect?.(direccion.idDireccion)
                          setShowAddresses(false)
                        }}
                        className="w-full text-left bg-white rounded-lg p-3 border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
                      >
                        <p className="font-medium text-gray-900 text-sm">{direccion.nombre}</p>
                        <p className="text-sm text-gray-600">{formatAddress(direccion)}</p>
                      </button>
                    ))}
                </div>
              )}

              {/* Mensaje si no hay dirección seleccionada */}
              {!selectedAddressId && (
                <div className="text-center py-2">
                  <p className="text-sm text-red-600">Selecciona una dirección para continuar</p>
                </div>
              )}
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
