"use client";

import type React from "react";
import { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto";

interface ProductDetailsModalProps {
  product: InformacionArticuloManufacturadoDto;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const getProductStatus = (): boolean => {
    return product.getDadoDeAlta?.() ?? true;
  };

  const getCategoryName = (): string => {
    try {
      const categoriaNombre = product.getNombreCategoria?.();
      return categoriaNombre ? `${categoriaNombre}` : "Sin categoría";
    } catch (error) {
      console.warn("Error obteniendo nombre de categoría:", error);
      return "Sin categoría";
    }
  };

  const isActive = getProductStatus();
  const categoryName = getCategoryName();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Detalles del Producto</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Información General</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Nombre:</span>
                    <p className="text-gray-900 font-medium">{product.getNombre?.()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Categoría:</span>
                    <p className="text-gray-900">{categoryName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Precio:</span>
                    <p className="text-gray-900 font-semibold text-lg">${product.getPrecioVenta?.().toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tiempo de Cocina:</span>
                    <p className="text-gray-900 font-medium">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        🕒 {product.getTiempoDeCocina?.()} minutos
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                      {isActive ? "✅ Activo" : "❌ Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Imagen */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Imagen</h4>
                <div className="relative">
                  <img
                    src={product.getImagenDto?.().getUrl?.() || "/placeholder.svg?height=200&width=300"}
                    alt={product.getNombre?.()}
                    className="w-full h-48 object-cover rounded-lg border shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h4>
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg border">{product.getDescripcion?.()}</div>
            </div>

            {/* Receta */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Receta</h4>
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg border whitespace-pre-wrap">
                {product.getReceta?.()}
              </div>
            </div>

            {/* Ingredientes */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                🥘 Ingredientes
                <span className="ml-2 bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded-full">
                  {product.getDetalles?.()?.length || 0}
                </span>
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 border">
                {product.getDetalles?.()?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.getDetalles().map((detalle, index) => {
                      try {
                        const articuloInsumo = detalle.getNombreInsumo?.();
                        const cantidad = detalle.getCantidad?.();
                        const nombre = articuloInsumo;

                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-white p-3 rounded-md border shadow-sm">
                            <span className="text-gray-900 font-medium flex items-center">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                              {nombre}
                            </span>
                            <span className="text-gray-600 font-semibold bg-gray-100 px-2 py-1 rounded">
                              {cantidad} unidades
                            </span>
                          </div>
                        );
                      } catch (error) {
                        console.error("Error procesando ingrediente:", error);
                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-red-50 p-3 rounded-md border border-red-200">
                            <span className="text-red-600">Error al cargar ingrediente</span>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">🍽️</div>
                    <p className="text-gray-500">No hay ingredientes registrados</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-8 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
