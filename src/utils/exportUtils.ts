import * as XLSX from "xlsx"
import type { EmpleadoResponseDto } from "../models/dto/Empleado/EmpleadoResponseDto"
import type { InformacionArticuloManufacturadoDto } from "../models/dto/InformacionArticuloManufacturadoDto"
import type { InformacionArticuloNoElaboradoDto } from "../models/dto/InformacionArticuloNoElaboradoDto"
import type { RubroInsumoAbmDto } from "../models/dto/RubroInsumoAbmDto"
import type { InsumoAbmDto } from "../models/dto/InsumoAbmDto"

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
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const archivo = nombreArchivo || `${nombreHoja.toLowerCase()}_${fechaFormateada}_${horaFormateada}.xlsx`

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

export const exportarRubrosAExcel = (rubros: RubroInsumoAbmDto[]): string => {
  const datosParaExportar = rubros.map((rubro, index) => ({
    "N°": index + 1,
    ID: rubro.getIdRubroInsumo(),
    Nombre: rubro.getNombre(),
    Tipo: rubro.esRubroPadre() ? "Principal" : "Subrubro",
    "ID Rubro Padre": rubro.getIdRubroPadre() || "N/A",
    "Cantidad Insumos": rubro.getCantInsumos(),
    Estado: rubro.isDadoDeAlta() ? "Activo" : "Inactivo",
  }))

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 8 }, // ID
    { wch: 30 }, // Nombre
    { wch: 15 }, // Tipo
    { wch: 15 }, // ID Rubro Padre
    { wch: 18 }, // Cantidad Insumos
    { wch: 10 }, // Estado
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rubros de Insumo")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `rubros_insumo_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}

export const exportarInsumosAExcel = (insumos: InsumoAbmDto[]): string => {
  const datosParaExportar = insumos.map((insumo, index) => ({
    "N°": index + 1,
    ID: insumo.getIdArticuloInsumo(),
    Nombre: insumo.getNombre(),
    Rubro: insumo.getNombreRubro(),
    Costo: `$${insumo.getCosto().toFixed(2)}`,
    "Stock Actual": insumo.getStockActual(),
    "Stock Mínimo": insumo.getStockMinimo(),
    "Stock Máximo": insumo.getStockMaximo(),
    "Nivel Stock": (() => {
      const percentage = insumo.getStockPercentage()
      if (percentage <= 25) return "Crítico"
      if (percentage <= 50) return "Bajo"
      if (percentage <= 75) return "Normal"
      return "Óptimo"
    })(),
    "Unidad de Medida": insumo.getUnidadDeMedida(),
    Estado: insumo.isDadoDeAlta() ? "Activo" : "Inactivo",
  }))

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 8 }, // ID
    { wch: 30 }, // Nombre
    { wch: 20 }, // Rubro
    { wch: 12 }, // Costo
    { wch: 12 }, // Stock Actual
    { wch: 12 }, // Stock Mínimo
    { wch: 12 }, // Stock Máximo
    { wch: 12 }, // Nivel Stock
    { wch: 18 }, // Unidad de Medida
    { wch: 10 }, // Estado
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Insumos")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `insumos_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}

export const exportarPedidosCompletadosAExcel = (pedidos: any[]): string => {
  const datosParaExportar = pedidos.map((pedido, index) => {
    const total = pedido.detalles.reduce((sum: number, detalle: any) => sum + detalle.subtotal, 0)
    const cantidadProductos = pedido.detalles.reduce((sum: number, detalle: any) => sum + detalle.cantidad, 0)

    return {
      "N°": index + 1,
      "ID Pedido": pedido.idPedido,
      "Fecha y Hora": new Date(pedido.fechaYHora).toLocaleString("es-ES"),
      "Hora Entrega": pedido.horaEntrega ? new Date(pedido.horaEntrega).toLocaleString("es-ES") : "N/A",
      Estado: pedido.estadoPedido,
      "Tipo Envío": pedido.tipoEnvio === "RETIRO_EN_LOCAL" ? "Retiro en Local" : pedido.tipoEnvio,
      "Método de Pago": pedido.metodoDePago,
      Cliente: pedido.emailCliente,
      "Cantidad Productos": cantidadProductos,
      Total: `$${total.toFixed(2)}`,
    }
  })

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  // Define colors for each status
  const colorMap: { [key: string]: { fgColor: { rgb: string } } } = {
    CANCELADO: { fgColor: { rgb: "FFCCCC" } }, // Red background
    ENTREGADO: { fgColor: { rgb: "CCFFCC" } }, // Green background
    RECHAZADO: { fgColor: { rgb: "FFE5CC" } }, // Orange background
  }

  // Apply colors to each row based on status
  pedidos.forEach((pedido, index) => {
    const rowNumber = index + 2 // +2 because row 1 is header, data starts at row 2
    const estado = pedido.estadoPedido
    const color = colorMap[estado]

    if (color) {
      // Apply color to all cells in the row
      const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
      columns.forEach((col) => {
        const cellAddress = `${col}${rowNumber}`
        if (!worksheet[cellAddress]) return

        worksheet[cellAddress].s = {
          fill: color,
          alignment: { vertical: "center", horizontal: "left" },
        }
      })
    }
  })

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 10 }, // ID Pedido
    { wch: 20 }, // Fecha y Hora
    { wch: 20 }, // Hora Entrega
    { wch: 15 }, // Estado
    { wch: 18 }, // Tipo Envío
    { wch: 18 }, // Método de Pago
    { wch: 30 }, // Cliente
    { wch: 18 }, // Cantidad Productos
    { wch: 12 }, // Total
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos Completados")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `pedidos_completados_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo, { cellStyles: true })
  return nombreArchivo
}

