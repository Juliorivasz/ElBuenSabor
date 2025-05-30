import { create } from "zustand";
import { fetchArticulosManufacturadosAbm } from "../../services/articuloManufacturadoServicio";
import { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto";
import { fetchCategoriasAbm } from "../../services/categoriaServicio";
import { CategoriaDTO } from "../../models/dto/CategoriaDTO";
import { fetchInsumoAbm } from "../../services/articulosInsumosServicio";
import { InsumoDTO } from "../../models/dto/InsumoDTO";

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface ProductsStore {
  products: InformacionArticuloManufacturadoDto[];
  categories: CategoriaDTO[];
  ingredients: InsumoDTO[];
  loading: boolean;
  error: string | null;

  // Agregar estado de paginación
  pagination: PaginationState;

  // Actions existentes...
  // fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchIngredients: () => Promise<void>;
  createProduct: (product: Omit<InformacionArticuloManufacturadoDto, "idArticulo">) => Promise<void>;
  updateProduct: (id: number, product: Partial<InformacionArticuloManufacturadoDto>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  toggleProductStatus: (id: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Nuevas actions para paginación
  setPagination: (pagination: Partial<PaginationState>) => void;
  fetchProductsPaginated: (page: number, itemsPerPage: number) => Promise<void>;
}

export const useProductsStore = create<ProductsStore>((set) => ({
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

  // Resto de actions existentes...
  fetchCategories: async () => {
    try {
      const categories = await fetchCategoriasAbm();
      console.log("Categorías cargadas desde servicio:", categories);
      set({ categories });
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      set({ error: (error as Error).message });
    }
  },

  fetchIngredients: async () => {
    try {
      const ingredientes = await fetchInsumoAbm();
      set({ ingredients: ingredientes });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = new InformacionArticuloManufacturadoDto(
        productData.getIdArticuloManufacturado(),
        productData.getNombre(),
        productData.getDescripcion(),
        productData.getReceta(),
        productData.getTiempoDeCocina(),
        productData.getImagenDto(),
        productData.getIdCategoria(),
        productData.getDadoDeAlta(),
        productData.getPrecioVenta(),
        productData.getDetalles(),
      );

      set((state) => {
        const newProducts = [...state.products, newProduct];
        const totalItems = newProducts.length;
        const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);

        return {
          products: newProducts,
          loading: false,
          pagination: {
            ...state.pagination,
            totalItems,
            totalPages,
          },
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        products: state.products.map((product) => {
          if (product.getIdArticuloManufacturado() === id) {
            if (updates.getNombre) product.setNombre(updates.getNombre());
            if (updates.getDescripcion) product.setDescripcion(updates.getDescripcion());
            if (updates.getReceta) product.setReceta(updates.getReceta());
            if (updates.getTiempoDeCocina) product.setTiempoDeCocina(updates.getTiempoDeCocina());
            if (updates.getImagenDto) product.setImagenDto(updates.getImagenDto());
            if (updates.getIdCategoria) product.setIdCategoria(updates.getIdCategoria());
            if (updates.getDadoDeAlta) product.setDadoDeAlta(updates.getDadoDeAlta());
            if (updates.getPrecioVenta) product.setPrecioVenta(updates.getPrecioVenta());
            if (updates.getDetalles) product.setDetalles(updates.getDetalles());
          }
          return product;
        }),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      set((state) => {
        const newProducts = state.products.filter((product) => product.getIdArticuloManufacturado() !== id);
        const totalItems = newProducts.length;
        const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);

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
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  toggleProductStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        products: state.products.map((product) => {
          if (product.getIdArticuloManufacturado() === id) {
            const currentStatus = product.getDadoDeAlta() ?? true;
            product.setDadoDeAlta(!currentStatus);
          }
          return product;
        }),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
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
    set({ loading: true, error: null });
    try {
      const allProducts = await fetchArticulosManufacturadosAbm(page - 1, itemsPerPage);

      // Simular paginación server-side
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = allProducts.content.slice(startIndex, endIndex);

      const totalItems = allProducts.content.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      set({
        products: paginatedProducts,
        loading: false,
        pagination: {
          currentPage: page,
          itemsPerPage,
          totalItems,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error al cargar productos paginados:", error);
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
