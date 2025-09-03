import { create } from "zustand"
import type { InformacionArticuloManufacturadoDto } from "../../models/dto/InformacionArticuloManufacturadoDto"
import type { InformacionArticuloNoElaboradoDto } from "../../models/dto/InformacionArticuloNoElaboradoDto"
import { NotificationService } from "../../utils/notifications"

type ProductoUnion = InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto

interface ProductosState {
  productos: ProductoUnion[]
  loading: boolean
  error: string | null

  // Filtros - copying exact same pattern as categorias
  filtroActual: "todas" | "activas" | "inactivas" | "padre" | "subcategorias"
  busqueda: string

  // Paginación
  currentPage: number
  itemsPerPage: number

  // Acciones
  fetchProductos: () => Promise<void>
  setFiltro: (filtro: "todas" | "activas" | "inactivas" | "padre" | "subcategorias") => void
  setBusqueda: (busqueda: string) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void

  // Getters computados - same as categorias
  getProductosFiltrados: () => ProductoUnion[]
  getProductosPaginados: () => ProductoUnion[]
  getEstadisticas: () => {
    total: number
    activas: number
    inactivas: number
    padre: number
    subcategorias: number
  }
  getPaginationInfo: () => {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

export const useProductosStore = create<ProductosState>((set, get) => ({
  productos: [],
  loading: false,
  error: null,
  filtroActual: "todas",
  busqueda: "",
  currentPage: 1,
  itemsPerPage: 10,

  fetchProductos: async () => {
    set({ loading: true, error: null })
    try {
      // This would be implemented with actual service calls
      // For now, using empty array
      const productos: ProductoUnion[] = []
      set({ productos, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar productos"
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage, "Error al cargar")
    }
  },

  setFiltro: (filtro) => {
    set({ filtroActual: filtro, currentPage: 1 })
  },

  setBusqueda: (busqueda) => {
    set({ busqueda, currentPage: 1 })
  },

  setCurrentPage: (currentPage) => {
    set({ currentPage })
  },

  setItemsPerPage: (itemsPerPage) => {
    set({ itemsPerPage, currentPage: 1 })
  },

  getProductosFiltrados: () => {
    const { productos, filtroActual, busqueda } = get()
    let filtradas = [...productos]

    // Aplicar filtro de búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase()
      filtradas = filtradas.filter((producto) => {
        // Check both manufacturado and no elaborado name methods
        let nombre = "";
        if ("getNombre" in producto && typeof producto.getNombre === "function") {
          nombre = producto.getNombre();
        } else if ("getDenominacion" in producto && typeof producto.getDenominacion === "function") {
          nombre = producto.getDenominacion();
        }
        return nombre.toLowerCase().includes(busquedaLower)
      })
    }

    // Aplicar filtro de estado/tipo
    switch (filtroActual) {
      case "activas":
        filtradas = filtradas.filter((producto) => {
          return "isDadoDeAlta" in producto
            ? producto.isDadoDeAlta()
            : "isActivo" in producto && typeof (producto as any).isActivo === "function"
              ? (producto as any).isActivo()
              : true
        })
        break
      case "inactivas":
        filtradas = filtradas.filter((producto) => {
          return "isDadoDeAlta" in producto
            ? !producto.isDadoDeAlta()
            : "isActivo" in producto && typeof (producto as any).isActivo === "function"
              ? !(producto as any).isActivo()
              : false
        })
        break
      case "todas":
      default:
        break
    }

    return filtradas
  },

  getProductosPaginados: () => {
    const { currentPage, itemsPerPage } = get()
    const filtradas = get().getProductosFiltrados()

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return filtradas.slice(startIndex, endIndex)
  },

  getEstadisticas: () => {
    const { productos } = get()

    return {
      total: productos.length,
      activas: productos.filter((prod) => {
        return "isDadoDeAlta" in prod
          ? prod.isDadoDeAlta()
          : "isActivo" in prod && typeof (prod as any).isActivo === "function"
            ? (prod as any).isActivo()
            : true
      }).length,
      inactivas: productos.filter((prod) => {
        return "isDadoDeAlta" in prod
          ? !prod.isDadoDeAlta()
          : "isActivo" in prod && typeof (prod as any).isActivo === "function"
            ? !(prod as any).isActivo()
            : false
      }).length,
      padre: 0, // Not applicable for products
      subcategorias: 0, // Not applicable for products
    }
  },

  getPaginationInfo: () => {
    const { currentPage, itemsPerPage } = get()
    const totalItems = get().getProductosFiltrados().length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
    }
  },
}))
