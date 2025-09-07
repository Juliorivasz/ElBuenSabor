import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const BackToCatalogButton = () => {
  const navigate = useNavigate();

  const handleBackToCatalog = () => {
    navigate("/catalog");
  };

  return (
    <button
      onClick={handleBackToCatalog}
      className="flex items-center gap-2 text-gray-900 hover:text-gray-500 transition-colors group cursor-pointer">
      <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
        <ArrowBackIcon className="w-5 h-5" />
      </div>
      <span className="font-medium">Volver al catálogo</span>
    </button>
  );
};
