import { create } from "zustand"
import type { CategoriaExtendidaDto } from "../../models/dto/CategoriaExtendidaDto"
import type { NuevaCategoriaDto } from "../../models/dto/NuevaCategoriaDto"
import { CategoriaGestionServicio } from "../../services/categoriaGestionServicio"
import { NotificationService } from "../../utils/notifications"

interface CategoriasState {
  categorias: CategoriaExtendidaDto[]
  loading: boolean
  error: string | null

  // Filtros
  filtroActual: "todas" | "activas" | "inactivas" | "padre" | "subcategorias"
  busqueda: string

  // Paginación
  currentPage: number
  itemsPerPage: number

  // Acciones
  fetchCategorias: () => Promise<void>
  crearCategoria: (categoria: NuevaCategoriaDto, archivo?: File) => Promise<void>
  actualizarCategoria: (idCategoria: number, categoria: NuevaCategoriaDto, archivo?: File) => Promise<void>
  toggleEstadoCategoria: (idCategoria: number) => Promise<void>
  setFiltro: (filtro: "todas" | "activas" | "inactivas" | "padre" | "subcategorias") => void
  setBusqueda: (busqueda: string) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void

  // Getters computados
  getCategoriasFiltradas: () => CategoriaExtendidaDto[]
  getCategoriasPaginadas: () => CategoriaExtendidaDto[]
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
  getCategoriasJerarquicas: () => Array<{ categoria: CategoriaExtendidaDto; level: number }>
  getCategoriasParaSelector: () => Array<{ categoria: CategoriaExtendidaDto; level: number }>
}

