import * as XLSX from "xlsx"
import type { EmpleadoResponseDto } from "../models/dto/Empleado/EmpleadoResponseDto"

export const exportarEmpleadosAExcel = (empleados: EmpleadoResponseDto[]): string => {
  // Preparar los datos para exportar
  const datosParaExportar = empleados.map((empleado, index) => ({
    "N°": index + 1,
    "ID Usuario": empleado.getIdUsuario(),
    "Auth0 ID": empleado.getAuth0Id() || "N/A",
    Nombre: empleado.getNombre(),
    Apellido: empleado.getApellido(),
    Email: empleado.getEmail(),
    Teléfono: empleado.getTelefono(),
    Rol: empleado.getRol() || "Sin rol",
    Estado:
      empleado.getFechaBaja() === null || new Date(empleado.getFechaBaja()).getTime() === 0 ? "Activo" : "Inactivo",
    "Fecha Alta": new Date().toLocaleDateString("es-AR"),
    "Fecha Baja":
      empleado.getFechaBaja() && new Date(empleado.getFechaBaja()).getTime() !== 0
        ? new Date(empleado.getFechaBaja()).toLocaleDateString("es-AR")
        : "N/A",
    Imagen: empleado.getImagen() || "Sin imagen",
  }))

  // Crear el libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Crear la hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  // Configurar el ancho de las columnas
  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 12 }, // ID Usuario
    { wch: 25 }, // Auth0 ID
    { wch: 15 }, // Nombre
    { wch: 15 }, // Apellido
    { wch: 30 }, // Email
    { wch: 15 }, // Teléfono
    { wch: 15 }, // Rol
    { wch: 10 }, // Estado
    { wch: 12 }, // Fecha Alta
    { wch: 12 }, // Fecha Baja
    { wch: 20 }, // Imagen
  ]

  worksheet["!cols"] = columnWidths

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados")

  // Generar el nombre del archivo con fecha y hora
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0] // YYYY-MM-DD
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-") // HH-MM-SS
  const nombreArchivo = `empleados_${fechaFormateada}_${horaFormateada}.xlsx`

  // Descargar el archivo
  XLSX.writeFile(workbook, nombreArchivo)

  return nombreArchivo
}

// Función auxiliar para exportar otros tipos de datos (mantenemos compatibilidad)
export const exportarDatosAExcel = (datos: any[], nombreHoja: string, nombreArchivo?: string): string => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datos)

  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja)

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const archivo = nombreArchivo || `${nombreHoja.toLowerCase()}_${fechaFormateada}.xlsx`

  XLSX.writeFile(workbook, archivo)

  return archivo
}

export const exportarEstadisticasEmpleadosAExcel = (empleados: EmpleadoResponseDto[]): string => {
  // Calcular estadísticas
  const total = empleados.length
  const activos = empleados.filter((emp) => {
    const fechaBaja = emp.getFechaBaja()
    return fechaBaja === null || new Date(fechaBaja).getTime() === 0
  }).length
  const inactivos = total - activos
  const porcentajeActivos = total > 0 ? Math.round((activos / total) * 100) : 0
  const porcentajeInactivos = total > 0 ? Math.round((inactivos / total) * 100) : 0

  // Estadísticas por rol
  const estadisticasPorRol = empleados.reduce(
    (acc, emp) => {
      const rol = emp.getRol() || "Sin rol"
      if (!acc[rol]) {
        acc[rol] = { total: 0, activos: 0, inactivos: 0 }
      }
      acc[rol].total++

      const estaActivo = emp.getFechaBaja() === null || new Date(emp.getFechaBaja()).getTime() === 0
      if (estaActivo) {
        acc[rol].activos++
      } else {
        acc[rol].inactivos++
      }
      return acc
    },
    {} as Record<string, { total: number; activos: number; inactivos: number }>,
  )

  // Crear el libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Hoja 1: Resumen General
  const resumenGeneral = [
    { Métrica: "Total de Empleados", Valor: total, Porcentaje: "100%" },
    { Métrica: "Empleados Activos", Valor: activos, Porcentaje: `${porcentajeActivos}%` },
    { Métrica: "Empleados Inactivos", Valor: inactivos, Porcentaje: `${porcentajeInactivos}%` },
  ]

  const worksheetResumen = XLSX.utils.json_to_sheet(resumenGeneral)
  worksheetResumen["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, worksheetResumen, "Resumen General")

  // Hoja 2: Estadísticas por Rol
  const estadisticasRolArray = Object.entries(estadisticasPorRol).map(([rol, stats]) => ({
    Rol: rol,
    "Total Empleados": stats.total,
    "Empleados Activos": stats.activos,
    "Empleados Inactivos": stats.inactivos,
    "% Activos": stats.total > 0 ? `${Math.round((stats.activos / stats.total) * 100)}%` : "0%",
    "% Inactivos": stats.total > 0 ? `${Math.round((stats.inactivos / stats.total) * 100)}%` : "0%",
  }))

  const worksheetRoles = XLSX.utils.json_to_sheet(estadisticasRolArray)
  worksheetRoles["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(workbook, worksheetRoles, "Estadísticas por Rol")

  // Hoja 3: Lista Detallada de Empleados
  const datosDetallados = empleados.map((empleado, index) => ({
    "N°": index + 1,
    Nombre: empleado.getNombre(),
    Apellido: empleado.getApellido(),
    Email: empleado.getEmail(),
    Rol: empleado.getRol() || "Sin rol",
    Estado:
      empleado.getFechaBaja() === null || new Date(empleado.getFechaBaja()).getTime() === 0 ? "Activo" : "Inactivo",
    Teléfono: empleado.getTelefono(),
  }))

  const worksheetDetalle = XLSX.utils.json_to_sheet(datosDetallados)
  worksheetDetalle["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, worksheetDetalle, "Lista de Empleados")

  // Generar el nombre del archivo
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `estadisticas_empleados_${fechaFormateada}_${horaFormateada}.xlsx`

  // Descargar el archivo
  XLSX.writeFile(workbook, nombreArchivo)

  return nombreArchivo
}
