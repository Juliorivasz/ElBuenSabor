import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Pagination } from "./Pagination";

// Interfaz base para productos
interface BaseProduct {
  getIdArticulo?: () => number;
  getidArticulo?: () => number;
  getNombre: () => string;
  getDescripcion?: () => string;
  getPrecioVenta: () => number;
  isDadoDeAlta: () => boolean;
  getImagenUrl?: () => string | null;
  getNombreCategoria?: () => string;
  getPrecioModificado?: () => boolean;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface ProductsTableProps<T extends BaseProduct> {
  products: T[];
  loading: boolean;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onEdit: (product: T) => void;
  onViewDetails: (product: T) => void;
  onToggleStatus: (product: T) => void;
  title?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function ProductsTable<T extends BaseProduct>({
  products,
  loading,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onViewDetails,
  onToggleStatus,
  title = "Productos",
  emptyMessage = "No hay productos registrados",
  emptyDescription = "Agrega tu primer producto para comenzar",
}: ProductsTableProps<T>) {
  // Función helper para obtener el ID del producto
  const getProductId = (product: T): number => {
    return product.getIdArticulo?.() ?? product.getidArticulo?.() ?? 0;
  };

  // Validar que products sea un array
  const validProducts = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (validProducts.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header con información de resultados */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="text-sm text-gray-500">
            {pagination.totalItems} producto{pagination.totalItems !== 1 ? "s" : ""} total
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {validProducts.map((product) => (
              <tr
                key={getProductId(product)}
                className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          (product.getImagenUrl ? product.getImagenUrl() : null) ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={product.getNombre()}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {product.getNombre()}
                      </div>
                      {product.getDescripcion && (
                        <div className="text-sm text-gray-500 truncate max-w-[250px]">{product.getDescripcion()}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.getNombreCategoria && (
                    <span className="inline-block max-w-[100px] truncate align-middle px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.getNombreCategoria()}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="font-medium">${product.getPrecioVenta().toFixed(2)}</span>
                    {product.getPrecioModificado?.() && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Modificado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.isDadoDeAlta() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {product.isDadoDeAlta() ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewDetails(product)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                      title="Ver detalles">
                      <VisibilityIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                      title="Editar">
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(product)}
                      className={`p-1 rounded-full transition-colors ${
                        product.isDadoDeAlta()
                          ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                          : "text-green-600 hover:text-green-900 hover:bg-green-50"
                      }`}
                      title={product.isDadoDeAlta() ? "Desactivar" : "Activar"}>
                      {product.isDadoDeAlta() ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
}
