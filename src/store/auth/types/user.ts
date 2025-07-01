export interface IUser {
  token: string;
  roles: string[];
  id: string;
  email: string;
  name: string;
  picture: string;
  apellido?: string;
  telefono?: string | null;
  imagen?: string | null;
}

export interface AuthStore {
  user: IUser | null;
  isTokenReady: boolean;
  isProfileComplete: boolean;
  setUser: (user: IUser) => void;
  clearUser: () => void;
  setIsProfileComplete: (status: boolean) => void;
  setTokenReady: (ready: boolean) => void;
  setProfileData: (data: {
    apellido?: string | null;
    telefono?: string | null;
    roles?: string[] | null;
    imagen?: string | null;
    email?: string;
    name?: string;
    picture?: string;
    id?: string;
  }) => void;
}
