import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { AddressModal } from "../../../components/address/AddressModal";
import { DeleteConfirmModal } from "../../../components/address/DeleteConfirmModal";

interface Address {
  id: string;
  alias?: string;
  calle: string;
  numero: string;
  piso?: string;
  dpto?: string;
  ciudad: string;
  localidad: string;
  aclaraciones?: string;
}

export const Address = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (address: Address) => {
    setAddressToDelete(address);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAddress = (addressData: Omit<Address, "id">) => {
    if (editingAddress) {
      // Editar dirección existente
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === editingAddress.id ? { ...addressData, id: editingAddress.id } : addr)),
      );
    } else {
      // Agregar nueva dirección
      const newAddress: Address = {
        ...addressData,
        id: Date.now().toString(),
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressToDelete.id));
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    }
  };

  const getAddressAlias = (address: Address, index: number) => {
    return address.alias || `Dirección N°${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis Direcciones</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestiona tus direcciones de entrega</p>
        </motion.div>

        {/* Contenido */}
        {addresses.length === 0 ? (
          // Estado vacío
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <LocationIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                No tienes direcciones registradas
              </h3>

              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Agrega tu primera dirección para que podamos entregar tus pedidos
              </p>

              <button
                onClick={handleAddAddress}
                className="w-full m-auto sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 sm:px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">
                <AddIcon className="w-5 h-5" />
                Agregar Dirección
              </button>
            </div>
          </motion.div>
        ) : (
          // Lista de direcciones
          <div className="space-y-4 sm:space-y-6">
            {/* Botón agregar nueva dirección */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleAddAddress}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 sm:px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base mb-6">
              <AddIcon className="w-5 h-5" />
              Agregar Nueva Dirección
            </motion.button>

            {/* Grid de direcciones */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                  {/* Header de la card */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {getAddressAlias(address, index)}
                      </h3>
                    </div>
                  </div>

                  {/* Información de la dirección */}
                  <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base text-gray-900 font-medium">
                      {address.calle} {address.numero}
                      {address.piso && `, Piso ${address.piso}`}
                      {address.dpto && `, Dpto ${address.dpto}`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {address.localidad}, {address.ciudad}
                    </p>
                    {address.aclaraciones && (
                      <p className="text-xs sm:text-sm text-gray-500 italic">"{address.aclaraciones}"</p>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <EditIcon className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <DeleteIcon className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <AnimatePresence>
        {isModalOpen && (
          <AddressModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingAddress(null);
            }}
            onSave={handleSaveAddress}
            editingAddress={editingAddress}
          />
        )}

        {isDeleteModalOpen && addressToDelete && (
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setAddressToDelete(null);
            }}
            onConfirm={confirmDeleteAddress}
            addressAlias={getAddressAlias(
              addressToDelete,
              addresses.findIndex((a) => a.id === addressToDelete.id),
            )}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
