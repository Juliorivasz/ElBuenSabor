"use client"

import { Fastfood as ProductIcon } from "@mui/icons-material"
import { type FC, useCallback, useEffect, useState } from "react"
import { ProductsFilters } from "../../components/Admin/products/ProductsFilters"
import { ProductsTable } from "../../components/Admin/products/ProductsTable"
import { RecargarStockModal } from "../../components/Admin/products/RecargarStockModal"
import { UniversalProductDetailsModal } from "../../components/Admin/products/UniversalProductDetailsModal"
import { UniversalProductForm } from "../../components/Admin/products/UniversalProductForm"
import { PageHeader } from "../../components/shared/PageHeader"
import type { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto"
import type { InformacionArticuloNoElaboradoDto } from "../../models/dto/InformacionArticuloNoElaboradoDto"
import { type ProductType, useProductsStore } from "../../store/admin/useProductsStore"

// Define ProductUnion as a union of the two product DTOs
type ProductUnion = InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto

// Import or define selectors for categories, ingredients, and products
// Adjust the import path and hook names as needed for your project structure
export const Products: FC = () => {
  const {
    error,
    categories,
    ingredients,
    manufacturados,
    noElaborados,

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
  } = useProductsStore()

  const validCategories = categories || []
  const validIngredients = ingredients || []
  const validManufacturados = manufacturados || []
  const validNoElaborados = noElaborados || []

  const [activeTab, setActiveTab] = useState<ProductType>("manufacturados")
  const [showForm, setShowForm] = useState(false)
  const [showRecargarStockModal, setShowRecargarStockModal] = useState(false)
  const [editingManufacturado, setEditingManufacturado] = useState<InformacionArticuloManufacturadoDto | undefined>()
  const [editingNoElaborado, setEditingNoElaborado] = useState<InformacionArticuloNoElaboradoDto | undefined>()
  const [viewingManufacturado, setViewingManufacturado] = useState<InformacionArticuloManufacturadoDto | undefined>()
  const [viewingNoElaborado, setViewingNoElaborado] = useState<InformacionArticuloNoElaboradoDto | undefined>()

  // Estado para forzar re-render
  const [refreshKey, setRefreshKey] = useState(0)

  // Estado para productos filtrados
  const [productosFiltrados, setProductosFiltrados] = useState<ProductUnion[]>([])

  const [busqueda, setBusqueda] = useState("")
  const [filtroActual, setFiltroActual] = useState<"todas" | "activas" | "inactivas" | "padre" | "subcategorias">(
    "todas",
  )

  // Cargar productos al montar el componente
  useEffect(() => {
    if (validCategories.length === 0) {
      fetchCategories()
    }
    if (validIngredients.length === 0) {
      fetchIngredients()
    }
  }, [validCategories.length, validIngredients.length, fetchCategories, fetchIngredients])

  // Cargar productos según la pestaña activa
  useEffect(() => {
    const pagination = getPaginationByType(activeTab)

    if (activeTab === "manufacturados") {
      fetchManufacturadosPaginated(pagination.currentPage, pagination.itemsPerPage)
    } else {
      fetchNoElaboradosPaginated(pagination.currentPage, pagination.itemsPerPage) // Fixed "noManufacturados" to "noElaborados"
    }
  }, [activeTab, refreshKey]) // Agregar refreshKey como dependencia

  // Función para forzar actualización
  const forceUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  // Handlers para paginación con useCallback para evitar re-renders innecesarios
  const handlePageChange = useCallback(
    (page: number) => {
      if (activeTab === "manufacturados") {
        setManufacturadosPagination({ currentPage: page })
        fetchManufacturadosPaginated(page, getPaginationByType("manufacturados").itemsPerPage)
      } else {
        setNoElaboradosPagination({ currentPage: page })
        fetchNoElaboradosPaginated(page, getPaginationByType("noElaborados").itemsPerPage) // Fixed "noManufacturados" to "noElaborados"
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
  )

  const handleItemsPerPageChange = useCallback(
    (itemsPerPage: number) => {
      if (activeTab === "manufacturados") {
        setManufacturadosPagination({ itemsPerPage, currentPage: 1 })
        fetchManufacturadosPaginated(1, itemsPerPage)
      } else {
        setNoElaboradosPagination({ itemsPerPage, currentPage: 1 })
        fetchNoElaboradosPaginated(1, itemsPerPage)
      }
    },
    [
      activeTab,
      fetchManufacturadosPaginated,
      fetchNoElaboradosPaginated,
      setManufacturadosPagination,
      setNoElaboradosPagination,
    ],
  )

  // Handlers para acciones

  const handleEditManufacturado = useCallback((product: InformacionArticuloManufacturadoDto) => {
    setEditingManufacturado(product)
    setEditingNoElaborado(undefined)
    setShowForm(true)
  }, [])

  const handleEditNoElaborado = useCallback((product: InformacionArticuloNoElaboradoDto) => {
    setEditingNoElaborado(product)
    setEditingManufacturado(undefined)
    setShowForm(true)
  }, [])

  const handleViewDetailsManufacturado = useCallback((product: InformacionArticuloManufacturadoDto) => {
    setViewingManufacturado(product)
  }, [])

  const handleViewDetailsNoElaborado = useCallback((product: InformacionArticuloNoElaboradoDto) => {
    setViewingNoElaborado(product)
  }, [])

  const handleToggleStatusManufacturado = useCallback(
    async (product: InformacionArticuloManufacturadoDto) => {
      try {
        await toggleManufacturadoStatus(product.idArticulo) // Using direct property access instead of getter method
      } catch (error) {
        console.error("Error al cambiar estado del producto manufacturado:", error)
      }
    },
    [toggleManufacturadoStatus],
  )

  const handleToggleStatusNoElaborado = useCallback(
    async (product: InformacionArticuloNoElaboradoDto) => {
      try {
        await toggleNoElaboradoStatus(product.idArticulo) // Using direct property access instead of getter method
      } catch (error) {
        console.error("Error al cambiar estado del producto no elaborado:", error)
      }
    },
    [toggleNoElaboradoStatus],
  )

  const handleFormSubmit = useCallback(
    async (productData: ProductUnion, file?: File) => {
      try {
        if (activeTab === "manufacturados") {
          const manufacturadoData = productData as InformacionArticuloManufacturadoDto
          if (editingManufacturado) {
            const id = editingManufacturado.idArticulo // Using direct property access
            if (id !== undefined) {
              await updateManufacturado(id, manufacturadoData, file)
            } else {
              throw new Error("El ID del producto a editar es undefined.")
            }
          } else {
            await createManufacturado(manufacturadoData, file)
          }
          setEditingManufacturado(undefined)
        } else {
          const noElaboradoData = productData as InformacionArticuloNoElaboradoDto
          if (editingNoElaborado) {
            const id = editingNoElaborado.idArticulo // Using direct property access
            if (id !== undefined) {
              await updateNoElaborado(id, noElaboradoData, file)
            } else {
              throw new Error("El ID del producto a editar es undefined.")
            }
          } else {
            await createNoElaborado(noElaboradoData, file)
          }
          setEditingNoElaborado(undefined)
        }
        setShowForm(false)
        forceUpdate()
      } catch (error) {
        console.error("Error al guardar producto:", error)
      }
    },
    [
      activeTab,
      editingManufacturado,
      editingNoElaborado,
      updateManufacturado,
      createManufacturado,
      updateNoElaborado,
      createNoElaborado,
      forceUpdate,
    ],
  )

  // Updated universal form submit handler to include file parameter
  const handleUniversalFormSubmit = useCallback(
    async (productData: ProductUnion, file?: File) => {
      await handleFormSubmit(productData, file) // Using unified handler
    },
    [handleFormSubmit],
  )

  const handleFormCancel = useCallback(() => {
    setShowForm(false)
    setEditingManufacturado(undefined)
    setEditingNoElaborado(undefined)
  }, [])

  const handleRecargarStockSuccess = useCallback(() => {
    forceUpdate()
    setShowRecargarStockModal(false)
  }, [forceUpdate])

  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  const handleBusquedaChange = useCallback((nuevaBusqueda: string) => {
    setBusqueda(nuevaBusqueda)
  }, [])

  const handleFiltroChange = useCallback(
    (nuevoFiltro: "todas" | "activas" | "inactivas" | "padre" | "subcategorias") => {
      setFiltroActual(nuevoFiltro)
    },
    [],
  )

  // Filter handler
  const handleFiltrar = useCallback((productos: ProductUnion[]) => {
    setProductosFiltrados(productos)
  }, [])

  const currentProducts = activeTab === "manufacturados" ? validManufacturados : validNoElaborados
  const totalProductos = currentProducts.length
  const productosActivos = currentProducts.filter((p) => p.isDadoDeAlta()).length
  const productosInactivos = totalProductos - productosActivos
  const productosPadre = 0 // This would need to be calculated based on your business logic

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PageHeader
          title="Panel de Productos"
          subtitle="Gestiona los productos del restaurante"
          showBackButton={true}
          backTo="/admin/dashboard"
          icon={<ProductIcon className="text-black mr-3" fontSize="large" />}
          breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Productos" }]}
        />

        {/* Filtros */}
        <ProductsFilters
          subproductos={currentProducts}
          onFiltrar={handleFiltrar}
          totalProductos={totalProductos}
          productosActivos={productosActivos}
          productosInactivos={productosInactivos}
          productosPadre={productosPadre}
          filtroActual={filtroActual}
          onFiltroChange={handleFiltroChange}
          busqueda={busqueda}
          onBusquedaChange={handleBusquedaChange}
        />

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
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
                  className="mt-3 bg-red-100 px-2 py-1 rounded-md text-red-800 hover:bg-red-200 text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla Universal de Productos */}
        {activeTab === "manufacturados" ? (
          <ProductsTable
            key={`manufacturados-${refreshKey}`}
            products={productosFiltrados as InformacionArticuloManufacturadoDto[]}
            loading={getLoadingByType("manufacturados")}
            pagination={getPaginationByType("manufacturados")}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onEdit={handleEditManufacturado}
            onViewDetails={handleViewDetailsManufacturado}
            onToggleStatus={handleToggleStatusManufacturado}
            onRefresh={forceUpdate}
            title="Productos Manufacturados"
            emptyMessage="No hay productos manufacturados registrados"
            emptyDescription="Agrega tu primer producto manufacturado para comenzar"
          />
        ) : (
          <ProductsTable
            key={`noElaborados-${refreshKey}`}
            products={productosFiltrados as InformacionArticuloNoElaboradoDto[]}
            loading={getLoadingByType("noElaborados")}
            pagination={getPaginationByType("noElaborados")}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onEdit={handleEditNoElaborado}
            onViewDetails={handleViewDetailsNoElaborado}
            onToggleStatus={handleToggleStatusNoElaborado}
            onRefresh={forceUpdate}
            title="Productos No Elaborados"
            emptyMessage="No hay productos no elaborados registrados"
            emptyDescription="Agrega tu primer producto no elaborado para comenzar"
          />
        )}

        {/* Formulario Universal */}
        {showForm && (
          <UniversalProductForm
            product={activeTab === "manufacturados" ? editingManufacturado : editingNoElaborado}
            categories={validCategories}
            ingredients={validIngredients}
            onSubmit={handleUniversalFormSubmit}
            onCancel={handleFormCancel}
            loading={getLoadingByType(activeTab)}
            type={activeTab === "manufacturados" ? "manufacturado" : "noElaborado"}
          />
        )}

        {/* Modal de Recargar Stock */}
        <RecargarStockModal
          isOpen={showRecargarStockModal}
          onClose={() => setShowRecargarStockModal(false)}
          onSuccess={handleRecargarStockSuccess}
        />

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
  )
}
