import * as XLSX from "xlsx"
import type { EmpleadoResponseDto } from "../models/dto/Empleado/EmpleadoResponseDto"
import type { InformacionArticuloManufacturadoDto } from "../models/dto/InformacionArticuloManufacturadoDto"
import type { InformacionArticuloNoElaboradoDto } from "../models/dto/InformacionArticuloNoElaboradoDto"

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

export const exportarProductosManufacturadosAExcel = (productos: InformacionArticuloManufacturadoDto[]): string => {
  const datosParaExportar = productos.map((producto, index) => ({
    "N°": index + 1,
    ID: producto.getidArticulo(),
    Nombre: producto.getNombre(),
    Descripción: producto.getDescripcion() || "N/A",
    Categoría: producto.getNombreCategoria() || "Sin categoría",
    "Precio Venta": `$${producto.getPrecioVenta().toFixed(2)}`,
    "Tiempo Cocina (min)": producto.getTiempoDeCocina(),
    Estado: producto.isDadoDeAlta() ? "Activo" : "Inactivo",
    "Precio Modificado": producto.getPrecioModificado() ? "Sí" : "No",
  }))

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 8 }, // ID
    { wch: 25 }, // Nombre
    { wch: 35 }, // Descripción
    { wch: 20 }, // Categoría
    { wch: 12 }, // Precio Venta
    { wch: 12 }, // Costo Total
    { wch: 18 }, // Tiempo Cocina
    { wch: 10 }, // Estado
    { wch: 15 }, // Precio Modificado
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos Manufacturados")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `productos_manufacturados_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}

export const exportarProductosNoElaboradosAExcel = (productos: InformacionArticuloNoElaboradoDto[]): string => {
  const datosParaExportar = productos.map((producto, index) => ({
    "N°": index + 1,
    ID: producto.getIdArticulo(),
    Nombre: producto.getNombre(),
    Descripción: producto.getDescripcion() || "N/A",
    Categoría: producto.getNombreCategoria() || "Sin categoría",
    "Precio Venta": `$${producto.getPrecioVenta().toFixed(2)}`,
    Costo: `$${producto.getCosto().toFixed(2)}`,
    "Stock Actual": producto.getStock(),
    Estado: producto.isDadoDeAlta() ? "Activo" : "Inactivo",
    "Precio Modificado": producto.getPrecioModificado() ? "Sí" : "No",
  }))

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 8 }, // ID
    { wch: 25 }, // Nombre
    { wch: 35 }, // Descripción
    { wch: 20 }, // Categoría
    { wch: 12 }, // Precio Venta
    { wch: 10 }, // Costo
    { wch: 12 }, // Stock Actual
    { wch: 12 }, // Stock Mínimo
    { wch: 12 }, // Stock Máximo
    { wch: 10 }, // Estado
    { wch: 15 }, // Precio Modificado
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos No Elaborados")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `productos_no_elaborados_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}