export const exportarDatosGraficoAExcel = (
  datos: any[],
  nombreHoja: string,
  nombreArchivo: string,
  columnWidths?: Array<{ wch: number }>,
): string => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datos)

  if (columnWidths) {
    worksheet["!cols"] = columnWidths
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja)

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const archivo = `${nombreArchivo}_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, archivo)

  return archivo
}

export const exportarClientesAExcel = (clientes: any[]): string => {
  const datosParaExportar = clientes.map((cliente, index) => ({
    "N°": index + 1,
    "ID Usuario": cliente.idUsuario,
    "Nombre y Apellido": cliente.nombreYApellido,
    Email: cliente.email,
    Teléfono: cliente.telefono,
    "Cantidad de Pedidos": cliente.cantidadPedidos,
  }))

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 12 }, // ID Usuario
    { wch: 30 }, // Nombre y Apellido
    { wch: 30 }, // Email
    { wch: 15 }, // Teléfono
    { wch: 20 }, // Cantidad de Pedidos
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `clientes_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}

export const exportarCategoriasAExcel = (categorias: any[]): string => {
  const datosParaExportar = categorias.map((categoria, index) => {
    // Determinar el tipo de categoría
    let tipo = "Principal"
    let nivel = 0

    if (categoria.getIdCategoriaPadre && categoria.getIdCategoriaPadre() !== 0) {
      tipo = "Subcategoría"
      nivel = 1
    }

    return {
      "N°": index + 1,
      ID: categoria.getIdCategoria(),
      Nombre: categoria.getNombre(),
      Tipo: tipo,
      "ID Categoría Padre":
        categoria.getIdCategoriaPadre && categoria.getIdCategoriaPadre() !== 0
          ? categoria.getIdCategoriaPadre()
          : "N/A",
      "Margen de Ganancia": `${(categoria.getMargenGanancia() * 100).toFixed(2)}%`,
      Estado: categoria.isActiva() ? "Activa" : "Inactiva",
      "Fecha Baja":
        categoria.getFechaBaja() && categoria.getFechaBaja() !== null
          ? new Date(categoria.getFechaBaja()).toLocaleDateString("es-AR")
          : "N/A",
    }
  })

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 8 }, // ID
    { wch: 30 }, // Nombre
    { wch: 15 }, // Tipo
    { wch: 18 }, // ID Categoría Padre
    { wch: 20 }, // Margen de Ganancia
    { wch: 10 }, // Estado
    { wch: 15 }, // Fecha Baja
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Categorías")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `categorias_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}

export const exportarPromocionesAExcel = (promociones: any[]): string => {
  const datosParaExportar = promociones.map((promocion, index) => {
    const detalles = promocion.getDetalles() || []
    const precioPromocion = promocion.getPrecioPromocion() ?? 0

    // Calcular precio total de los artículos
    const precioTotal = detalles.reduce((total: number, detalle: any) => {
      const precio = detalle.precio || 0
      return total + precio * detalle.cantidad
    }, 0)

    const descuento = precioTotal > 0 ? ((precioTotal - precioPromocion) / precioTotal) * 100 : 0

    // Crear lista de artículos incluidos
    const articulosIncluidos = detalles
      .map((detalle: any) => `${detalle.nombreArticulo} x${detalle.cantidad}`)
      .join(", ")

    return {
      "N°": index + 1,
      ID: promocion.getIdPromocion(),
      Título: promocion.getTitulo(),
      Descripción: promocion.getDescripcion(),
      "Horario Inicio": promocion.getHorarioInicio() || "N/A",
      "Horario Fin": promocion.getHorarioFin() || "N/A",
      "Artículos Incluidos": articulosIncluidos || "Sin artículos",
      "Precio Total": `$${precioTotal.toFixed(2)}`,
      "Precio Promoción": `$${precioPromocion.toFixed(2)}`,
      Descuento: `${descuento.toFixed(0)}%`,
      Estado: promocion.getActivo() ? "Activa" : "Inactiva",
    }
  })

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 8 }, // ID
    { wch: 30 }, // Título
    { wch: 40 }, // Descripción
    { wch: 15 }, // Horario Inicio
    { wch: 15 }, // Horario Fin
    { wch: 50 }, // Artículos Incluidos
    { wch: 12 }, // Precio Total
    { wch: 15 }, // Precio Promoción
    { wch: 10 }, // Descuento
    { wch: 10 }, // Estado
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Promociones")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `promociones_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}

