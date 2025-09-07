"use client"

import { useState, useEffect, useMemo } from "react"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { fetchInsumosLista, recargarStock } from "../../services/insumoAbmServicio"
import type { InsumoDTO } from "../../models/dto/InsumoDTO"
import { NotificationService } from "../../utils/notifications"

interface RecargarStockModalProps {
  onClose: () => void
  onSuccess: () => void
}

interface InsumoRecarga {
  idArticuloInsumo: number
  nombre: string
  cantidad: number
  unidadDeMedida: string
}

export const RecargarStockModal = ({ onClose, onSuccess }: RecargarStockModalProps) => {
  const [insumos, setInsumos] = useState<InsumoDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInsumoId, setSelectedInsumoId] = useState<number>(0)
  const [cantidad, setCantidad] = useState<string>("")
  const [insumosRecarga, setInsumosRecarga] = useState<InsumoRecarga[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingCantidad, setEditingCantidad] = useState<string>("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Cargar lista de insumos al montar el componente
  useEffect(() => {
    const loadInsumos = async () => {
      try {
        setLoading(true)
        const data = await fetchInsumosLista()
        // Ordenar alfabéticamente por nombre
        const insumosOrdenados = data.sort((a, b) =>
          a.getNombre().toLowerCase().localeCompare(b.getNombre().toLowerCase()),
        )
        setInsumos(insumosOrdenados)
      } catch (error) {
        NotificationService.error("Error al cargar la lista de insumos")
      } finally {
        setLoading(false)
      }
    }

    loadInsumos()
  }, [])

  // Filtrar insumos disponibles (no agregados a la lista y que coincidan con la búsqueda)
  const insumosDisponibles = useMemo(() => {
    const insumosAgregadosIds = insumosRecarga.map((item) => item.idArticuloInsumo)
    return insumos.filter((insumo) => {
      const noAgregado = !insumosAgregadosIds.includes(insumo.getIdArticuloInsumo())
      const coincideBusqueda = insumo.getNombre().toLowerCase().includes(searchTerm.toLowerCase())
      return noAgregado && coincideBusqueda
    })
  }, [insumos, insumosRecarga, searchTerm])

  // Obtener insumo seleccionado
  const insumoSeleccionado = useMemo(() => {
    return insumos.find((insumo) => insumo.getIdArticuloInsumo() === selectedInsumoId)
  }, [insumos, selectedInsumoId])

  const handleAgregarInsumo = () => {
    if (selectedInsumoId === 0) {
      NotificationService.error("Debe seleccionar un insumo")
      return
    }

    const cantidadNum = Number.parseFloat(cantidad)
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      NotificationService.error("Debe ingresar una cantidad válida mayor a 0")
      return
    }

    const insumo = insumos.find((i) => i.getIdArticuloInsumo() === selectedInsumoId)
    if (!insumo) return

    const nuevoInsumoRecarga: InsumoRecarga = {
      idArticuloInsumo: selectedInsumoId,
      nombre: insumo.getNombre(),
      cantidad: cantidadNum,
      unidadDeMedida: insumo.getUnidadDeMedida(),
    }

    setInsumosRecarga((prev) => [...prev, nuevoInsumoRecarga])
    setSelectedInsumoId(0)
    setCantidad("")
    setSearchTerm("")
    setShowSearchResults(false)
  }

  const handleEliminarInsumo = (index: number) => {
    setInsumosRecarga((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEditarInsumo = (index: number) => {
    setEditingIndex(index)
    setEditingCantidad(insumosRecarga[index].cantidad.toString())
  }

  const handleGuardarEdicion = () => {
    if (editingIndex === null) return

    const cantidadNum = Number.parseFloat(editingCantidad)
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      NotificationService.error("Debe ingresar una cantidad válida mayor a 0")
      return
    }

    setInsumosRecarga((prev) =>
      prev.map((item, index) => (index === editingIndex ? { ...item, cantidad: cantidadNum } : item)),
    )
    setEditingIndex(null)
    setEditingCantidad("")
  }

  const handleCancelarEdicion = () => {
    setEditingIndex(null)
    setEditingCantidad("")
  }

  const handleConfirmar = async () => {
    if (insumosRecarga.length === 0) {
      NotificationService.error("Debe agregar al menos un insumo para recargar")
      return
    }

    try {
      setLoading(true)
      const lista = insumosRecarga.map((item) => ({
        idArticuloInsumo: item.idArticuloInsumo,
        cantidad: item.cantidad,
      }))

      await recargarStock({ lista })
      onSuccess()
    } catch (error) {
      NotificationService.error("Error al recargar el stock")
    } finally {
      setLoading(false)
    }
  }

  const handleCantidadChange = (value: string) => {
    // Solo permitir números y punto decimal
    const regex = /^\d*\.?\d*$/
    if (regex.test(value) || value === "") {
      setCantidad(value)
    }
  }

  const handleEditingCantidadChange = (value: string) => {
    // Solo permitir números y punto decimal
    const regex = /^\d*\.?\d*$/
    if (regex.test(value) || value === "") {
      setEditingCantidad(value)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setShowSearchResults(value.length > 0)
    setSelectedInsumoId(0) // Reset selection when searching
  }

  const handleSelectInsumoFromSearch = (insumo: InsumoDTO) => {
    setSelectedInsumoId(insumo.getIdArticuloInsumo())
    setSearchTerm(insumo.getNombre())
    setShowSearchResults(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recargar Stock</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 text-black">
          {/* Buscador con resultados */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Insumo</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSearchResults(searchTerm.length > 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escriba el nombre del insumo..."
              disabled={loading}
            />

            {/* Resultados de búsqueda */}
            {showSearchResults && insumosDisponibles.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {insumosDisponibles.map((insumo) => (
                  <button
                    key={insumo.getIdArticuloInsumo()}
                    onClick={() => handleSelectInsumoFromSearch(insumo)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{insumo.getNombre()}</div>
                    <div className="text-sm text-gray-500">{insumo.getUnidadDeMedida()}</div>
                  </button>
                ))}
              </div>
            )}

            {showSearchResults && searchTerm.length > 0 && insumosDisponibles.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                <div className="text-gray-500 text-sm">No se encontraron insumos</div>
              </div>
            )}
          </div>

          {/* Select de insumos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Insumo</label>
            <select
              value={selectedInsumoId}
              onChange={(e) => {
                const id = Number(e.target.value)
                setSelectedInsumoId(id)
                if (id > 0) {
                  const insumo = insumos.find((i) => i.getIdArticuloInsumo() === id)
                  if (insumo) {
                    setSearchTerm(insumo.getNombre())
                  }
                } else {
                  setSearchTerm("")
                }
                setShowSearchResults(false)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value={0}>Seleccione un insumo</option>
              {insumosDisponibles.map((insumo) => (
                <option key={insumo.getIdArticuloInsumo()} value={insumo.getIdArticuloInsumo()}>
                  {insumo.getNombre()}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad y unidad de medida */}
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="text"
                value={cantidad}
                onChange={(e) => handleCantidadChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                disabled={loading}
              />
            </div>
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 min-w-[100px]">
                {insumoSeleccionado?.getUnidadDeMedida() || "-"}
              </div>
            </div>
            <button
              onClick={handleAgregarInsumo}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 hover:cursor-pointer transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Listo
            </button>
          </div>

          {/* Lista de insumos agregados */}
          {insumosRecarga.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Insumos a Recargar</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {insumosRecarga.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{item.nombre}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {editingIndex === index ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingCantidad}
                            onChange={(e) => handleEditingCantidadChange(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">{item.unidadDeMedida}</span>
                          <button
                            onClick={handleGuardarEdicion}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            <span className="material-symbols-outlined">
                              check
                            </span>
                          </button>
                          <button
                            onClick={handleCancelarEdicion}
                            className="text-red-600 hover:text-gray-800 text-sm font-medium"
                          >
                            <span className="material-symbols-outlined">
                              close
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">
                            {item.cantidad} {item.unidadDeMedida}
                          </span>
                          <button
                            onClick={() => handleEditarInsumo(index)}
                            className="text-gray-600 hover:cursor-pointer p-1"
                            title="Editar cantidad"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleEliminarInsumo(index)}
                            className="text-gray-600 hover:cursor-pointer p-1"
                            title="Eliminar"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || insumosRecarga.length === 0}
            >
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
