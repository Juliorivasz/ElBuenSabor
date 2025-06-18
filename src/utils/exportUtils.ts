import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import type { Empleado } from "../services/empleadoServicio"

export const exportarEmpleadosAExcel = (empleados: Empleado[]) => {
  try {
    // Transformar los datos de empleados al formato requerido para Excel
    const datosParaExcel = empleados.map((empleado) => {
      // Formatear la dirección
      let direccionCompleta = ""
      if (empleado.calle && empleado.numero) {
        direccionCompleta = `${empleado.calle} ${empleado.numero}`

        // Agregar piso y departamento si existen
        const detalles = []
        if (empleado.piso) detalles.push(`Piso ${empleado.piso}`)
        if (empleado.dpto) detalles.push(`Dpto ${empleado.dpto}`)

        if (detalles.length > 0) {
          direccionCompleta += `, ${detalles.join(", ")}`
        }

        // Agregar departamento
        if (empleado.departamentoNombre) {
          direccionCompleta += `, ${empleado.departamentoNombre}`
        }
      } else {
        direccionCompleta = "Sin dirección"
      }

      return {
        Nombre: empleado.nombre || "",
        Apellido: empleado.apellido || "",
        Email: empleado.email || "",
        Rol: empleado.rol || "",
        Estado: empleado.activo ? "Activo" : "Inactivo",
        Teléfono: empleado.telefono || "",
        Dirección: direccionCompleta,
      }
    })

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new()

    // Crear una hoja de trabajo con los datos
    const worksheet = XLSX.utils.json_to_sheet(datosParaExcel)

    // Configurar el ancho de las columnas para mejor visualización
    const columnWidths = [
      { wch: 15 }, // Nombre
      { wch: 15 }, // Apellido
      { wch: 25 }, // Email
      { wch: 15 }, // Rol
      { wch: 10 }, // Estado
      { wch: 15 }, // Teléfono
      { wch: 40 }, // Dirección
    ]
    worksheet["!cols"] = columnWidths

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados")

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })

    // Crear un blob y descargarlo
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    // Generar nombre del archivo con fecha actual
    const fechaActual = new Date().toISOString().split("T")[0]
    const nombreArchivo = `empleados_${fechaActual}.xlsx`

    saveAs(data, nombreArchivo)

    console.log(`Archivo Excel exportado exitosamente: ${nombreArchivo}`)
  } catch (error) {
    console.error("Error al exportar a Excel:", error)
    throw new Error("Error al generar el archivo Excel")
  }
}
