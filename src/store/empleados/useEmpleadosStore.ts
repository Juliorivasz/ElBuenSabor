import { create } from "zustand";
import { empleadoServicio } from "../../services/empleadoServicio";
import type { EmpleadoResponseDto } from "../../models/dto/Empleado/EmpleadoResponseDto";

interface EmpleadosState {
  // Estado
  empleados: EmpleadoResponseDto[];
  loading: boolean;
  error: string | null;

  // Estadísticas computadas
  estadisticas: {
    total: number;
    activos: number;
    inactivos: number;
    porcentajeActivos: number;
  };

  // Acciones
  cargarEmpleados: () => Promise<void>;
  toggleEmpleadoActivo: (id: number) => Promise<void>;
  agregarEmpleado: (empleado: EmpleadoResponseDto) => void;
  actualizarEmpleado: (empleado: EmpleadoResponseDto) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  limpiarError: () => void;
}

// Función helper para calcular estadísticas
const calcularEstadisticas = (empleados: EmpleadoResponseDto[]) => {
  const total = empleados.length;
  const activos = empleados.filter((emp) => {
    const fechaBaja = emp.getFechaBaja();
    return fechaBaja === null || new Date(fechaBaja).getTime() === 0;
  }).length;
  const inactivos = total - activos;
  const porcentajeActivos = total > 0 ? Math.round((activos / total) * 100) : 0;

  return {
    total,
    activos,
    inactivos,
    porcentajeActivos,
  };
};

export const useEmpleadosStore = create<EmpleadosState>((set, get) => ({
  // Estado inicial
  empleados: [],
  loading: false,
  error: null,
  estadisticas: {
    total: 0,
    activos: 0,
    inactivos: 0,
    porcentajeActivos: 0,
  },

  // Acciones
  cargarEmpleados: async () => {
    set({ loading: true, error: null });

    try {
      const empleados = await empleadoServicio.obtenerEmpleados();
      const estadisticas = calcularEstadisticas(empleados);

      set({
        empleados,
        estadisticas,
        loading: false,
      });
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      set({
        error: "Error al cargar los empleados",
        loading: false,
      });
    }
  },

  toggleEmpleadoActivo: async (id: number) => {
    const { empleados } = get();

    try {
      // Optimistic update - actualizar UI inmediatamente
      const empleadosActualizados = empleados.map((emp) => {
        if (emp.getIdUsuario() === id) {
          const fechaBaja = emp.getFechaBaja();
          const estaActivo = fechaBaja === null || new Date(fechaBaja).getTime() === 0;
          // Crear nuevo empleado con fecha actualizada
          const nuevoEmpleado = new (emp.constructor as any)(
            emp.getIdUsuario(),
            emp.getAuth0Id(),
            emp.getNombre(),
            emp.getApellido(),
            emp.getEmail(),
            emp.getRol(),
            emp.getTelefono(),
            estaActivo ? new Date() : null, // Si estaba activo, poner fecha actual, si no, null
            emp.getImagen(),
          );
          return nuevoEmpleado;
        }
        return emp;
      });
      const estadisticas = calcularEstadisticas(empleadosActualizados);

      set({
        empleados: empleadosActualizados,
        estadisticas,
      });

      // Llamada al backend
      await empleadoServicio.toggleAltaBaja(id);
    } catch (error) {
      console.error("Error en toggle activo/inactivo:", error);

      // Revertir cambios en caso de error
      const estadisticas = calcularEstadisticas(empleados);
      set({
        empleados,
        estadisticas,
        error: "Error al cambiar el estado del empleado",
      });

      // Recargar datos del servidor para asegurar consistencia
      setTimeout(() => {
        get().cargarEmpleados();
      }, 1000);
    }
  },

  agregarEmpleado: (nuevoEmpleado: EmpleadoResponseDto) => {
    const { empleados } = get();
    const empleadosActualizados = [...empleados, nuevoEmpleado];
    const estadisticas = calcularEstadisticas(empleadosActualizados);

    set({
      empleados: empleadosActualizados,
      estadisticas,
    });
  },

  actualizarEmpleado: (empleadoActualizado: EmpleadoResponseDto) => {
    const { empleados } = get();
    const empleadosActualizados = empleados.map((emp) =>
      emp.getIdUsuario() === empleadoActualizado.getIdUsuario() ? empleadoActualizado : emp,
    );
    const estadisticas = calcularEstadisticas(empleadosActualizados);

    set({
      empleados: empleadosActualizados,
      estadisticas,
    });
  },

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  limpiarError: () => set({ error: null }),
}));

// Hook personalizado para estadísticas
export const useEmpleadosStats = () => {
  const estadisticas = useEmpleadosStore((state) => state.estadisticas);
  const loading = useEmpleadosStore((state) => state.loading);

  return {
    ...estadisticas,
    loading,
  };
};

// Hook personalizado para la lista de empleados
export const useEmpleadosList = () => {
  const empleados = useEmpleadosStore((state) => state.empleados);
  const loading = useEmpleadosStore((state) => state.loading);
  const error = useEmpleadosStore((state) => state.error);
  const cargarEmpleados = useEmpleadosStore((state) => state.cargarEmpleados);
  const toggleEmpleadoActivo = useEmpleadosStore((state) => state.toggleEmpleadoActivo);

  return {
    empleados,
    loading,
    error,
    cargarEmpleados,
    toggleEmpleadoActivo,
  };
};
