import { create } from "zustand"
import { ArticuloManufacturado } from "../../models/ArticuloManufacturado"
import { Categoria } from "../../models/Categoria"
import { ArticuloInsumo } from "../../models/ArticuloInsumo"

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface ProductsStore {
  products: ArticuloManufacturado[]
  categories: Categoria[]
  ingredients: ArticuloInsumo[]
  loading: boolean
  error: string | null

  // Agregar estado de paginación
  pagination: PaginationState

  // Actions existentes...
  fetchProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchIngredients: () => Promise<void>
  createProduct: (product: Omit<ArticuloManufacturado, "idArticulo">) => Promise<void>
  updateProduct: (id: number, product: Partial<ArticuloManufacturado>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  toggleProductStatus: (id: number) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Nuevas actions para paginación
  setPagination: (pagination: Partial<PaginationState>) => void
  fetchProductsPaginated: (page: number, itemsPerPage: number) => Promise<void>
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  categories: [],
  ingredients: [],
  loading: false,
  error: null,

  // Estado inicial de paginación
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },

  // Actions existentes permanecen igual...
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const { fetchArticulosManufacturados } = await import("../../services/articuloManufacturadoServicio")
      const products = await fetchArticulosManufacturados()

      console.log("Productos cargados desde servicio:", products)

      // Actualizar paginación
      const totalItems = products.length
      const { itemsPerPage } = get().pagination
      const totalPages = Math.ceil(totalItems / itemsPerPage)

      set({
        products,
        loading: false,
        pagination: {
          ...get().pagination,
          totalItems,
          totalPages,
        },
      })
    } catch (error) {
      console.error("Error al cargar productos:", error)
      set({ error: (error as Error).message, loading: false })
    }
  },

  // Resto de actions existentes...
  fetchCategories: async () => {
    try {
      const { fetchCategorias } = await import("../../services/categoriaServicio")
      const categories = await fetchCategorias()
      console.log("Categorías cargadas desde servicio:", categories)
      set({ categories })
    } catch (error) {
      console.error("Error al cargar categorías:", error)
      set({ error: (error as Error).message })
    }
  },

  fetchIngredients: async () => {
    try {
      const mockIngredients = [
        { id: 1, nombre: "Carne de res", stock: 100 },
        { id: 2, nombre: "Pan de hamburguesa", stock: 50 },
        { id: 3, nombre: "Lechuga", stock: 30 },
        { id: 4, nombre: "Tomate", stock: 25 },
        { id: 5, nombre: "Queso cheddar", stock: 40 },
      ]
      set({ ingredients: mockIngredients as any })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null })
    try {
      const newId = Math.max(...get().products.map((p) => p.getIdArticulo())) + 1
      const newProduct = new ArticuloManufacturado(
        newId,
        productData.getNombre(),
        productData.getDescripcion(),
        productData.getPrecioVenta(),
        productData.getReceta(),
        productData.getTiempoDeCocina(),
        productData.getDetalles(),
        productData.getCategoria(),
        productData.getUrlImagen(),
      )

      set((state) => {
        const newProducts = [...state.products, newProduct]
        const totalItems = newProducts.length
        const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage)

        return {
          products: newProducts,
          loading: false,
          pagination: {
            ...state.pagination,
            totalItems,
            totalPages,
          },
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      set((state) => ({
        products: state.products.map((product) => {
          if (product.getIdArticulo() === id) {
            if (updates.getNombre) product.setNombre(updates.getNombre())
            if (updates.getDescripcion) product.setDescripcion(updates.getDescripcion())
            if (updates.getPrecioVenta) product.setPrecioVenta(updates.getPrecioVenta())
            if (updates.getReceta) product.setReceta(updates.getReceta())
            if (updates.getTiempoDeCocina) product.setTiempoDeCocina(updates.getTiempoDeCocina())
            if (updates.getUrlImagen) product.setUrlImagen(updates.getUrlImagen())
            if (updates.getCategoria) product.setCategoria(updates.getCategoria())
            if (updates.getDetalles) product.setDetalles(updates.getDetalles())
          }
          return product
        }),
        loading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null })
    try {
      set((state) => {
        const newProducts = state.products.filter((product) => product.getIdArticulo() !== id)
        const totalItems = newProducts.length
        const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage)

        return {
          products: newProducts,
          loading: false,
          pagination: {
            ...state.pagination,
            totalItems,
            totalPages,
            // Ajustar página actual si es necesario
            currentPage:
              state.pagination.currentPage > totalPages ? Math.max(1, totalPages) : state.pagination.currentPage,
          },
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  toggleProductStatus: async (id) => {
    set({ loading: true, error: null })
    try {
      set((state) => ({
        products: state.products.map((product) => {
          if (product.getIdArticulo() === id) {
            const currentStatus = (product as any).esParaElaborar ?? true
            ;(product as any).esParaElaborar = !currentStatus
          }
          return product
        }),
        loading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Nuevas actions para paginación
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),

  // Preparado para server-side pagination
  fetchProductsPaginated: async (page, itemsPerPage) => {
    set({ loading: true, error: null })
    try {
      // Por ahora usa la misma lógica, pero está preparado para server-side
      const { fetchArticulosManufacturados } = await import("../../services/articuloManufacturadoServicio")
      const allProducts = await fetchArticulosManufacturados()

      // Simular paginación server-side
      const startIndex = (page - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedProducts = allProducts.slice(startIndex, endIndex)

      const totalItems = allProducts.length
      const totalPages = Math.ceil(totalItems / itemsPerPage)

      set({
        products: paginatedProducts,
        loading: false,
        pagination: {
          currentPage: page,
          itemsPerPage,
          totalItems,
          totalPages,
        },
      })
    } catch (error) {
      console.error("Error al cargar productos paginados:", error)
      set({ error: (error as Error).message, loading: false })
    }
  },
}))
