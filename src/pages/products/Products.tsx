"use client";

import { type FC, useEffect, useState, useCallback } from "react";
import { useProductsStore, type ProductType } from "../../store/admin/useProductsStore";
import { ProductsTable } from "../../components/Admin/products/ProductsTable";
import { UniversalProductForm } from "../../components/Admin/products/UniversalProductForm";
import { UniversalProductDetailsModal } from "../../components/Admin/products/UniversalProductDetailsModal";
import type { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto";
import type { InformacionArticuloNoElaboradoDto } from "../../models/dto/InformacionArticuloNoElaboradoDto";
import { Fastfood as ProductIcon } from "@mui/icons-material";
import { PageHeader } from "../../components/shared/PageHeader";
import { Plus } from "lucide-react";

// Tipo union para los productos
type ProductUnion = InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto;

export const Products: FC = () => {
  const {
    // Estados
    manufacturados,
    noElaborados,
    categories,
    ingredients,
    error,

    // Getters
    getPaginationByType,
    getLoadingByType,

    // Actions manufacturados
    fetchManufacturadosPaginated,
    createManufacturado,
    updateManufacturado,
    toggleManufacturadoStatus,
    setManufacturadosPagination,

    // Actions no elaborados
    fetchNoElaboradosPaginated,
    createNoElaborado,
    updateNoElaborado,
    toggleNoElaboradoStatus,
    setNoElaboradosPagination,

    // Actions compartidas
    fetchCategories,
    fetchIngredients,
    setError,
  } = useProductsStore();

  const [activeTab, setActiveTab] = useState<ProductType>("manufacturados");
  const [showForm, setShowForm] = useState(false);
  const [editingManufacturado, setEditingManufacturado] = useState<InformacionArticuloManufacturadoDto | undefined>();
  const [editingNoElaborado, setEditingNoElaborado] = useState<InformacionArticuloNoElaboradoDto | undefined>();
  const [viewingManufacturado, setViewingManufacturado] = useState<InformacionArticuloManufacturadoDto | undefined>();
  const [viewingNoElaborado, setViewingNoElaborado] = useState<InformacionArticuloNoElaboradoDto | undefined>();

  // Estado para forzar re-render
  const [refreshKey, setRefreshKey] = useState(0);

  // Validar que los datos sean arrays válidos
  const validManufacturados = Array.isArray(manufacturados) ? manufacturados : [];
  const validNoElaborados = Array.isArray(noElaborados) ? noElaborados : [];
  const validCategories = Array.isArray(categories) ? categories : [];
  const validIngredients = Array.isArray(ingredients) ? ingredients : [];

  // Cargar datos iniciales
  useEffect(() => {
    if (validCategories.length === 0) {
      fetchCategories();
    }
    if (validIngredients.length === 0) {
      fetchIngredients();
    }
  }, [validCategories.length, validIngredients.length, fetchCategories, fetchIngredients]);

  // Cargar productos según la pestaña activa
  useEffect(() => {
    const pagination = getPaginationByType(activeTab);

    if (activeTab === "manufacturados") {
      fetchManufacturadosPaginated(pagination.currentPage, pagination.itemsPerPage);
    } else {
      fetchNoElaboradosPaginated(pagination.currentPage, pagination.itemsPerPage);
    }
  }, [activeTab, refreshKey]); // Agregar refreshKey como dependencia

  // Función para forzar actualización
  const forceUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Handlers para paginación con useCallback para evitar re-renders innecesarios
  const handlePageChange = useCallback(
    (page: number) => {
      if (activeTab === "manufacturados") {
        setManufacturadosPagination({ currentPage: page });
        fetchManufacturadosPaginated(page, getPaginationByType("manufacturados").itemsPerPage);
      } else {
        setNoElaboradosPagination({ currentPage: page });
        fetchNoElaboradosPaginated(page, getPaginationByType("noManufacturados").itemsPerPage);
      }
    },
    [
      activeTab,
      fetchManufacturadosPaginated,
      fetchNoElaboradosPaginated,
      setManufacturadosPagination,
      setNoElaboradosPagination,
      getPaginationByType,
    ],
  );

  const handleItemsPerPageChange = useCallback(
    (itemsPerPage: number) => {
      if (activeTab === "manufacturados") {
        setManufacturadosPagination({ itemsPerPage, currentPage: 1 });
        fetchManufacturadosPaginated(1, itemsPerPage);
      } else {
        setNoElaboradosPagination({ itemsPerPage, currentPage: 1 });
        fetchNoElaboradosPaginated(1, itemsPerPage);
      }
    },
    [
      activeTab,
      fetchManufacturadosPaginated,
      fetchNoElaboradosPaginated,
      setManufacturadosPagination,
      setNoElaboradosPagination,
    ],
  );

  // Handlers para acciones
  const handleCreateNew = useCallback(() => {
    setEditingManufacturado(undefined);
    setEditingNoElaborado(undefined);
    setShowForm(true);
  }, []);

  const handleEditManufacturado = useCallback((product: InformacionArticuloManufacturadoDto) => {
    setEditingManufacturado(product);
    setEditingNoElaborado(undefined);
    setShowForm(true);
  }, []);

  const handleEditNoElaborado = useCallback((product: InformacionArticuloNoElaboradoDto) => {
    setEditingNoElaborado(product);
    setEditingManufacturado(undefined);
    setShowForm(true);
  }, []);

  const handleViewDetailsManufacturado = useCallback((product: InformacionArticuloManufacturadoDto) => {
    setViewingManufacturado(product);
  }, []);

  const handleViewDetailsNoElaborado = useCallback((product: InformacionArticuloNoElaboradoDto) => {
    setViewingNoElaborado(product);
  }, []);

  const handleToggleStatusManufacturado = useCallback(
    async (product: InformacionArticuloManufacturadoDto) => {
      try {
        await toggleManufacturadoStatus(product.getidArticulo());
      } catch (error) {
        console.error("Error al cambiar estado del producto manufacturado:", error);
      }
    },
    [toggleManufacturadoStatus],
  );

  const handleToggleStatusNoElaborado = useCallback(
    async (product: InformacionArticuloNoElaboradoDto) => {
      try {
        await toggleNoElaboradoStatus(product.getIdArticulo());
      } catch (error) {
        console.error("Error al cambiar estado del producto no elaborado:", error);
      }
    },
    [toggleNoElaboradoStatus],
  );

  // Updated handlers to include file parameter
  const handleFormSubmitManufacturado = useCallback(
    async (productData: InformacionArticuloManufacturadoDto, file?: File) => {
      try {
        if (editingManufacturado) {
          const id = editingManufacturado.getidArticulo();
          if (id !== undefined) {
            await updateManufacturado(id, productData, file);
          } else {
            throw new Error("El ID del producto a editar es undefined.");
          }
        } else {
          await createManufacturado(productData, file);
        }
        setShowForm(false);
        setEditingManufacturado(undefined);
        // Forzar actualización de la UI
        forceUpdate();
      } catch (error) {
        console.error("Error al guardar producto manufacturado:", error);
      }
    },
    [editingManufacturado, updateManufacturado, createManufacturado, forceUpdate],
  );

  const handleFormSubmitNoElaborado = useCallback(
    async (productData: InformacionArticuloNoElaboradoDto, file?: File) => {
      try {
        if (editingNoElaborado) {
          const id = editingNoElaborado.getIdArticulo();
          if (id !== undefined) {
            await updateNoElaborado(id, productData, file);
          } else {
            throw new Error("El ID del producto a editar es undefined.");
          }
        } else {
          await createNoElaborado(productData, file);
        }
        setShowForm(false);
        setEditingNoElaborado(undefined);
        // Forzar actualización de la UI
        forceUpdate();
      } catch (error) {
        console.error("Error al guardar producto no elaborado:", error);
      }
    },
    [editingNoElaborado, updateNoElaborado, createNoElaborado, forceUpdate],
  );

  // Updated universal form submit handler to include file parameter
  const handleUniversalFormSubmit = useCallback(
    async (productData: ProductUnion, file?: File) => {
      if (activeTab === "manufacturados") {
        await handleFormSubmitManufacturado(productData as InformacionArticuloManufacturadoDto, file);
      } else {
        await handleFormSubmitNoElaborado(productData as InformacionArticuloNoElaboradoDto, file);
      }
    },
    [activeTab, handleFormSubmitManufacturado, handleFormSubmitNoElaborado],
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingManufacturado(undefined);
    setEditingNoElaborado(undefined);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const handleTabChange = useCallback((tab: ProductType) => {
    setActiveTab(tab);
    // Resetear estados de edición y visualización
    setEditingManufacturado(undefined);
    setEditingNoElaborado(undefined);
    setViewingManufacturado(undefined);
    setViewingNoElaborado(undefined);
    setShowForm(false);
  }, []);

  // Obtener datos según la pestaña activa
  const currentPagination = getPaginationByType(activeTab);
  const currentLoading = getLoadingByType(activeTab);

  // Obtener el producto que se está editando según la pestaña activa
  const currentEditingProduct = activeTab === "manufacturados" ? editingManufacturado : editingNoElaborado;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader
          title="Productos"
          subtitle="Gestiona los productos del restaurante"
          showBackButton={true}
          backTo="admin/dashboard"
          icon={
            <ProductIcon
              className="text-black mr-3"
              fontSize="large"
            />
          }
          breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Productos" }]}
        />
        <div className="flex justify-end items-center">
          <button
            onClick={handleCreateNew}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
            <Plus className="h-4 w-4 mr-2" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange("manufacturados")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "manufacturados"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Productos Manufacturados
              {validManufacturados.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {validManufacturados.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange("noManufacturados")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "noManufacturados"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Productos No Elaborados
              {validNoElaborados.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {validNoElaborados.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={clearError}
                  className="mt-3 bg-red-100 px-2 py-1 rounded-md text-red-800 hover:bg-red-200 text-sm">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla Universal de Productos */}
        {activeTab === "manufacturados" ? (
          <ProductsTable
            key={`manufacturados-${refreshKey}`} // Key para forzar re-render
            products={validManufacturados}
            loading={currentLoading}
            pagination={currentPagination}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onEdit={handleEditManufacturado}
            onViewDetails={handleViewDetailsManufacturado}
            onToggleStatus={handleToggleStatusManufacturado}
            title="Productos Manufacturados"
            emptyMessage="No hay productos manufacturados registrados"
            emptyDescription="Agrega tu primer producto manufacturado para comenzar"
          />
        ) : (
          <ProductsTable
            key={`noElaborados-${refreshKey}`} // Key para forzar re-render
            products={validNoElaborados}
            loading={currentLoading}
            pagination={currentPagination}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onEdit={handleEditNoElaborado}
            onViewDetails={handleViewDetailsNoElaborado}
            onToggleStatus={handleToggleStatusNoElaborado}
            title="Productos No Elaborados"
            emptyMessage="No hay productos no elaborados registrados"
            emptyDescription="Agrega tu primer producto no elaborado para comenzar"
          />
        )}

        {/* Formulario Universal */}
        {showForm && (
          <UniversalProductForm
            product={currentEditingProduct}
            categories={validCategories}
            ingredients={validIngredients}
            onSubmit={handleUniversalFormSubmit}
            onCancel={handleFormCancel}
            loading={currentLoading}
            type={activeTab === "manufacturados" ? "manufacturado" : "noElaborado"}
          />
        )}

        {/* Modal Universal de Detalles */}
        {viewingManufacturado && (
          <UniversalProductDetailsModal
            product={viewingManufacturado}
            onClose={() => setViewingManufacturado(undefined)}
            type="manufacturado"
          />
        )}

        {viewingNoElaborado && (
          <UniversalProductDetailsModal
            product={viewingNoElaborado}
            onClose={() => setViewingNoElaborado(undefined)}
            type="noElaborado"
          />
        )}
      </div>
    </div>
  );
};
