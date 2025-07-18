import { interceptorsApiClient } from "./interceptors/axios.interceptors";

export interface ClienteDto {
  idUsuario: number;
  auth0Id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  imagen: string | null;
}

export interface ClienteRegister {
  auth0Id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  imagen: string | null;
}

export interface TelefonoUpdateDto {
  telefono: string;
}
export interface PasswordChangeDto {
  newPassword: string;
}

export interface UsuarioDTO {
  auth0Id?: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  imagen: string | null;
  password?: string;
  rolesauth0Ids?: string[];
}

export interface ClienteProfileResponse {
  idUsuario: number;
  auth0Id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  imagen: string | null;
  roles?: string[];
}

export interface ImageUploadResponse {
  status: string;
  message: string;
  imageUrl?: string;
}

export interface IClienteResponse {
  idUsuario: number;
  auth0Id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
}

export const registerClient = async (clienteRegister: ClienteRegister): Promise<IClienteResponse> => {
  const response = await interceptorsApiClient.post<IClienteResponse>("/cliente/registrar", clienteRegister);
  return response.data;
};

export const fetchUserProfile = async (): Promise<ClienteProfileResponse> => {
  const response = await interceptorsApiClient.get<ClienteProfileResponse>("/cliente/perfil");
  return response.data;
};

export const updateClientPhone = async (telefono: string): Promise<ClienteDto> => {
  const telefonoDto: TelefonoUpdateDto = { telefono };
  const response = await interceptorsApiClient.put<ClienteDto>("/cliente/actualizar/telefono", telefonoDto);
  return response.data;
};

export const updateClientPasswordDirectly = async (newPassword: string): Promise<{ message: string }> => {
  const passwordChangeDto: PasswordChangeDto = { newPassword };
  const response = await interceptorsApiClient.put<{ message: string }>(
    "/cliente/actualizar/contrasena",
    passwordChangeDto,
  );
  return response.data;
};

export const updateMyProfile = async (usuarioDTO: UsuarioDTO): Promise<ClienteDto> => {
  const response = await interceptorsApiClient.put<ClienteDto>("/cliente/perfil", usuarioDTO);
  return response.data;
};

export const uploadImageClient = async (idCliente: number, file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await interceptorsApiClient.post<ImageUploadResponse>(
    `/cliente/${idCliente}/imagen/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  console.log(formData);
  return response.data;
};

export const deleteProfileImage = async (): Promise<{ status: string; message: string }> => {
  const response = await interceptorsApiClient.delete<{ status: string; message: string }>("/cliente/imagen/delete");
  return response.data;
};
