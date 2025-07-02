import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloseOutlined,
  SaveOutlined,
  PhoneOutlined,
  LockOutlined,
  CameraAltOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
// No necesitamos importar Swal aquí, ya que las notificaciones las maneja el padre

type EditableField = "telefono" | "password" | "urlImagen";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: EditableField, value: string | File) => void;
  field: EditableField | null;
  currentValue: string; // current value of the field being edited (can be URL for image)
}

interface FormErrors {
  telefono?: string;
  password?: string;
  confirmPassword?: string;
  urlImagen?: string;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSave, field, currentValue }) => {
  const [value, setValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (isOpen && field) {
      if (field === "password") {
        setValue(""); // Siempre resetear contraseñas
        setConfirmPassword("");
      } else if (field === "urlImagen") {
        setImagePreview(currentValue); // Usa el currentValue (URL de imagen) para la preview
        setImageFile(null); // Resetea el archivo seleccionado
      } else {
        setValue(currentValue); // Para teléfono, usa el valor actual
      }
      setErrors({}); // Limpiar errores al abrir el modal
    }
  }, [isOpen, field, currentValue]);

  const validatePhone = (phone: string): string | undefined => {
    if (!/^[\d\s-]{8,}$/.test(phone.trim())) {
      return "El teléfono debe contener solo números, espacios o guiones (mínimo 8 dígitos).";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula.";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      return "La contraseña debe contener al menos un símbolo (!@#$%^&*).";
    }
    return undefined;
  };

  const validateImage = (file: File): string | undefined => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "Solo se permiten archivos JPG, JPEG, PNG o WebP.";
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "El archivo no debe superar los 5MB.";
    }
    return undefined;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        setErrors((prev) => ({ ...prev, urlImagen: error }));
        setImageFile(null);
        setImagePreview(currentValue); // Restaura la preview a la imagen actual si hay error
        return;
      }

      setImageFile(file);
      setErrors((prev) => ({ ...prev, urlImagen: undefined })); // Limpiar error si se selecciona un archivo válido

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      // Si el usuario cancela la selección de archivo, vuelve a la imagen actual
      setImageFile(null);
      setImagePreview(currentValue);
      setErrors((prev) => ({ ...prev, urlImagen: undefined }));
    }
  };

  const handleSave = () => {
    if (!field) return;

    const newErrors: FormErrors = {};

    if (field === "telefono") {
      const phoneError = validatePhone(value);
      if (phoneError) {
        newErrors.telefono = phoneError;
      }
    } else if (field === "password") {
      const passwordError = validatePassword(value);
      if (passwordError) {
        newErrors.password = passwordError;
      }

      if (value !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      }
    } else if (field === "urlImagen") {
      if (imageFile) {
        const imageError = validateImage(imageFile);
        if (imageError) {
          newErrors.urlImagen = imageError;
        }
      }
      // No se agrega un error si no hay imagen y no se selecciona una nueva,
      // ya que la lógica de eliminación se maneja en el componente padre con la confirmación de Swal.
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (field === "urlImagen") {
        if (imageFile) {
          onSave(field, imageFile);
        } else if (!imageFile && currentValue) {
          // Si no se selecciona nuevo archivo pero ya había una imagen,
          // y el usuario decide no seleccionar nada, asumimos que quiere eliminar la imagen existente.
          // Aquí se pasa un string vacío para indicar la eliminación.
          onSave(field, "");
        } else if (!imageFile && !currentValue) {
          // Si no hay archivo nuevo y no hay imagen actual, y el campo no es obligatorio,
          // puedes considerar que no hay cambio o que se mantiene vacío.
          // Por simplicidad, si no hay archivo y no hay current value, cerramos el modal.
          onClose();
        } else {
          // Este caso es cuando no hay un nuevo archivo y el currentValue es la URL de la imagen existente,
          // lo que implica que el usuario no hizo cambios, solo cerramos el modal.
          onClose();
        }
      } else {
        onSave(field, value);
      }
    }
  };

  const getFieldConfig = () => {
    switch (field) {
      case "telefono":
        return {
          title: "Editar Teléfono",
          icon: PhoneOutlined,
          placeholder: "Ingrese su número de teléfono",
        };
      case "password":
        return {
          title: "Cambiar Contraseña",
          icon: LockOutlined,
          placeholder: "Ingrese su nueva contraseña",
        };
      case "urlImagen":
        return {
          title: "Cambiar Foto de Perfil",
          icon: CameraAltOutlined,
          placeholder: "",
        };
      default:
        return {
          title: "",
          icon: PhoneOutlined,
          placeholder: "",
        };
    }
  };

  const config = getFieldConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-orange-50 bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto text-black"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                  <config.icon
                    className="text-orange-600"
                    sx={{ fontSize: { xs: 20, sm: 24 } }}
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{config.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <CloseOutlined
                  className="text-gray-500"
                  sx={{ fontSize: { xs: 20, sm: 24 } }}
                />
              </button>
            </div>

            {/* Form Content */}
            <div className="space-y-3 sm:space-y-4">
              {field === "telefono" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Teléfono</label>
                  <input
                    type="tel"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={config.placeholder}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 text-sm sm:text-base ${
                      errors.telefono ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.telefono && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.telefono}</p>}
                </div>
              )}

              {field === "password" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={config.placeholder}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 text-sm sm:text-base ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? (
                          <VisibilityOffOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        ) : (
                          <VisibilityOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme su nueva contraseña"
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 text-sm sm:text-base ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showConfirmPassword ? (
                          <VisibilityOffOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        ) : (
                          <VisibilityOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">Requisitos de la contraseña:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Mínimo 8 caracteres</li>
                      <li>• Al menos una letra mayúscula</li>
                      <li>• Al menos una letra minúscula</li>
                      <li>• Al menos un símbolo (!@#$%^&*)</li>
                    </ul>
                  </div>
                </>
              )}

              {field === "urlImagen" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>

                  {imagePreview && (
                    <div className="mb-3 sm:mb-4 text-center">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Vista previa"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto border-4 border-orange-200"
                      />
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-orange-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2">
                      <CameraAltOutlined
                        className="text-gray-400"
                        sx={{ fontSize: { xs: 36, sm: 48 } }}
                      />
                      <span className="text-xs sm:text-sm font-medium text-gray-600">
                        Haz clic para seleccionar una imagen
                      </span>
                    </label>
                  </div>

                  {errors.urlImagen && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.urlImagen}</p>}

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 mt-3">
                    <p className="text-xs sm:text-sm font-medium text-orange-800 mb-2">Sube tu foto de perfil</p>
                    <p className="text-xs text-orange-700 mb-2">
                      Para que tu foto luzca increíble y se vea nítida en cualquier dispositivo, por favor, ten en
                      cuenta:
                    </p>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>
                        • <strong>Resolución ideal:</strong> Sugerimos 400x400 píxeles
                      </li>
                      <li>
                        • <strong>Formatos aceptados:</strong> JPG, JPEG, PNG o WebP
                      </li>
                      <li>
                        • <strong>Tamaño máximo:</strong> 5MB
                      </li>
                      {currentValue && ( // Mostrar opción de eliminar si hay una imagen actual
                        <li>• **Deja el campo vacío para eliminar la foto actual.**</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center space-x-2 text-sm sm:text-base">
                <SaveOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
                <span>Guardar</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
