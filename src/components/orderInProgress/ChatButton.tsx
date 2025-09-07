import type React from "react";
import { MessageOutlined, PhoneOutlined } from "@mui/icons-material";

interface ChatButtonProps {
  pedidoId: number;
  repartidorTelefono?: string;
  onOpenChat?: (repartidorTelefono?: string) => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ repartidorTelefono, onOpenChat }) => {
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChat?.(repartidorTelefono);
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (repartidorTelefono) {
      window.open(`tel:${repartidorTelefono}`, "_self");
    }
  };

  // Solo mostrar botones si hay repartidor asignado
  if (!repartidorTelefono) {
    return null;
  }

  return (
    <div className="flex gap-3 lg:gap-4">
      {/* Botón de chat */}
      <button
        onClick={handleChatClick}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium">
        <MessageOutlined className="text-lg" />
        <span>Chat</span>
      </button>

      {/* Botón de teléfono */}
      <button
        onClick={handlePhoneClick}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium">
        <PhoneOutlined className="text-lg" />
        <span>Llamar</span>
      </button>
    </div>
  );
};
