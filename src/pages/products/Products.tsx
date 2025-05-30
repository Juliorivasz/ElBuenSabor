"use client";

import React, { useEffect, useState } from "react";
import { useProductsStore } from "../../store/admin/useProductsStore";
import { ProductsTable } from "../../components/Admin/products/ProductsTable";
import { ProductForm } from "../../components/Admin/products/ProductForm";
import { ProductDetailsModal } from "../../components/Admin/products/ProductDetailsModal";
import { DeleteConfirmModal } from "../../components/Admin/products/DeleteConfirmModal";
import type { ArticuloManufacturadoDTO } from "../../models/dto/ArticuloManufacturadoDTO";
import { NuevoArticuloManufacturadoDto } from "../../models/dto/NuevoArticuloManufacturadoDto";
import { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto";

export const Products: React.FC = () => {
  const {
    products,
    categories,
    ingredients,
    loading,
    error,
    fetchProductsPaginated,
    fetchCategories,
    fetchIngredients,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    setError,
    pagination,
    setPagination,
  } = useProductsStore();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InformacionArticuloManufacturadoDto | undefined>();
  const [deletingProduct, setDeletingProduct] = useState<InformacionArticuloManufacturadoDto | undefined>();
  const [viewingProduct, setViewingProduct] = useState<InformacionArticuloManufacturadoDto | undefined>();

  useEffect(() => {
    fetchProductsPaginated(pagination.currentPage, pagination.itemsPerPage);
    fetchCategories();
    fetchIngredients();
  }, [fetchProductsPaginated, fetchCategories, fetchIngredients, pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (page: number) => {
    setPagination({ currentPage: page });
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination({ itemsPerPage, currentPage: 1 });
  };

  const handleCreateNew = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEdit = (product: InformacionArticuloManufacturadoDto) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: InformacionArticuloManufacturadoDto) => {
    setDeletingProduct(product);
  };

  const handleViewDetails = (product: InformacionArticuloManufacturadoDto) => {
    setViewingProduct(product);
  };

  const handleToggleStatus = async (product: ArticuloManufacturadoDTO) => {
    try {
      await toggleProductStatus(product.getIdArticuloManufacturado());
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error);
    }
  };

  const handleFormSubmit = async (productData: ArticuloManufacturadoDTO) => {
    try {
      if (editingProduct) {
        const id = editingProduct.getIdArticuloManufacturado();
        if (id !== undefined) {
          await updateProduct(id, productData);
        } else {
          throw new Error("El ID del producto a editar es undefined.");
        }
      } else {
        await createProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(undefined);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (deletingProduct) {
      try {
        await deleteProduct(deletingProduct.getIdArticuloManufacturado());
        setDeletingProduct(undefined);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeletingProduct(undefined);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos Manufacturados</h1>
            <p className="mt-2 text-gray-600">Gestiona los productos elaborados del restaurante</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="mt-3 bg-red-100 px-2 py-1 rounded-md text-red-800 hover:bg-red-200 text-sm">
              Cerrar
            </button>
          </div>
        )}

        {/* Tabla */}
        <ProductsTable
          products={products}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
        />

        {/* Formulario */}
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

        {/* Modal Detalles */}
        {viewingProduct && (
          <ProductDetailsModal
            product={viewingProduct}
            onClose={() => setViewingProduct(undefined)}
          />
        )}

        {/* Modal Confirmación */}
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
  );
};
