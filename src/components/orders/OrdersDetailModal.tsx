"use client";

import type React from "react";

import { motion } from "framer-motion";
import {
  CloseOutlined,
  LocalShippingOutlined,
  RestaurantOutlined,
  AccessTimeOutlined,
  LocationOnOutlined,
  PaymentOutlined,
  ReceiptOutlined,
} from "@mui/icons-material";
import type { Order } from "../../pages/client/orders/Orders";
import { useState } from "react";
import Swal from "sweetalert2";

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  if (!isOpen) return null;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "en_preparacion":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "listo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_camino":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "demorado":
        return "bg-red-100 text-red-800 border-red-200";
      case "entregado":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelado":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "en_preparacion":
        return "En Preparación";
      case "listo":
        return "Listo";
      case "en_camino":
        return "En Camino";
      case "demorado":
        return "Demorado";
      case "entregado":
        return "Entregado";
      case "cancelado":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const formatAddress = (direccion: Order["direccionEntrega"]) => {
    if (!direccion) return "Retiro en local";

    let address = `${direccion.calle} ${direccion.numero}`;
    if (direccion.piso) address += `, Piso ${direccion.piso}`;
    if (direccion.departamento) address += `, Dpto ${direccion.departamento}`;
    address += `, ${direccion.localidad}, ${direccion.ciudad}`;

    return address;
  };

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);
    try {
      // Mostrar indicador de carga
      Swal.fire({
        title: "Generando factura...",
        text: "Por favor espera mientras se genera la factura.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Realizar la petición para descargar la factura
      const response = await fetch(`https://localhost:8080/factura/descargar/${order.id}`, {
        method: "GET",
        headers: {
          // Incluir headers de autenticación si son necesarios
          // 'Authorization': `Bearer ${token}`,
        },
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error al descargar la factura: ${response.status} ${response.statusText}`);
      }

      // Obtener el blob de la respuesta
      const blob = await response.blob();

      // Obtener el nombre del archivo de las cabeceras de la respuesta o usar uno predeterminado
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `factura-pedido-${order.id}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);

      // Simular un clic en el enlace para iniciar la descarga
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mostrar mensaje de éxito
      Swal.fire({
        title: "¡Factura descargada!",
        text: "La factura se ha descargado correctamente.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      console.error("Error al generar factura:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al generar la factura. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setDownloadingInvoice(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Orden #{order.numeroOrden}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AccessTimeOutlined sx={{ fontSize: 16 }} />
                  <span>
                    {order.hora} - {new Date(order.fecha).toLocaleDateString()}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.estado)}`}>
                  {getStatusText(order.estado)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <CloseOutlined className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Productos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ReceiptOutlined className="mr-2 text-orange-600" />
              Productos Pedidos
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">{item.cantidad}x</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{item.nombre}</h4>
                      <p className="text-sm text-gray-600">${item.precio} c/u</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${item.precio * item.cantidad}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Costos */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Costos</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Costo de envío</span>
                <span>{order.costoEnvio === 0 ? "Gratis" : `$${order.costoEnvio}`}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles de Entrega */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              {order.tipoEntrega === "delivery" ? (
                <LocalShippingOutlined className="mr-2 text-orange-600" />
              ) : (
                <RestaurantOutlined className="mr-2 text-orange-600" />
              )}
              Detalles de {order.tipoEntrega === "delivery" ? "Entrega" : "Retiro"}
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {/* Dirección */}
              <div className="flex items-start space-x-3">
                <LocationOnOutlined
                  className="text-gray-500 mt-0.5"
                  sx={{ fontSize: 20 }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {order.tipoEntrega === "delivery" ? "Dirección de entrega" : "Retiro en local"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{formatAddress(order.direccionEntrega)}</p>
                  {order.direccionEntrega?.aclaraciones && (
                    <p className="text-gray-500 text-sm mt-1 italic">"{order.direccionEntrega.aclaraciones}"</p>
                  )}
                </div>
              </div>

              {/* Tiempo Estimado */}
              <div className="flex items-center space-x-3">
                <AccessTimeOutlined
                  className="text-gray-500"
                  sx={{ fontSize: 20 }}
                />
                <div>
                  <p className="font-medium text-gray-800">Tiempo estimado</p>
                  <p className="text-gray-600 text-sm">{order.tiempoEstimado}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Forma de Pago */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <PaymentOutlined className="mr-2 text-orange-600" />
              Forma de Pago
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PaymentOutlined
                    className="text-orange-600"
                    sx={{ fontSize: 20 }}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{order.metodoPago}</p>
                  <p className="text-gray-600 text-sm">
                    {order.metodoPago === "Efectivo" ? "Pago en efectivo al recibir" : "Pago procesado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            {order.estado === "entregado" && (
              <button
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                <ReceiptOutlined sx={{ fontSize: 20 }} />
                <span>{downloadingInvoice ? "Descargando..." : "Descargar Factura"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
