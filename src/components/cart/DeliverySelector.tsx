import StoreIcon from "@mui/icons-material/Store";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export type DeliveryType = "pickup" | "delivery";

interface DeliverySelectorProps {
  selectedType: DeliveryType;
  onTypeChange: (type: DeliveryType) => void;
  deliveryAddress?: string;
  onChangeAddress?: () => void;
}

export const DeliverySelector = ({
  selectedType,
  onTypeChange,
  deliveryAddress = "Av. San Martín 1234, Mendoza, Argentina",
  onChangeAddress,
}: DeliverySelectorProps) => {
  const getEstimatedTime = () => {
    return selectedType === "pickup" ? "30-40 min" : "45-60 min";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Tipo de Entrega</h3>

      {/* Opciones de entrega */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Retiro en local */}
        <button
          onClick={() => onTypeChange("pickup")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedType === "pickup"
              ? "border-yellow-500 bg-yellow-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedType === "pickup" ? "bg-yellow-100" : "bg-gray-100"}`}>
              <StoreIcon className={`w-6 h-6 ${selectedType === "pickup" ? "text-yellow-600" : "text-gray-500"}`} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Retiro en Local</p>
              <p className="text-sm text-gray-600">Sin costo adicional</p>
            </div>
          </div>
        </button>

        {/* Delivery */}
        <button
          onClick={() => onTypeChange("delivery")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            selectedType === "delivery"
              ? "border-yellow-500 bg-yellow-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
          }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selectedType === "delivery" ? "bg-yellow-100" : "bg-gray-100"}`}>
              <LocalShippingIcon
                className={`w-6 h-6 ${selectedType === "delivery" ? "text-yellow-600" : "text-gray-500"}`}
              />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Delivery</p>
              <p className="text-sm text-gray-600">Envío a domicilio</p>
            </div>
          </div>
        </button>
      </div>

      {/* Dirección de entrega (solo si es delivery) */}
      {selectedType === "delivery" && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <LocationOnIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Dirección de entrega</p>
                <p className="text-sm text-gray-600 leading-relaxed">{deliveryAddress}</p>
              </div>
            </div>
            <button
              onClick={onChangeAddress}
              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors px-3 py-1 rounded-md hover:bg-yellow-50 cursor-pointer">
              Cambiar dirección
            </button>
          </div>
        </div>
      )}

      {/* Tiempo estimado */}
      <div className="bg-[#242424] rounded-lg p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <AccessTimeIcon className="w-5 h-5 text-white" />
          <div>
            <p className="text-sm font-medium text-white">
              Tiempo estimado de {selectedType === "pickup" ? "preparación" : "entrega"}
            </p>
            <p className="text-lg font-bold text-white">{getEstimatedTime()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
