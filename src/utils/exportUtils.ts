import * as XLSX from "xlsx"
import type { EmpleadoResponseDto } from "../models/dto/Empleado/EmpleadoResponseDto"
import type { InsumoAbmDto } from "../models/dto/InsumoAbmDto"
import type { RubroInsumoAbmDto } from "../models/dto/RubroInsumoAbmDto"
import type { PedidoDTO } from "../models/dto/PedidoDTO"
import type { ClienteGestion } from "../models/ClienteGestion"

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

export const exportarProductosAExcel = (productos: any[], tipo: "manufacturados" | "noElaborados"): string => {
  // Preparar los datos para exportar
  const datosParaExportar = productos.map((producto, index) => {
    const baseData = {
      "N°": index + 1,
      ID: producto.getIdArticulo?.() ?? producto.getidArticulo?.() ?? "N/A",
      Nombre: producto.getNombre(),
      Descripción: producto.getDescripcion?.() ?? "N/A",
      "Precio Venta": `$${producto.getPrecioVenta().toFixed(2)}`,
      Categoría: producto.getNombreCategoria?.() ?? "N/A",
      Estado: producto.isDadoDeAlta() ? "Activo" : "Inactivo",
      Imagen: producto.getImagenUrl?.() ? "Sí" : "No",
    }

    // Agregar campos específicos según el tipo
    if (tipo === "manufacturados") {
      return {
        ...baseData,
        "Tiempo Estimado": `${producto.getTiempoEstimadoMinutos?.() ?? 0} min`,
        Preparación: producto.getPreparacion?.() ?? "N/A",
      }
    } else {
      return {
        ...baseData,
        Stock: producto.getStock?.() ?? 0,
        "Stock Mínimo": producto.getStockMinimo?.() ?? 0,
        "Stock Máximo": producto.getStockMaximo?.() ?? 0,
        "Unidad Medida": producto.getUnidadMedida?.() ?? "N/A",
      }
    }
  })

  // Crear el libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Crear la hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  // Configurar el ancho de las columnas según el tipo
  const columnWidths =
    tipo === "manufacturados"
      ? [
          { wch: 5 }, // N°
          { wch: 10 }, // ID
          { wch: 25 }, // Nombre
          { wch: 30 }, // Descripción
          { wch: 12 }, // Precio Venta
          { wch: 15 }, // Categoría
          { wch: 10 }, // Estado
          { wch: 8 }, // Imagen
          { wch: 15 }, // Tiempo Estimado
          { wch: 30 }, // Preparación
        ]
      : [
          { wch: 5 }, // N°
          { wch: 10 }, // ID
          { wch: 25 }, // Nombre
          { wch: 30 }, // Descripción
          { wch: 12 }, // Precio Venta
          { wch: 15 }, // Categoría
          { wch: 10 }, // Estado
          { wch: 8 }, // Imagen
          { wch: 8 }, // Stock
          { wch: 12 }, // Stock Mínimo
          { wch: 12 }, // Stock Máximo
          { wch: 15 }, // Unidad Medida
        ]

  worksheet["!cols"] = columnWidths

  // Agregar la hoja al libro
  const nombreHojaFinal = tipo === "manufacturados" ? "Productos Manufacturados" : "Productos No Elaborados"
  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHojaFinal)

  // Generar el nombre del archivo con fecha y hora
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0] // YYYY-MM-DD
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-") // HH-MM-SS
  const tipoArchivo = tipo === "manufacturados" ? "manufacturados" : "no_elaborados"
  const nombreArchivo = `productos_${tipoArchivo}_${fechaFormateada}_${horaFormateada}.xlsx`

  // Descargar el archivo
  XLSX.writeFile(workbook, nombreArchivo)

  return nombreArchivo
}

export const exportarInsumosAExcel = (insumos: InsumoAbmDto[]): string => {
  // Preparar los datos para exportar
  const datosParaExportar = insumos.map((insumo, index) => ({
    "N°": index + 1,
    "ID Insumo": insumo.getIdArticuloInsumo(),
    Nombre: insumo.getNombre(),
    Costo: `$${insumo.getCosto().toFixed(2)}`,
    "Stock Actual": insumo.getStockActual(),
    "Stock Mínimo": insumo.getStockMinimo(),
    "Stock Máximo": insumo.getStockMaximo(),
    "Unidad de Medida": insumo.getUnidadDeMedida(),
    Rubro: insumo.getNombreRubro(),
    Estado: insumo.isDadoDeAlta() ? "Activo" : "Inactivo",
    "Nivel de Stock": (() => {
      const percentage = insumo.getStockPercentage()
      if (percentage <= 25) return "Crítico"
      if (percentage <= 50) return "Bajo"
      if (percentage <= 75) return "Normal"
      return "Óptimo"
    })(),
    "Porcentaje Stock": `${insumo.getStockPercentage().toFixed(1)}%`,
  }))

  // Crear el libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Crear la hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  // Configurar el ancho de las columnas
  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 12 }, // ID Insumo
    { wch: 25 }, // Nombre
    { wch: 12 }, // Costo
    { wch: 12 }, // Stock Actual
    { wch: 12 }, // Stock Mínimo
    { wch: 12 }, // Stock Máximo
    { wch: 15 }, // Unidad de Medida
    { wch: 20 }, // Rubro
    { wch: 10 }, // Estado
    { wch: 15 }, // Nivel de Stock
    { wch: 15 }, // Porcentaje Stock
  ]

  worksheet["!cols"] = columnWidths

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, "Insumos")

  // Generar el nombre del archivo con fecha y hora
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0] // YYYY-MM-DD
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-") // HH-MM-SS
  const nombreArchivo = `insumos_${fechaFormateada}_${horaFormateada}.xlsx`

  // Descargar el archivo
  XLSX.writeFile(workbook, nombreArchivo)

  return nombreArchivo
}

