//
import { motion } from "framer-motion";
import { Warning as WarningIcon, Close as CloseIcon } from "@mui/icons-material";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addressAlias: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, addressAlias }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <WarningIcon className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Eliminar Dirección</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <WarningIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">¿Estás seguro?</h3>

            <p className="text-sm sm:text-base text-gray-600 mb-2">Estás a punto de eliminar la dirección:</p>

            <p className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">"{addressAlias}"</p>

            <p className="text-xs sm:text-sm text-red-600 font-medium">Esta acción no se puede revertir</p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 text-sm sm:text-base">
              No, Gracias!
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 text-sm sm:text-base">
              Sí, Continuar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
