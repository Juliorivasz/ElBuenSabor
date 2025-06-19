import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const CartHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => navigate("/catalog")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
        <ArrowBack className="w-5 h-5" />
        <span className="font-medium">Volver al catálogo</span>
      </button>
      <div className="h-6 w-px bg-gray-300" />
      <h1 className="text-2xl font-bold text-gray-800">Mi Carrito</h1>
    </div>
  );
};