export const exportarRubrosAExcel = (rubros: RubroInsumoAbmDto[]): string => {
  // Preparar los datos para exportar
  const datosParaExportar = rubros.map((rubro, index) => ({
    "N°": index + 1,
    "ID Rubro": rubro.getIdRubroInsumo(),
    Nombre: rubro.getNombre(),
    Estado: rubro.isDadoDeAlta() ? "Activo" : "Inactivo",
    Tipo: rubro.esRubroPadre() ? "Principal" : "Subrubro",
    "ID Rubro Padre": rubro.getIdRubroPadre() || "N/A",
    "Cantidad Insumos": rubro.getCantInsumos(),
    "Fecha Creación": new Date().toLocaleDateString("es-AR"),
  }))

  // Crear el libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Crear la hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  // Configurar el ancho de las columnas
  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 12 }, // ID Rubro
    { wch: 25 }, // Nombre
    { wch: 10 }, // Estado
    { wch: 12 }, // Tipo
    { wch: 15 }, // ID Rubro Padre
    { wch: 15 }, // Cantidad Insumos
    { wch: 15 }, // Fecha Creación
  ]

  worksheet["!cols"] = columnWidths

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rubros")

  // Generar el nombre del archivo con fecha y hora
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0] // YYYY-MM-DD
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-") // HH-MM-SS
  const nombreArchivo = `rubros_${fechaFormateada}_${horaFormateada}.xlsx`

  // Descargar el archivo
  XLSX.writeFile(workbook, nombreArchivo)

  return nombreArchivo
}

export const exportarPedidosAExcel = (pedidos: PedidoDTO[]): string => {
  // Preparar los datos para exportar
  const datosParaExportar = pedidos.map((pedido, index) => {
    // Calcular el total del pedido
    const totalPedido = pedido.detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0)

    // Crear string con los productos del pedido
    const productosDetalle = pedido.detalles
      .map((detalle) => `${detalle.nombreArticulo} (x${detalle.cantidad})`)
      .join(", ")

    return {
      "N°": index + 1,
      "ID Pedido": pedido.idPedido,
      "Fecha y Hora": new Date(pedido.fechaYHora).toLocaleString("es-AR"),
      "Hora Entrega": pedido.horaEntrega || "N/A",
      Estado: pedido.estadoPedido,
      "Tipo Envío": pedido.tipoEnvio,
      "Método Pago": pedido.metodoDePago,
      "Email Cliente": pedido.emailCliente,
      "Cantidad Items": pedido.detalles.length,
      Total: `$${totalPedido.toFixed(2)}`,
      Productos: productosDetalle || "Sin productos",
    }
  })

  // Crear el libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Crear la hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  // Configurar el ancho de las columnas
  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 12 }, // ID Pedido
    { wch: 20 }, // Fecha y Hora
    { wch: 15 }, // Hora Entrega
    { wch: 15 }, // Estado
    { wch: 12 }, // Tipo Envío
    { wch: 15 }, // Método Pago
    { wch: 25 }, // Email Cliente
    { wch: 12 }, // Cantidad Items
    { wch: 12 }, // Total
    { wch: 50 }, // Productos
  ]

  worksheet["!cols"] = columnWidths

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos")

  // Generar el nombre del archivo con fecha y hora
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0] // YYYY-MM-DD
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-") // HH-MM-SS
  const nombreArchivo = `pedidos_${fechaFormateada}_${horaFormateada}.xlsx`

  // Descargar el archivo
  XLSX.writeFile(workbook, nombreArchivo)

  return nombreArchivo
}

export const exportarClientesAExcel = (clientes: ClienteGestion[]): string => {
  // Preparar los datos para exportar
  const datosParaExportar = clientes.map((cliente, index) => ({
    "N°": index + 1,
    "ID Usuario": cliente.idUsuario,
    "Nombre y Apellido": cliente.nombreYApellido,
    Email: cliente.email,
    Teléfono: cliente.telefono,
    "Cantidad de Pedidos": cliente.cantidadPedidos,
    "Nivel de Actividad": (() => {
      if (cliente.cantidadPedidos === 0) return "Sin pedidos"
      if (cliente.cantidadPedidos <= 2) return "Bajo"
      if (cliente.cantidadPedidos <= 5) return "Medio"
      if (cliente.cantidadPedidos <= 10) return "Alto"
      return "Muy Alto"
    })(),
    "Fecha de Exportación": new Date().toLocaleDateString("es-AR"),
  }))

  // Crear el libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Crear la hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  // Configurar el ancho de las columnas
  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 12 }, // ID Usuario
    { wch: 25 }, // Nombre y Apellido
    { wch: 30 }, // Email
    { wch: 15 }, // Teléfono
    { wch: 18 }, // Cantidad de Pedidos
    { wch: 15 }, // Nivel de Actividad
    { wch: 18 }, // Fecha de Exportación
  ]

  worksheet["!cols"] = columnWidths

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes")

  // Generar el nombre del archivo con fecha y hora
  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0] // YYYY-MM-DD
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-") // HH-MM-SS
  const nombreArchivo = `clientes_${fechaFormateada}_${horaFormateada}.xlsx`

  // Descargar el archivo
  XLSX.writeFile(workbook, nombreArchivo)

  return nombreArchivo
}
