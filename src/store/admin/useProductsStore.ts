import { create } from "zustand";
import type { CategoriaDTO } from "../../models/dto/CategoriaDTO";
import type { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto";
import type { InformacionArticuloNoElaboradoDto } from "../../models/dto/InformacionArticuloNoElaboradoDto";
import type { InsumoDTO } from "../../models/dto/InsumoDTO";
import {
  actualizarArticuloManufacturado,
  crearArticuloManufacturado,
  fetchArticulosManufacturadosAbm,
} from "../../services/articuloManufacturadoServicio";
import {
  actualizarArticuloNoElaborado,
  crearArticuloNoElaborado,
  fetchArticulosNoElaboradosAbm,
} from "../../services/articuloNoElaboradoServicio";
import { articuloServicio } from "../../services/articuloServicio";
import { fetchInsumoAbm } from "../../services/articulosInsumosServicio";
import { fetchCategoriasAbm } from "../../services/categoriaServicio";
import { mapperInformacionArticuloNoElaboradoDtoToNuevoArticuloNoElaboradoDto } from "../../utils/mapper/articuloNoElaboradoMapper";
import { mapperInformacionArticuloManufacturadoDtoToNuevoArticuloManufacturadoDto } from "../../utils/mapper/articulosManufacturadosMapper";
import { useAuth0Store } from "../auth/useAuth0Store";

export type ProductType = "manufacturados" | "noManufacturados";

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// Helper function to wait for token to be ready
const waitForToken = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkToken = () => {
      const { isTokenReady } = useAuth0Store.getState();
      if (isTokenReady) {
        resolve();
      } else {
        setTimeout(checkToken, 100); // Check every 100ms
      }
    };
    checkToken();
  });
};

interface ProductsStore {
  // Estados para productos manufacturados
  manufacturados: InformacionArticuloManufacturadoDto[];
  manufacturadosPagination: PaginationState;
  manufacturadosLoading: boolean;

  // Estados para productos no elaborados
  noElaborados: InformacionArticuloNoElaboradoDto[];
  noElaboradosPagination: PaginationState;
  noElaboradosLoading: boolean;

  // Estados compartidos
  categories: CategoriaDTO[];
  ingredients: InsumoDTO[];
  error: string | null;

  // Actions para productos manufacturados
  fetchManufacturadosPaginated: (page: number, itemsPerPage: number) => Promise<void>;
  createManufacturado: (product: InformacionArticuloManufacturadoDto, file?: File) => Promise<void>;
  updateManufacturado: (id: number, product: InformacionArticuloManufacturadoDto, file?: File) => Promise<void>;
  toggleManufacturadoStatus: (id: number) => Promise<void>;
  setManufacturadosPagination: (pagination: Partial<PaginationState>) => void;

  // Actions para productos no elaborados
  fetchNoElaboradosPaginated: (page: number, itemsPerPage: number) => Promise<void>;
  createNoElaborado: (product: InformacionArticuloNoElaboradoDto, file?: File) => Promise<void>;
  updateNoElaborado: (id: number, product: InformacionArticuloNoElaboradoDto, file?: File) => Promise<void>;
  toggleNoElaboradoStatus: (id: number) => Promise<void>;
  setNoElaboradosPagination: (pagination: Partial<PaginationState>) => void;

  // Actions compartidas
  fetchCategories: () => Promise<void>;
  fetchIngredients: () => Promise<void>;
  setError: (error: string | null) => void;

  // Getters para compatibilidad con el código existente
  getProductsByType: (type: ProductType) => InformacionArticuloManufacturadoDto[] | InformacionArticuloNoElaboradoDto[];
  getPaginationByType: (type: ProductType) => PaginationState;
  getLoadingByType: (type: ProductType) => boolean;

  // Nuevas funciones para forzar actualización
  forceRefreshManufacturados: () => Promise<void>;
  forceRefreshNoElaborados: () => Promise<void>;
}

const initialPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
};