export const exportarPedidosCocinaAExcel = (pedidos: any[]): string => {
  const datosParaExportar = pedidos.map((pedido, index) => {
    // Crear lista de productos del pedido
    const productos = pedido.detalles
      .map((detalle: any) => {
        const nombre = detalle.nombreArticulo || detalle.tituloPromocion || "Sin nombre"
        return `${nombre} x${detalle.cantidad}`
      })
      .join(", ")

    return {
      "N°": index + 1,
      "ID Pedido": pedido.idPedido,
      Estado: pedido.estadoPedido === "EN_PREPARACION" ? "En Preparación" : "Listo",
      "Tipo de Envío": pedido.tipoEnvio === "RETIRO_EN_LOCAL" ? "Retiro en Local" : "Delivery",
      "Hora de Entrega": new Date(pedido.horaEntrega).toLocaleString("es-ES"),
      Productos: productos,
      "Cantidad de Productos": pedido.detalles.reduce((sum: number, d: any) => sum + d.cantidad, 0),
    }
  })

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 10 }, // ID Pedido
    { wch: 15 }, // Estado
    { wch: 18 }, // Tipo de Envío
    { wch: 20 }, // Hora de Entrega
    { wch: 60 }, // Productos
    { wch: 20 }, // Cantidad de Productos
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos Cocina")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `pedidos_cocina_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}

export const exportarPedidosRepartidorAExcel = (pedidos: any[]): string => {
  const datosParaExportar = pedidos.map((pedido, index) => {
    // Format address
    const direccion = pedido.direccion
    let direccionCompleta = "N/A"

    if (direccion) {
      const calle = direccion.calle?.trim() || ""
      const numero = direccion.numero?.trim() || ""
      let dir = ""

      if (calle && numero) {
        dir = `${calle} ${numero}`
      } else if (calle) {
        dir = calle
      } else if (numero) {
        dir = `Nº ${numero}`
      }

      if (direccion.piso && direccion.piso.trim() !== "" && direccion.piso.toLowerCase() !== "null") {
        dir += `, Piso ${direccion.piso.trim()}`
      }

      if (direccion.dpto && direccion.dpto.trim() !== "" && direccion.dpto.toLowerCase() !== "null") {
        dir += `, Dpto ${direccion.dpto.trim()}`
      }

      direccionCompleta = dir || "Dirección incompleta"
    }

    return {
      "N°": index + 1,
      "ID Pedido": pedido.idPedido,
      Estado:
        pedido.estadoPedido === "LISTO"
          ? "Listo para Retirar"
          : pedido.estadoPedido === "EN_CAMINO"
            ? "En Camino"
            : pedido.estadoPedido,
      "Hora de Entrega": new Date(pedido.horaEntrega).toLocaleString("es-ES"),
      Dirección: direccionCompleta,
      Departamento: pedido.direccion?.nombreDepartamento || "N/A",
    }
  })

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(datosParaExportar)

  const columnWidths = [
    { wch: 5 }, // N°
    { wch: 10 }, // ID Pedido
    { wch: 18 }, // Estado
    { wch: 20 }, // Hora de Entrega
    { wch: 40 }, // Dirección
    { wch: 20 }, // Departamento
  ]

  worksheet["!cols"] = columnWidths
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos Repartidor")

  const fechaActual = new Date()
  const fechaFormateada = fechaActual.toISOString().split("T")[0]
  const horaFormateada = fechaActual.toTimeString().split(" ")[0].replace(/:/g, "-")
  const nombreArchivo = `pedidos_repartidor_${fechaFormateada}_${horaFormateada}.xlsx`

  XLSX.writeFile(workbook, nombreArchivo)
  return nombreArchivo
}