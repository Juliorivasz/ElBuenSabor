"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useInsumosStore } from "../../../store/insumos/useInsumosStore"
import { InsumosTable } from "../../../components/insumos/InsumosTable"
import { InsumosFilters } from "../../../components/insumos/InsumosFilters"
import { InsumoForm } from "../../../components/insumos/insumoForm"
import type { InsumoAbmDTO } from "../../../models/dto/InsumoAbmDTO"
import { PageHeader } from "../../../components/shared/PageHeader"

export const Insumos: React.FC = () => {
  const {
    // Estado
    insumos,
    rubros,
    unidadesMedida,
    loading,
    error,

    // Paginación
    currentPage,
    pageSize,
    totalPages,
    totalElements,

    // Filtros
    searchTerm,
    estadoFilter,
    costoMinFilter,
    costoMaxFilter,

    // Acciones
    fetchInsumos,
    createNewInsumo,
    updateExistingInsumo,
    toggleStatus,
    fetchRubros,
    fetchUnidades,

    // Paginación
    setPage,
    setPageSize,

    // Filtros
    setSearchTerm,
    setEstadoFilter,
    setCostoFilter,
    clearFilters,
  } = useInsumosStore()

  const [showForm, setShowForm] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<InsumoAbmDTO | undefined>(undefined)

  // Cargar datos iniciales
  useEffect(() => {
    fetchInsumos()
    fetchRubros()
    fetchUnidades()
  }, [])

  const handleEdit = (insumo: InsumoAbmDTO) => {
    setEditingInsumo(insumo)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingInsumo(undefined)
  }

  const handleSubmitForm = async (insumoData: any) => {
    try {
      if (editingInsumo) {
        await updateExistingInsumo(editingInsumo.getIdArticuloInsumo(), insumoData)
      } else {
        await createNewInsumo(insumoData)
      }
      handleCloseForm()
    } catch (error) {
      // El error ya se maneja en el store
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <PageHeader title="INSUMOS" subtitle="Gestión de insumos del sistema" />

        {/* Botón Agregar */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Insumo
          </button>
        </div>

        {/* Filtros */}
        <InsumosFilters
          searchTerm={searchTerm}
          estadoFilter={estadoFilter}
          costoMinFilter={costoMinFilter}
          costoMaxFilter={costoMaxFilter}
          onSearchChange={setSearchTerm}
          onEstadoFilterChange={setEstadoFilter}
          onCostoFilterChange={setCostoFilter}
          onClearFilters={clearFilters}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla */}
        <InsumosTable
          insumos={insumos}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onEdit={handleEdit}
          onToggleStatus={toggleStatus}
        />

        {/* Modal de formulario */}
        {showForm && (
          <InsumoForm
            insumo={editingInsumo}
            rubros={rubros}
            unidadesMedida={unidadesMedida}
            onSubmit={handleSubmitForm}
            onCancel={handleCloseForm}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
