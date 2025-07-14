"use client";

import { useEffect, useState } from "react";
import { CategoriaDetailsModal } from "../../../components/categorias/CategoriaDetailsModal";
import { CategoriaForm } from "../../../components/categorias/CategoriaForm";
import { CategoriasFilters } from "../../../components/categorias/CategoriasFilters";
import { CategoriasTable } from "../../../components/categorias/CategoriasTable";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { CategoriaExtendidaDto } from "../../../models/dto/CategoriaExtendidaDto";
import type { NuevaCategoriaDto } from "../../../models/dto/NuevaCategoriaDto";
import { useCategoriasStore } from "../../../store/categorias/useCategoriasStore";
import { Category as CategoryIcon } from "@mui/icons-material";

export const Categorias = () => {
  const {
    categorias,
    loading,
    error,
    filtroActual,
    busqueda,
    fetchCategorias,
    crearCategoria,
    actualizarCategoria,
    toggleEstadoCategoria,
    setFiltro,
    setBusqueda,
    setCurrentPage,
    setItemsPerPage,
    getCategoriasPaginadas,
    getEstadisticas,
    getPaginationInfo,
  } = useCategoriasStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaExtendidaDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const estadisticas = getEstadisticas();
  const paginationInfo = getPaginationInfo();
  const categoriasPaginadas = getCategoriasPaginadas();

  const handleNuevaCategoria = () => {
    setSelectedCategoria(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditCategoria = (categoria: CategoriaExtendidaDto) => {
    setSelectedCategoria(categoria);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleViewDetails = (categoria: CategoriaExtendidaDto) => {
    setSelectedCategoria(categoria);
    setShowDetails(true);
  };

  const handleToggleStatus = async (categoria: CategoriaExtendidaDto) => {
    try {
      await toggleEstadoCategoria(categoria.getIdCategoria());
    } catch (error) {
      // El error ya se maneja en el store con notificaciones
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleSubmitForm = async (categoria: NuevaCategoriaDto, archivo?: File) => {
    try {
      if (isEditing && selectedCategoria) {
        await actualizarCategoria(selectedCategoria.getIdCategoria(), categoria, archivo);
      } else {
        await crearCategoria(categoria, archivo);
      }
      setShowForm(false);
      setSelectedCategoria(null);
      setIsEditing(false);
    } catch (error) {
      // El error ya se maneja en el store con notificaciones
      console.error("Error al guardar categoría:", error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedCategoria(null);
    setIsEditing(false);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedCategoria(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader title="Gestión de Categorías" />
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-red-900 mb-2">Error al cargar categorías</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={fetchCategorias}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader
          title="Panel de Categorías"
          subtitle="Gestiona las categorías de productos"
          showBackButton={true}
          backTo="admin/dashboard"
          icon={
            <CategoryIcon
              className="text-black mr-3"
              fontSize="large"
            />
          }
          breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Categorias" }]}
        />

        {/* Filtros */}
        <CategoriasFilters
          totalCategorias={estadisticas.total}
          categoriasActivas={estadisticas.activas}
          categoriasInactivas={estadisticas.inactivas}
          categoriasPadre={estadisticas.padre}
          subcategorias={estadisticas.subcategorias}
          filtroActual={filtroActual}
          onFiltroChange={setFiltro}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
        />

        {/* Tabla */}
        <CategoriasTable
          categorias={categoriasPaginadas}
          loading={loading}
          pagination={paginationInfo}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          onEdit={handleEditCategoria}
          onViewDetails={handleViewDetails}
          onToggleStatus={handleToggleStatus}
          onNuevaCategoria={handleNuevaCategoria}
          filtroActual={filtroActual}
        />

        {/* Modal de formulario */}
        {showForm && (
          <CategoriaForm
            categoria={isEditing ? selectedCategoria ?? undefined : undefined}
            categorias={categorias}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={loading}
          />
        )}

        {/* Modal de detalles */}
        {showDetails && selectedCategoria && (
          <CategoriaDetailsModal
            categoria={selectedCategoria}
            categorias={categorias}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </div>
  );
};