export const useProductsStore = create<ProductsStore>((set, get) => ({
  // Estados iniciales
  manufacturados: [],
  manufacturadosPagination: { ...initialPagination },
  manufacturadosLoading: false,

  noElaborados: [],
  noElaboradosPagination: { ...initialPagination },
  noElaboradosLoading: false,

  categories: [],
  ingredients: [],
  error: null,

  // Actions para productos manufacturados
  fetchManufacturadosPaginated: async (page, itemsPerPage) => {
    // Wait for token to be ready before making the request
    await waitForToken();

    set({ manufacturadosLoading: true, error: null });
    try {
      const response = await fetchArticulosManufacturadosAbm(page - 1, itemsPerPage);
      set({
        manufacturados: Array.isArray(response.content) ? response.content : [],
        manufacturadosLoading: false,
        manufacturadosPagination: {
          currentPage: page,
          itemsPerPage,
          totalItems: response.page.totalElements,
          totalPages: response.page.totalPages,
        },
      });
    } catch (error) {
      console.error("Error al cargar productos manufacturados:", error);
      set({ error: (error as Error).message, manufacturadosLoading: false });
    }
  },

  createManufacturado: async (productData, file) => {
    await waitForToken();

    set({ manufacturadosLoading: true, error: null });
    try {
      const newProduct = mapperInformacionArticuloManufacturadoDtoToNuevoArticuloManufacturadoDto(productData);
      console.log("Creando producto manufacturado con imagen:", file ? "Sí" : "No");
      await crearArticuloManufacturado(newProduct, file);

      // Forzar actualización inmediata
      await get().forceRefreshManufacturados();
    } catch (error) {
      console.error("Error al crear producto manufacturado:", error);
      set({ error: (error as Error).message, manufacturadosLoading: false });
      throw error;
    }
  },

  updateManufacturado: async (id, product, file) => {
    await waitForToken();

    set({ manufacturadosLoading: true, error: null });
    try {
      console.log("Actualizando producto manufacturado con imagen:", file ? "Sí" : "No");
      console.log(product);
      await actualizarArticuloManufacturado(id, product, file);

      // Forzar actualización inmediata
      await get().forceRefreshManufacturados();
    } catch (error) {
      console.error("Error al actualizar producto manufacturado:", error);
      set({ error: (error as Error).message, manufacturadosLoading: false });
      throw error;
    }
  },

  toggleManufacturadoStatus: async (id) => {
    await waitForToken();

    try {
      const currentProduct = get().manufacturados.find((product) => product.getidArticulo() === id);
      if (!currentProduct) {
        throw new Error("Producto no encontrado");
      }

      const newStatus = !currentProduct.isDadoDeAlta();

      // Actualización optimista: cambiar el estado local inmediatamente
      set((state) => ({
        manufacturados: state.manufacturados.map((product) => {
          if (product.getidArticulo() === id) {
            // Crear una copia del producto con el nuevo estado
            const updatedProduct = Object.create(Object.getPrototypeOf(product));
            Object.assign(updatedProduct, product);
            // Actualizar el estado usando el setter del DTO
            updatedProduct.setDadoDeAlta(newStatus);
            return updatedProduct;
          }
          return product;
        }),
      }));

      // Realizar la operación en el backend
      await articuloServicio.altaBajaArticulo(id);
    } catch (error) {
      console.error("Error en toggleManufacturadoStatus:", error);
      set({ error: (error as Error).message });

      // En caso de error, revertir el cambio optimista recargando los datos
      await get().forceRefreshManufacturados();
      throw error;
    }
  },

  setManufacturadosPagination: (pagination) =>
    set((state) => ({
      manufacturadosPagination: { ...state.manufacturadosPagination, ...pagination },
    })),

  // Actions para productos no elaborados
  fetchNoElaboradosPaginated: async (page, itemsPerPage) => {
    await waitForToken();

    set({ noElaboradosLoading: true, error: null });
    try {
      const response = await fetchArticulosNoElaboradosAbm(page - 1, itemsPerPage);
      set({
        noElaborados: Array.isArray(response.content) ? response.content : [],
        noElaboradosLoading: false,
        noElaboradosPagination: {
          currentPage: page,
          itemsPerPage,
          totalItems: response.page.totalElements,
          totalPages: response.page.totalPages,
        },
      });
    } catch (error) {
      console.error("Error al cargar productos no elaborados:", error);
      set({ error: (error as Error).message, noElaboradosLoading: false });
    }
  },

  createNoElaborado: async (productData, file) => {
    await waitForToken();

    set({ noElaboradosLoading: true, error: null });
    try {
      const newProduct = mapperInformacionArticuloNoElaboradoDtoToNuevoArticuloNoElaboradoDto(productData);
      console.log("Creando producto no elaborado con imagen:", file ? "Sí" : "No");
      await crearArticuloNoElaborado(newProduct, file);

      // Forzar actualización inmediata
      await get().forceRefreshNoElaborados();
    } catch (error) {
      console.error("Error al crear producto no elaborado:", error);
      set({ error: (error as Error).message, noElaboradosLoading: false });
      throw error;
    }
  },

  updateNoElaborado: async (id, product, file) => {
    await waitForToken();

    set({ noElaboradosLoading: true, error: null });
    try {
      console.log("Actualizando producto no elaborado con imagen:", file ? "Sí" : "No");
      console.log(product);
      await actualizarArticuloNoElaborado(id, product, file);

      // Forzar actualización inmediata
      await get().forceRefreshNoElaborados();
    } catch (error) {
      console.error("Error al actualizar producto no elaborado:", error);
      set({ error: (error as Error).message, noElaboradosLoading: false });
      throw error;
    }
  },

  toggleNoElaboradoStatus: async (id) => {
    await waitForToken();

    try {
      const currentProduct = get().noElaborados.find((product) => product.getIdArticulo() === id);
      if (!currentProduct) {
        throw new Error("Producto no encontrado");
      }

      const newStatus = !currentProduct.isDadoDeAlta();

      // Actualización optimista: cambiar el estado local inmediatamente
      set((state) => ({
        noElaborados: state.noElaborados.map((product) => {
          if (product.getIdArticulo() === id) {
            // Crear una copia del producto con el nuevo estado
            const updatedProduct = Object.create(Object.getPrototypeOf(product));
            Object.assign(updatedProduct, product);
            // Actualizar el estado usando el setter del DTO
            updatedProduct.setDadoDeAlta(newStatus);
            return updatedProduct;
          }
          return product;
        }),
      }));

      await articuloServicio.altaBajaArticulo(id);
    } catch (error) {
      console.error("Error en toggleNoElaboradoStatus:", error);
      set({ error: (error as Error).message });

      // En caso de error, revertir el cambio optimista recargando los datos
      await get().forceRefreshNoElaborados();
      throw error;
    }
  },

  setNoElaboradosPagination: (pagination) =>
    set((state) => ({
      noElaboradosPagination: { ...state.noElaboradosPagination, ...pagination },
    })),

  // Actions compartidas
  fetchCategories: async () => {
    await waitForToken();

    try {
      const categories = await fetchCategoriasAbm();
      set({ categories });
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      set({ error: (error as Error).message });
    }
  },

  fetchIngredients: async () => {
    await waitForToken();

    try {
      const ingredientes = await fetchInsumoAbm();
      set({ ingredients: ingredientes });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setError: (error) => set({ error }),

  // Getters para compatibilidad
  getProductsByType: (type) => {
    const state = get();
    const products = type === "manufacturados" ? state.manufacturados : state.noElaborados;
    return Array.isArray(products) ? products : [];
  },

  getPaginationByType: (type) => {
    const state = get();
    return type === "manufacturados" ? state.manufacturadosPagination : state.noElaboradosPagination;
  },

  getLoadingByType: (type) => {
    const state = get();
    return type === "manufacturados" ? state.manufacturadosLoading : state.noElaboradosLoading;
  },

  // Nuevas funciones para forzar actualización
  forceRefreshManufacturados: async () => {
    const state = get();
    await get().fetchManufacturadosPaginated(
      state.manufacturadosPagination.currentPage,
      state.manufacturadosPagination.itemsPerPage,
    );
  },

  forceRefreshNoElaborados: async () => {
    const state = get();
    await get().fetchNoElaboradosPaginated(
      state.noElaboradosPagination.currentPage,
      state.noElaboradosPagination.itemsPerPage,
    );
  },
}));
