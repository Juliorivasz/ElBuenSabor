"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Search, Edit, Trash2 } from "lucide-react"
import { interceptorsApiClient } from "../../../services/interceptors/axios.interceptors"
import { NotificationService } from "../../../utils/notifications"

interface ProductoNoElaborado {
  idArticulo: number
  nombre: string
}

interface ProductoRecarga {
  idArticulo: number
  nombre: string
  cantidad: number
}

interface RecargarStockModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const RecargarStockModal: React.FC<RecargarStockModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [productos, setProductos] = useState<ProductoNoElaborado[]>([])
  const [productosRecarga, setProductosRecarga] = useState<ProductoRecarga[]>([])
  const [selectedProductId, setSelectedProductId] = useState<number | "">("")
  const [cantidad, setCantidad] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingCantidad, setEditingCantidad] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      fetchProductos()
    }
  }, [isOpen])

  const fetchProductos = async () => {
    try {
      const response = await interceptorsApiClient.get("/articuloNoElaborado/lista")
      setProductos(response.data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      NotificationService.error("Error al cargar la lista de productos")
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const notInRecarga = !productosRecarga.some((p) => p.idArticulo === producto.idArticulo)
    return matchesSearch && notInRecarga
  })

  const handleAddProduct = () => {
    if (selectedProductId === "" || !cantidad || Number.parseInt(cantidad) <= 0) {
      NotificationService.error("Por favor selecciona un producto y una cantidad válida")
      return
    }

    const selectedProduct = productos.find((p) => p.idArticulo === selectedProductId)
    if (!selectedProduct) return

    const newProductoRecarga: ProductoRecarga = {
      idArticulo: selectedProduct.idArticulo,
      nombre: selectedProduct.nombre,
      cantidad: Number.parseInt(cantidad),
    }

    setProductosRecarga([...productosRecarga, newProductoRecarga])
    setSelectedProductId("")
    setCantidad("")
  }

  const handleRemoveProduct = (index: number) => {
    setProductosRecarga(productosRecarga.filter((_, i) => i !== index))
  }

  const handleEditProduct = (index: number) => {
    setEditingIndex(index)
    setEditingCantidad(productosRecarga[index].cantidad.toString())
  }

  const handleSaveEdit = (index: number) => {
    if (!editingCantidad || Number.parseInt(editingCantidad) <= 0) {
      NotificationService.error("Por favor ingresa una cantidad válida")
      return
    }

    const updatedProductos = [...productosRecarga]
    updatedProductos[index].cantidad = Number.parseInt(editingCantidad)
    setProductosRecarga(updatedProductos)
    setEditingIndex(null)
    setEditingCantidad("")
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingCantidad("")
  }

  const handleConfirm = async () => {
    if (productosRecarga.length === 0) {
      NotificationService.error("Agrega al menos un producto para recargar")
      return
    }

    setLoading(true)
    try {
      const payload = {
        recargas: productosRecarga.map((p) => ({
          idArticulo: p.idArticulo,
          cantidad: p.cantidad,
        })),
      }

      await interceptorsApiClient.put("/articuloNoElaborado/recargaStock", payload)
      NotificationService.success("Stock recargado exitosamente")
      onSuccess()
      handleClose()
    } catch (error) {
      console.error("Error al recargar stock:", error)
      NotificationService.error("Error al recargar el stock")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setProductos([])
    setProductosRecarga([])
    setSelectedProductId("")
    setCantidad("")
    setSearchTerm("")
    setEditingIndex(null)
    setEditingCantidad("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recargar Stock</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-1 overflow-y-auto max-h-[calc(90vh-140px)]">          
          {/* Select de productos */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Producto</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value === "" ? "" : Number.parseInt(e.target.value))}
              className="text-gray-700 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un producto</option>
              {filteredProductos.map((producto) => (
                <option key={producto.idArticulo} value={producto.idArticulo}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Input de cantidad */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad a recargar</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ingresa la cantidad"
              className="text-gray-700 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botón Listo */}
          <button
            onClick={handleAddProduct}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-6"
          >
            Listo
          </button>

          {/* Lista de productos agregados */}
          {productosRecarga.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Productos a recargar:</h3>
              <div className="space-y-2">
                {productosRecarga.map((producto, index) => (
                  <div
                    key={`${producto.idArticulo}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{producto.nombre}</span>
                      <span className="text-gray-600 ml-2">
                        - Cantidad:
                        {editingIndex === index ? (
                          <input
                            type="number"
                            min="1"
                            value={editingCantidad}
                            onChange={(e) => setEditingCantidad(e.target.value)}
                            className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEdit(index)
                              } else if (e.key === "Escape") {
                                handleCancelEdit()
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span className="ml-1 font-semibold">{producto.cantidad}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingIndex === index ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(index)}
                            className="text-green-600 hover:text-green-800 text-sm px-2 py-1"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-800 text-sm px-2 py-1"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditProduct(index)}
                            className="text-black hover:text-gray-700 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveProduct(index)}
                            className="text-black hover:text-gray-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || productosRecarga.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Procesando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  )
}
