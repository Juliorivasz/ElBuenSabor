"use client";

import type React from "react";
import type { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto";
import type { InformacionArticuloNoElaboradoDto } from "../../../models/dto/InformacionArticuloNoElaboradoDto";

type ProductType = InformacionArticuloManufacturadoDto | InformacionArticuloNoElaboradoDto;

interface UniversalProductDetailsModalProps {
  product: ProductType;
  onClose: () => void;
  type: "manufacturado" | "noElaborado";
}

export const UniversalProductDetailsModal: React.FC<UniversalProductDetailsModalProps> = ({
  product,
  onClose,
  type,
}) => {
  if (!product) {
    return null;
  }

  const isManufacturado = type === "manufacturado";

  // Helper functions to safely get data
  const getId = () => {
    try {
      if (isManufacturado) {
        const manufacturado = product as InformacionArticuloManufacturadoDto;
        return manufacturado.getidArticulo?.() || manufacturado.getidArticulo() || 0;
      } else {
        const noElaborado = product as InformacionArticuloNoElaboradoDto;
        return noElaborado.getIdArticulo?.() || noElaborado.getIdArticulo() || 0;
      }
    } catch (error) {
      console.error("Error getting ID:", error);
      return 0;
    }
  };

  const getNombre = () => {
    try {
      return product.getNombre?.() || "Sin nombre";
    } catch (error) {
      console.error("Error getting nombre:", error);
      return "Sin nombre";
    }
  };

  const getDescripcion = () => {
    try {
      return product.getDescripcion?.() || "Sin descripción";
    } catch (error) {
      console.error("Error getting descripcion:", error);
      return "Sin descripción";
    }
  };

  const getPrecioVenta = () => {
    try {
      return product.getPrecioVenta?.() || 0;
    } catch (error) {
      console.error("Error getting precio:", error);
      return 0;
    }
  };

  const getNombreCategoria = () => {
    try {
      return product.getNombreCategoria?.() || "Sin categoría";
    } catch (error) {
      console.error("Error getting categoria:", error);
      return "Sin categoría";
    }
  };

  const getImagenUrl = () => {
    try {
      if (isManufacturado) {
        const manufacturado = product as InformacionArticuloManufacturadoDto;
        return manufacturado.getImagenUrl() || manufacturado.getImagenUrl?.() || null;
      } else {
        const noElaborado = product as InformacionArticuloNoElaboradoDto;
        return noElaborado.getImagenUrl() || noElaborado.getImagenUrl?.() || null;
      }
    } catch (error) {
      console.error("Error getting imagen:", error);
      return null;
    }
  };

  const isDadoDeAlta = () => {
    try {
      return product.isDadoDeAlta?.() || false;
    } catch (error) {
      console.error("Error getting estado:", error);
      return false;
    }
  };

  const getPrecioModificado = () => {
    try {
      return product.getPrecioModificado?.() || false;
    } catch (error) {
      console.error("Error getting precio modificado:", error);
      return false;
    }
  };

  // Specific functions for manufacturado products
  const getTiempoDeCocina = () => {
    try {
      if (isManufacturado) {
        const manufacturado = product as InformacionArticuloManufacturadoDto;
        return manufacturado.getTiempoDeCocina?.() || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error getting tiempo cocina:", error);
      return 0;
    }
  };

  const getReceta = () => {
    try {
      if (isManufacturado) {
        const manufacturado = product as InformacionArticuloManufacturadoDto;
        return manufacturado.getReceta?.() || "Sin receta";
      }
      return "Sin receta";
    } catch (error) {
      console.error("Error getting receta:", error);
      return "Sin receta";
    }
  };

  const getDetalles = () => {
    try {
      if (isManufacturado) {
        const manufacturado = product as InformacionArticuloManufacturadoDto;
        return manufacturado.getDetalles?.() || [];
      }
      return [];
    } catch (error) {
      console.error("Error getting detalles:", error);
      return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{getNombre()}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Producto {isManufacturado ? "Manufacturado" : "No Elaborado"} • ID: {getId()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen y Estado */}
          <div className="space-y-6">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md">
              <img
                src={getImagenUrl() || "/placeholder.svg?height=400&width=400"}
                alt={getNombre()}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400";
                }}
              />
            </div>

            {/* Estado y Precio */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Estado</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isDadoDeAlta() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${isDadoDeAlta() ? "bg-green-400" : "bg-red-400"}`} />
                  {isDadoDeAlta() ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Precio de Venta</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">${getPrecioVenta().toFixed(2)}</span>
                  {getPrecioModificado() && (
                    <div className="flex items-center text-xs text-yellow-600 mt-1">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Precio modificado
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información Detallada */}
          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información General</h4>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Categoría</span>
                  <p className="text-gray-900 mt-1">{getNombreCategoria()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Descripción</span>
                  <p className="text-gray-900 mt-1 leading-relaxed">{getDescripcion()}</p>
                </div>
              </div>
            </div>

            {/* Información específica para manufacturados */}
            {isManufacturado && (
              <>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalles de Preparación</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Tiempo de Cocina</span>
                      <div className="flex items-center mt-1">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-900">{getTiempoDeCocina()} minutos</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Receta</span>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">{getReceta()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredientes */}
                {getDetalles().length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Ingredientes ({getDetalles().length})</h4>
                    <div className="space-y-2">
                      {getDetalles().map((detalle, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div>
                            <span className="font-medium text-gray-900">
                              {detalle.getNombreInsumo?.() || "Sin nombre"}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({detalle.getUnidadDeMedida?.() || "Sin unidad"})
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">{detalle.getCantidad?.() || 0}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Alertas */}
            {getPrecioModificado() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-yellow-400 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Precio Modificado</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      El precio de este producto ha sido modificado manualmente y puede diferir del precio calculado
                      automáticamente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
