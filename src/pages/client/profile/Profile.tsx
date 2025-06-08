//
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PersonOutlined,
  EmailOutlined,
  PhoneOutlined,
  LockOutlined,
  CameraAltOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { ProfileEditModal } from "../../../components/profile/ProfileEditModal";
import { useAuth0 } from "@auth0/auth0-react";

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  urlImagen: string;
}

type EditableField = "telefono" | "password" | "urlImagen";

export const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [userProfile, setUserProfile] = useState<UserProfile>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "********",
    urlImagen: "",
  });

  // Actualizar el perfil cuando se carguen los datos de Auth0
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserProfile({
        nombre: "Julio",
        apellido: "Rivas",
        email: user.email || "",
        telefono: user.phone_number || "",
        password: "********",
        urlImagen: user.picture || "/placeholder.svg?height=150&width=150",
      });
    }
  }, [isAuthenticated, user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<EditableField | null>(null);

  const handleEditField = (field: EditableField) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleSaveChanges = (field: EditableField, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsModalOpen(false);
    setEditingField(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
  };

  const profileFields = [
    {
      label: "Nombre",
      value: userProfile.nombre,
      icon: PersonOutlined,
      field: null,
      editable: false,
    },
    {
      label: "Apellido",
      value: userProfile.apellido,
      icon: PersonOutlined,
      field: null,
      editable: false,
    },
    {
      label: "Email",
      value: userProfile.email,
      icon: EmailOutlined,
      field: null,
      editable: false,
    },
    {
      label: "Teléfono",
      value: userProfile.telefono,
      icon: PhoneOutlined,
      field: "telefono" as EditableField,
      editable: true,
    },
    {
      label: "Contraseña",
      value: userProfile.password,
      icon: LockOutlined,
      field: "password" as EditableField,
      editable: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center">
          <p className="text-gray-600 text-base sm:text-lg">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gestiona tu información personal</p>
        </motion.div>

        {/* Mobile Layout (Stack) */}
        <div className="block lg:hidden space-y-6">
          {/* Profile Image Section - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={userProfile.urlImagen || "/placeholder.svg"}
                alt="Foto de perfil"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-orange-200 shadow-lg"
              />
              <button
                onClick={() => handleEditField("urlImagen")}
                className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                <CameraAltOutlined sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1 truncate overflow-hidden whitespace-nowrap px-2">
              {userProfile.nombre} {userProfile.apellido}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base break-all">{userProfile.email}</p>
            <button
              onClick={() => handleEditField("urlImagen")}
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium">
              Cambiar foto
            </button>
          </motion.div>

          {/* Profile Information Section - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Información Personal</h3>

            <div className="space-y-3 sm:space-y-4">
              {profileFields.map((field, index) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                      <field.icon
                        className="text-orange-600"
                        sx={{ fontSize: { xs: 20, sm: 24 } }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-500">{field.label}</p>
                      <p className="text-sm sm:text-lg text-gray-800 truncate">
                        {field.label === "Contraseña" ? "••••••••" : field.value || "No especificado"}
                      </p>
                    </div>
                  </div>

                  {field.editable && (
                    <button
                      onClick={() => handleEditField(field.field!)}
                      className="p-1.5 sm:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0">
                      <EditOutlined sx={{ fontSize: { xs: 18, sm: 20 } }} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout (Grid) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Profile Image Section - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={userProfile.urlImagen || "/placeholder.svg"}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-200 shadow-lg"
                />
                <button
                  onClick={() => handleEditField("urlImagen")}
                  className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                  <CameraAltOutlined sx={{ fontSize: 20 }} />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {userProfile.nombre} {userProfile.apellido}
              </h2>
              <p className="text-gray-600">{userProfile.email}</p>
              <button
                onClick={() => handleEditField("urlImagen")}
                className="mt-4 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors duration-200 text-sm font-medium">
                Cambiar foto
              </button>
            </div>
          </motion.div>

          {/* Profile Information Section - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Información Personal</h3>

              <div className="space-y-4">
                {profileFields.map((field, index) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <field.icon
                          className="text-orange-600"
                          sx={{ fontSize: 24 }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{field.label}</p>
                        <p className="text-lg text-gray-800">
                          {field.label === "Contraseña" ? "••••••••" : field.value || "No especificado"}
                        </p>
                      </div>
                    </div>

                    {field.editable && (
                      <button
                        onClick={() => handleEditField(field.field!)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-all duration-200 hover:scale-110">
                        <EditOutlined sx={{ fontSize: 20 }} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Edit Modal */}
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
          field={editingField}
          currentValue={editingField ? userProfile[editingField] : ""}
        />
      </div>
    </div>
  );
};
