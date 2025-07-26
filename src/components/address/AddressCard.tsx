import type React from "react";
import { motion } from "framer-motion";
import { EditOutlined, DeleteOutlined, LocationOnOutlined } from "@mui/icons-material";
import type { Direccion } from "../../models/Direccion";

interface AddressCardProps {
  direccion: Direccion;
  onEdit: (direccion: Direccion) => void;
  onDelete: (idDireccion: number) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ direccion, onEdit, onDelete }) => {
  const formatAddress = () => {
    let address = `${direccion.calle} ${direccion.numero}`;
    if (direccion.piso) {
      address += `, Piso ${direccion.piso}`;
    }
    if (direccion.dpto) {
      address += `, Dpto ${direccion.dpto}`;
    }
    address += `, ${direccion.nombreDepartamento}`;
    return address;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <LocationOnOutlined
              className="text-orange-500"
              sx={{ fontSize: 20 }}
            />
            <h3 className="text-lg font-semibold text-gray-800 truncate">{direccion.nombre}</h3>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{formatAddress()}</p>
        </div>

        <div className="flex space-x-2 ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(direccion)}
            className="p-2 text-black hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
            title="Editar dirección">
            <EditOutlined sx={{ fontSize: 20 }} />
          </button>
          <button
            onClick={() => onDelete(direccion.idDireccion)}
            className="p-2 text-black hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
            title="Eliminar dirección">
            <DeleteOutlined sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
