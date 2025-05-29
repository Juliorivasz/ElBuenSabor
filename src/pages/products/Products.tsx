"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useProductsStore } from "../../store/admin/useProductsStore"
import { ProductsTable } from "../../components/Admin/products/ProductsTable"
import { ProductForm } from "../../components/Admin/products/ProductForm"
import { ProductDetailsModal } from "../../components/Admin/products/ProductDetailsModal"
import { DeleteConfirmModal } from "../../components/Admin/products/DeleteConfirmModal"
import type { ArticuloManufacturado } from "../../models/ArticuloManufacturado"

export const Products: React.FC = () => {
  const {
    products,
    categories,
    ingredients,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    fetchIngredients,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    setError,
  } = useProductsStore()

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ArticuloManufacturado | undefined>()
  const [deletingProduct, setDeletingProduct] = useState<ArticuloManufacturado | undefined>()
  const [viewingProduct, setViewingProduct] = useState<ArticuloManufacturado | undefined>()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchIngredients()
  }, [fetchProducts, fetchCategories, fetchIngredients])

  const handleCreateNew = () => {
    setEditingProduct(undefined)
    setShowForm(true)
  }

  const handleEdit = (product: ArticuloManufacturado) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = (product: ArticuloManufacturado) => {
    setDeletingProduct(product)
  }

  const handleViewDetails = (product: ArticuloManufacturado) => {
    setViewingProduct(product)
  }

  const handleToggleStatus = async (product: ArticuloManufacturado) => {
    try {
      await toggleProductStatus(product.getIdArticulo())
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error)
    }
  }

  const handleFormSubmit = async (productData: ArticuloManufacturado) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.getIdArticulo(), productData)
      } else {
        await createProduct(productData)
      }
      setShowForm(false)
      setEditingProduct(undefined)
    } catch (error) {
      console.error("Error al guardar producto:", error)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProduct(undefined)
  }

  const handleDeleteConfirm = async () => {
    if (deletingProduct) {
      try {
        await deleteProduct(deletingProduct.getIdArticulo())
        setDeletingProduct(undefined)
      } catch (error) {
        console.error("Error al eliminar producto:", error)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeletingProduct(undefined)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Productos Manufacturados</h1>
              <p className="mt-2 text-gray-600">Gestiona los platos y productos elaborados del restaurante</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearError}
                    className="bg-red-100 px-2 py-1 rounded-md text-red-800 hover:bg-red-200 text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Productos</dt>
                    <dd className="text-lg font-medium text-gray-900">{products.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Categorías</dt>
                    <dd className="text-lg font-medium text-gray-900">{categories.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Ingredientes</dt>
                    <dd className="text-lg font-medium text-gray-900">{ingredients.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
          loading={loading}
        />

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            ingredients={ingredients}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
          />
        )}

        {/* Product Details Modal */}
        {viewingProduct && (
          <ProductDetailsModal product={viewingProduct} onClose={() => setViewingProduct(undefined)} />
        )}

        {/* Delete Confirmation Modal */}
        {deletingProduct && (
          <DeleteConfirmModal
            product={deletingProduct}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
