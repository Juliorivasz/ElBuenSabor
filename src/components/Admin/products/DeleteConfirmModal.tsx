"use client";

import type React from "react";
import { InformacionArticuloManufacturadoDto } from "../../../models/dto/InformacionArticuloManufacturadoDto";

interface DeleteConfirmModalProps {
  product: InformacionArticuloManufacturadoDto;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ product, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Eliminar Producto</h3>

          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              ¿Estás seguro que deseas eliminar el producto{" "}
              <span className="font-semibold text-gray-900">"{product.getNombre()}"</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
          </div>

          <div className="flex justify-center space-x-3 mt-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
