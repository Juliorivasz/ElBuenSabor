import { create } from "zustand";
import {
  actualizarArticuloManufacturado,
  altaBajaArticuloManufacturado,
  crearArticuloManufacturado,
  fetchArticulosManufacturadosAbm,
} from "../../services/articuloManufacturadoServicio";
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
        0,
        productData.getNombre(),
        productData.getDescripcion(),
        productData.getReceta(),
        productData.getTiempoDeCocina(),
        productData.getImagenDto(),
        productData.getIdCategoria(),
        productData.getNombreCategoria(),
        productData.getDadoDeAlta(),
        productData.getPrecioVenta(),
        productData.getDetalles(),
      );

      const savedProduct = await crearArticuloManufacturado(newProduct);

      set((state) => {
        const newProducts = [...state.products, savedProduct];
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
      const updatedProduct = await actualizarArticuloManufacturado(id, updates as InformacionArticuloManufacturadoDto);
      console.log("Producto actualizado recibido:", updatedProduct);

      set((state) => ({
        products: state.products.map((product) =>
          product.getIdArticuloManufacturado() === id ? updatedProduct : product,
        ),
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
      // Primero obtenemos el producto actual
      const currentProduct = useProductsStore
        .getState()
        .products.find((product) => product.getIdArticuloManufacturado() === id);

      if (!currentProduct) {
        throw new Error("Producto no encontrado");
      }

      const currentStatus = currentProduct.getDadoDeAlta() ?? true;
      const newStatus = !currentStatus;

      // Llamada al backend para cambiar el estado
      await altaBajaArticuloManufacturado(id, newStatus);

      // Actualizamos el estado local si la petición fue exitosa
      set((state) => ({
        products: state.products.map((product) => {
          if (product.getIdArticuloManufacturado() === id) {
            product.setDadoDeAlta(newStatus);
          }
          return product;
        }),
        loading: false,
      }));
    } catch (error) {
      console.error("Error en toggleProductStatus:", error);
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

      set({
        products: allProducts.content, // usar directamente
        loading: false,
        pagination: {
          currentPage: page,
          itemsPerPage,
          totalItems: allProducts.totalElements, // usa lo que venga del backend
          totalPages: allProducts.totalPages, // idem
        },
      });
    } catch (error) {
      console.error("Error al cargar productos paginados:", error);
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
