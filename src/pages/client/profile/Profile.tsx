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
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import {
  fetchUserProfile,
  updateClientPhone,
  updateClientPasswordDirectly,
  uploadImageClient,
  deleteProfileImage,
  ClienteProfileResponse,
} from "../../../services/clienteServicio";
import { ProfileEditModal } from "../../../components/profile/ProfileEditModal";
import { useAuth0Store } from "../../../store/auth/useAuth0Store";

interface UserProfileState {
  idUsuario: number | null;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  password: string;
  imagen: string | null;
}

type EditableField = "telefono" | "password" | "urlImagen";

export const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuth0Loading } = useAuth0();

  const { setProfileData } = useAuth0Store();

  const [userProfile, setUserProfile] = useState<UserProfileState>({
    idUsuario: null,
    nombre: "",
    apellido: "",
    email: "",
    telefono: null,
    password: "********",
    imagen: "/placeholder.svg",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && user && !isAuth0Loading) {
        setIsFetchingProfile(true);
        setError(null);
        try {
          const profileData: ClienteProfileResponse = await fetchUserProfile();
          setUserProfile({
            idUsuario: profileData.idUsuario,
            nombre: profileData.nombre,
            apellido: profileData.apellido,
            email: profileData.email,
            telefono: profileData.telefono,
            password: "********",
            imagen: profileData.imagen || user.picture || "",
          });

          setProfileData({
            apellido: profileData.apellido,
            telefono: profileData.telefono,
            imagen: profileData.imagen,
            roles: profileData.roles,
            email: profileData.email,
            name: profileData.nombre,
            id: profileData.idAuth0,
            picture: profileData.imagen ?? undefined,
          });
        } catch (err) {
          console.error("Error al cargar el perfil:", err);
          setError("No se pudo cargar el perfil. Intenta de nuevo más tarde.");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al cargar el perfil.",
          });
        } finally {
          setIsFetchingProfile(false);
        }
      } else if (!isAuthenticated && !isAuth0Loading) {
        setIsFetchingProfile(false);
      }
    };

    loadUserProfile();
  }, [isAuthenticated, user, isAuth0Loading, setProfileData]);

  const handleEditField = (field: EditableField) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleSaveChanges = async (field: EditableField, value: string | File) => {
    setIsModalOpen(false);

    if (!userProfile.idUsuario) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de usuario no disponible. No se pueden guardar los cambios.",
      });
      setEditingField(null);
      return;
    }

    try {
      if (field === "telefono") {
        const updatedCliente = await updateClientPhone(value as string);
        setUserProfile((prev) => ({
          ...prev,
          telefono: updatedCliente.telefono,
        }));

        setProfileData({ telefono: updatedCliente.telefono });

        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Teléfono actualizado exitosamente.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (field === "password") {
        await updateClientPasswordDirectly(value as string);
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Contraseña actualizada exitosamente.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (field === "urlImagen") {
        setIsUpdatingImage(true);
        if (value instanceof File) {
          await uploadImageClient(userProfile.idUsuario, value);
          const updatedProfile = await fetchUserProfile();
          setUserProfile((prev) => ({
            ...prev,
            imagen: updatedProfile.imagen || "/placeholder.svg",
          }));

          setProfileData({ imagen: updatedProfile.imagen });
          Swal.fire({
            icon: "success",
            title: "¡Imagen Actualizada!",
            text: "Imagen de perfil actualizada exitosamente.",
            timer: 1500,
            showConfirmButton: false,
          });
        } else if (value === "") {
          const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Estás a punto de eliminar tu foto de perfil.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff7e00",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
          });

          if (result.isConfirmed) {
            await deleteProfileImage();
            setUserProfile((prev) => ({
              ...prev,
              imagen: user?.picture || "/placeholder.svg",
            }));

            setProfileData({ imagen: null, picture: user?.picture });
            Swal.fire({
              icon: "success",
              title: "¡Eliminada!",
              text: "Imagen de perfil eliminada exitosamente.",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }
      }
    } catch (err) {
      console.error(`Error al actualizar ${field}:`, err);
      const errorMessage = `Error al actualizar ${field}.`;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setEditingField(null);
      setIsUpdatingImage(false);
    }
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

  if (isAuth0Loading || isFetchingProfile || isUpdatingImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            {isUpdatingImage ? "Actualizando imagen..." : "Cargando perfil..."}
          </p>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="text-lg sm:text-xl font-semibold mb-2">Error al cargar el perfil</p>
          <p className="text-sm sm:text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gestiona tu información personal</p>
        </motion.div>

        <div className="block lg:hidden space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={userProfile.imagen || "/placeholder.svg"}
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

        {/* desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={userProfile.imagen || "/placeholder.svg"}
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
        {isModalOpen && (
          <ProfileEditModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveChanges}
            field={editingField}
            currentValue={
              editingField === "urlImagen"
                ? userProfile.imagen || ""
                : editingField
                ? (userProfile[editingField] as string) || ""
                : ""
            }
          />
        )}
      </div>
    </div>
  );
};
