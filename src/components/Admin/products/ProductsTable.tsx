"use client";

import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Pagination } from "./Pagination";
import { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto";

interface ProductsTableProps {
  products: InformacionArticuloManufacturadoDto[];
  onEdit: (product: InformacionArticuloManufacturadoDto) => void;
  onDelete: (product: InformacionArticuloManufacturadoDto) => void;
  onViewDetails: (product: InformacionArticuloManufacturadoDto) => void;
  onToggleStatus: (product: InformacionArticuloManufacturadoDto) => void;
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onViewDetails,
  onToggleStatus,
  loading,
  pagination,
  onPageChange,
  onItemsPerPageChange,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No hay productos manufacturados registrados</div>
          <p className="text-gray-400 mt-2">Agrega tu primer producto para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header con información de resultados */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Productos Manufacturados</h3>
          <div className="text-sm text-gray-500">
            {pagination.totalItems} producto{pagination.totalItems !== 1 ? "s" : ""} total
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const isActive = product.getDadoDeAlta();
              return (
                <tr
                  key={product.getIdArticuloManufacturado()}
                  className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img
                      src={product.getImagenDto().getUrl() || "/placeholder.svg"}
                      alt={product.getNombre()}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                    <span className="text-sm font-medium text-gray-900">{product.getNombre()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${product.getPrecioVenta().toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                      {isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewDetails(product)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                        title="Ver detalles">
                        <VisibilityIcon fontSize="small" />
                      </button>

                      <button
                        onClick={() => onEdit(product)}
                        className="text-orange-600 hover:text-orange-900 p-2 rounded-md hover:bg-orange-50 transition-colors"
                        title="Editar">
                        <EditIcon fontSize="small" />
                      </button>

                      <button
                        onClick={() => onToggleStatus(product)}
                        className={`p-2 rounded-md transition-colors ${
                          isActive
                            ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                            : "text-green-600 hover:text-green-900 hover:bg-green-50"
                        }`}
                        title={isActive ? "Dar de baja" : "Dar de alta"}>
                        {isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
};