export const useCategoriasStore = create<CategoriasState>((set, get) => ({
  categorias: [],
  loading: false,
  error: null,
  filtroActual: "todas",
  busqueda: "",
  currentPage: 1,
  itemsPerPage: 10,

  fetchCategorias: async () => {
    set({ loading: true, error: null })
    try {
      const categorias = await CategoriaGestionServicio.listarCategorias()
      set({ categorias, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar categorías"
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage, "Error al cargar")
    }
  },

  crearCategoria: async (categoria: NuevaCategoriaDto, archivo?: File) => {
    set({ loading: true, error: null })
    try {
      await CategoriaGestionServicio.crearCategoria(categoria)
      await get().fetchCategorias()
      NotificationService.success("Categoría creada exitosamente", "¡Éxito!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear categoría"
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage, "Error al crear")
      throw error
    }
  },

  actualizarCategoria: async (idCategoria: number, categoria: NuevaCategoriaDto, archivo?: File) => {
    set({ loading: true, error: null })
    try {
      console.log("Store: actualizando categoría", idCategoria, categoria)
      await CategoriaGestionServicio.actualizarCategoria(idCategoria, categoria)
      await get().fetchCategorias()
      NotificationService.success("Categoría actualizada exitosamente", "¡Éxito!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar categoría"
      console.error("Error en store actualizar:", error)
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage, "Error al actualizar")
      throw error
    }
  },

  toggleEstadoCategoria: async (idCategoria: number) => {
    const categoria = get().categorias.find((cat) => cat.getIdCategoria() === idCategoria)
    if (!categoria) {
      NotificationService.error("Categoría no encontrada", "Error")
      return
    }

    const accion = categoria.isActiva() ? "desactivar" : "activar"

    // Validar si es una subcategoría y se intenta activar
    if (!categoria.isActiva() && categoria.getIdCategoriaPadre() !== 0) {
      const categoriaPadre = get().categorias.find((cat) => cat.getIdCategoria() === categoria.getIdCategoriaPadre())
      if (categoriaPadre && !categoriaPadre.isActiva()) {
        NotificationService.error(
          "No se puede activar una subcategoría cuando su categoría padre está inactiva. Primero active la categoría padre.",
          "Operación no permitida",
        )
        return
      }
    }

    // Obtener todas las subcategorías recursivamente
    const obtenerSubcategoriasRecursivas = (parentId: number): CategoriaExtendidaDto[] => {
      const subcategorias: CategoriaExtendidaDto[] = []
      const hijas = get().categorias.filter((cat) => cat.getIdCategoriaPadre() === parentId)

      for (const hija of hijas) {
        subcategorias.push(hija)
        subcategorias.push(...obtenerSubcategoriasRecursivas(hija.getIdCategoria()))
      }

      return subcategorias
    }

    const subcategorias = obtenerSubcategoriasRecursivas(idCategoria)

    let mensajeConfirmacion = `¿Estás seguro de que deseas ${accion} la categoría "${categoria.getNombre()}"?`

    if (subcategorias.length > 0) {
      if (categoria.isActiva()) {
        // Desactivando categoría padre
        mensajeConfirmacion += `\n\nEsto también desactivará ${subcategorias.length} subcategoría${subcategorias.length > 1 ? "s" : ""} asociada${subcategorias.length > 1 ? "s" : ""}:`
      } else {
        // Activando categoría padre
        mensajeConfirmacion += `\n\nEsto también activará ${subcategorias.length} subcategoría${subcategorias.length > 1 ? "s" : ""} asociada${subcategorias.length > 1 ? "s" : ""}:`
      }

      subcategorias.slice(0, 5).forEach((sub) => {
        mensajeConfirmacion += `\n• ${sub.getNombre()}`
      })

      if (subcategorias.length > 5) {
        mensajeConfirmacion += `\n• ... y ${subcategorias.length - 5} más`
      }
    }

    const confirmed = await NotificationService.confirm(mensajeConfirmacion, `Confirmar ${accion}`)

    if (!confirmed) return

    set({ loading: true, error: null })
    try {
      // Cambiar estado de la categoría principal
      await CategoriaGestionServicio.toggleEstadoCategoria(idCategoria)

      // Cambiar estado de todas las subcategorías para que coincidan con el padre
      const estadoDeseado = !categoria.isActiva() // El nuevo estado que tendrá la categoría padre

      for (const subcategoria of subcategorias) {
        // Solo cambiar si el estado actual es diferente al deseado
        if (subcategoria.isActiva() !== estadoDeseado) {
          try {
            await CategoriaGestionServicio.toggleEstadoCategoria(subcategoria.getIdCategoria())
          } catch (error) {
            console.error(`Error al cambiar estado de subcategoría ${subcategoria.getNombre()}:`, error)
            // Continuar con las demás subcategorías aunque una falle
          }
        }
      }

      console.log("Toggle exitoso, recargando categorías...")
      await get().fetchCategorias()

      let mensajeExito = `Categoría ${accion === "activar" ? "activada" : "desactivada"} exitosamente`
      if (subcategorias.length > 0) {
        mensajeExito += ` junto con ${subcategorias.length} subcategoría${subcategorias.length > 1 ? "s" : ""}`
      }

      NotificationService.success(mensajeExito, "¡Éxito!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Error al ${accion} categoría`
      console.error("Error en toggle:", error)
      set({ error: errorMessage, loading: false })
      NotificationService.error(errorMessage, `Error al ${accion}`)
      throw error
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

  getCategoriasFiltradas: () => {
    const { categorias, filtroActual, busqueda } = get()

    let filtradas = [...categorias]

    // Aplicar filtro de búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase()
      filtradas = filtradas.filter((categoria) => categoria.getNombre().toLowerCase().includes(busquedaLower))
    }

    // Aplicar filtro de estado/tipo
    switch (filtroActual) {
      case "activas":
        filtradas = filtradas.filter((categoria) => categoria.isActiva())
        break
      case "inactivas":
        filtradas = filtradas.filter((categoria) => !categoria.isActiva())
        break
      case "padre":
        filtradas = filtradas.filter((categoria) => categoria.getIdCategoriaPadre() === 0)
        break
      case "subcategorias":
        filtradas = filtradas.filter((categoria) => categoria.getIdCategoriaPadre() !== 0)
        break
      case "todas":
      default:
        // Mostrar todas las categorías sin filtro adicional
        break
    }

    return filtradas
  },

  getCategoriasPaginadas: () => {
    const { currentPage, itemsPerPage } = get()
    const filtradas = get().getCategoriasFiltradas()

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return filtradas.slice(startIndex, endIndex)
  },

  getEstadisticas: () => {
    const { categorias } = get()

    return {
      total: categorias.length,
      activas: categorias.filter((cat) => cat.isActiva()).length,
      inactivas: categorias.filter((cat) => !cat.isActiva()).length,
      padre: categorias.filter((cat) => cat.esCategoriaPadre()).length,
      subcategorias: categorias.filter((cat) => !cat.esCategoriaPadre()).length,
    }
  },

  getPaginationInfo: () => {
    const { currentPage, itemsPerPage, filtroActual } = get()
    let totalItems: number

    if (filtroActual === "todas") {
      // Para vista jerárquica, contar todas las categorías
      totalItems = get().getCategoriasFiltradas().length
    } else {
      totalItems = get().getCategoriasFiltradas().length
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
    }
  },

  getCategoriasJerarquicas: () => {
    const { categorias } = get()

    const buildHierarchy = (parentId = 0, level = 0): Array<{ categoria: CategoriaExtendidaDto; level: number }> => {
      const result: Array<{ categoria: CategoriaExtendidaDto; level: number }> = []
      const children = categorias
        .filter((cat) => cat.getIdCategoriaPadre() === parentId)
        .sort((a, b) => a.getNombre().localeCompare(b.getNombre()))

      for (const child of children) {
        result.push({ categoria: child, level })
        result.push(...buildHierarchy(child.getIdCategoria(), level + 1))
      }

      return result
    }

    return buildHierarchy()
  },

  getCategoriasParaSelector: () => {
    const { categorias } = get()

    const buildHierarchy = (parentId = 0, level = 0): Array<{ categoria: CategoriaExtendidaDto; level: number }> => {
      const result: Array<{ categoria: CategoriaExtendidaDto; level: number }> = []
      const children = categorias
        .filter((cat) => cat.getIdCategoriaPadre() === parentId)
        .sort((a, b) => a.getNombre().localeCompare(b.getNombre()))

      for (const child of children) {
        result.push({ categoria: child, level })
        result.push(...buildHierarchy(child.getIdCategoria(), level + 1))
      }

      return result
    }

    return buildHierarchy()
  },
}))
