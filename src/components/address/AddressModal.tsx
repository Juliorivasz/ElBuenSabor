//
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

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

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, "id">) => void;
  editingAddress?: Address | null;
}

// Datos de ejemplo para ciudades y localidades
const ciudadesData = {
  "Buenos Aires": ["CABA", "La Plata", "Mar del Plata", "Bahía Blanca", "Tandil"],
  Córdoba: ["Córdoba Capital", "Villa Carlos Paz", "Río Cuarto", "Villa María"],
  "Santa Fe": ["Santa Fe Capital", "Rosario", "Rafaela", "Venado Tuerto"],
  Mendoza: ["Mendoza Capital", "San Rafael", "Godoy Cruz", "Maipú"],
};

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, editingAddress }) => {
  const [formData, setFormData] = useState({
    alias: "",
    calle: "",
    numero: "",
    piso: "",
    dpto: "",
    ciudad: "",
    localidad: "",
    aclaraciones: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableLocalidades, setAvailableLocalidades] = useState<string[]>([]);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        alias: editingAddress.alias || "",
        calle: editingAddress.calle,
        numero: editingAddress.numero,
        piso: editingAddress.piso || "",
        dpto: editingAddress.dpto || "",
        ciudad: editingAddress.ciudad,
        localidad: editingAddress.localidad,
        aclaraciones: editingAddress.aclaraciones || "",
      });
      setAvailableLocalidades(ciudadesData[editingAddress.ciudad as keyof typeof ciudadesData] || []);
    } else {
      setFormData({
        alias: "",
        calle: "",
        numero: "",
        piso: "",
        dpto: "",
        ciudad: "",
        localidad: "",
        aclaraciones: "",
      });
      setAvailableLocalidades([]);
    }
    setErrors({});
  }, [editingAddress, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Actualizar localidades cuando cambie la ciudad
    if (field === "ciudad") {
      const localidades = ciudadesData[value as keyof typeof ciudadesData] || [];
      setAvailableLocalidades(localidades);
      setFormData((prev) => ({ ...prev, localidad: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.calle.trim()) {
      newErrors.calle = "La calle es obligatoria";
    }

    if (!formData.numero.trim()) {
      newErrors.numero = "El número es obligatorio";
    } else if (!/^\d+$/.test(formData.numero.trim())) {
      newErrors.numero = "El número debe contener solo dígitos";
    }

    if (!formData.ciudad) {
      newErrors.ciudad = "La ciudad es obligatoria";
    }

    if (!formData.localidad) {
      newErrors.localidad = "La localidad es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        alias: formData.alias.trim() || undefined,
        calle: formData.calle.trim(),
        numero: formData.numero.trim(),
        piso: formData.piso.trim() || undefined,
        dpto: formData.dpto.trim() || undefined,
        ciudad: formData.ciudad,
        localidad: formData.localidad,
        aclaraciones: formData.aclaraciones.trim() || undefined,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-orange-50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto text-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <LocationIcon className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {editingAddress ? "Editar Dirección" : "Agregar Dirección"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Alias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alias (opcional)</label>
            <input
              type="text"
              value={formData.alias}
              onChange={(e) => handleInputChange("alias", e.target.value)}
              placeholder="Ej: Casa, Trabajo, Casa de mamá..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
            />
          </div>

          {/* Calle y Número */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
              <input
                type="text"
                value={formData.calle}
                onChange={(e) => handleInputChange("calle", e.target.value)}
                placeholder="Nombre de la calle"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base ${
                  errors.calle ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.calle && <p className="text-red-500 text-xs mt-1">{errors.calle}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
              <input
                type="text"
                value={formData.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
                placeholder="123"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base ${
                  errors.numero ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
            </div>
          </div>

          {/* Piso y Departamento */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Piso (opcional)</label>
              <input
                type="text"
                value={formData.piso}
                onChange={(e) => handleInputChange("piso", e.target.value)}
                placeholder="1"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dpto (opcional)</label>
              <input
                type="text"
                value={formData.dpto}
                onChange={(e) => handleInputChange("dpto", e.target.value)}
                placeholder="A"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
            <select
              value={formData.ciudad}
              onChange={(e) => handleInputChange("ciudad", e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base ${
                errors.ciudad ? "border-red-300" : "border-gray-300"
              }`}>
              <option value="">Selecciona una ciudad</option>
              {Object.keys(ciudadesData).map((ciudad) => (
                <option
                  key={ciudad}
                  value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
            {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
          </div>

          {/* Localidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localidad *</label>
            <select
              value={formData.localidad}
              onChange={(e) => handleInputChange("localidad", e.target.value)}
              disabled={!formData.ciudad}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-sm sm:text-base ${
                errors.localidad ? "border-red-300" : "border-gray-300"
              } ${!formData.ciudad ? "bg-gray-100 cursor-not-allowed" : ""}`}>
              <option value="">{formData.ciudad ? "Selecciona una localidad" : "Primero selecciona una ciudad"}</option>
              {availableLocalidades.map((localidad) => (
                <option
                  key={localidad}
                  value={localidad}>
                  {localidad}
                </option>
              ))}
            </select>
            {errors.localidad && <p className="text-red-500 text-xs mt-1">{errors.localidad}</p>}
          </div>

          {/* Aclaraciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aclaraciones (opcional)</label>
            <textarea
              value={formData.aclaraciones}
              onChange={(e) => handleInputChange("aclaraciones", e.target.value)}
              placeholder="Instrucciones de entrega, referencias, etc."
              rows={3}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none text-sm sm:text-base"
            />
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">
              <CancelIcon className="w-5 h-5" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">
              <SaveIcon className="w-5 h-5" />
              {editingAddress ? "Guardar Cambios" : "Guardar Dirección"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
