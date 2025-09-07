import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthStore, IUser } from "./types/user";

interface MyAuthStore extends AuthStore {
  isTokenReady: boolean;
  setTokenReady: (ready: boolean) => void;
  // Método para limpiar completamente el estado
  resetAuthState: () => void;
}

const initialState = {
  user: null,
  isTokenReady: false,
  isProfileComplete: false,
};

export const useAuth0Store = create<MyAuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (userOrUpdater: IUser | ((prevUser: IUser | null) => IUser | null)) =>
        set((state) => {
          const newUser = typeof userOrUpdater === "function" ? userOrUpdater(state.user) : userOrUpdater;
          return {
            user: newUser,
            isTokenReady: newUser ? true : false,
          };
        }),

      setTokenReady: (ready: boolean) => set({ isTokenReady: ready }),

      clearUser: () => set(initialState),

      resetAuthState: () => set(initialState),

      setIsProfileComplete: (status: boolean) => set({ isProfileComplete: status }),

      setProfileData: (data: {
        apellido?: string | null;
        telefono?: string | null;
        roles?: string[] | null;
        imagen?: string | null;
        email?: string;
        name?: string;
        picture?: string;
        id?: string;
      }) => {
        set((state) => {
          if (!state.user) return state;

          const updatedUser: IUser = {
            ...state.user,
            apellido:
              data.apellido !== undefined ? (data.apellido === null ? undefined : data.apellido) : state.user.apellido,
            telefono: data.telefono !== undefined ? data.telefono : state.user.telefono,
            imagen: data.imagen !== undefined ? data.imagen : state.user.picture,
            email: data.email !== undefined ? data.email : state.user.email,
            name: data.name !== undefined ? data.name : state.user.name,
            id: data.id !== undefined ? data.id : state.user.id,
            roles: data.roles ? data.roles : state.user.roles,
          };

          return {
            user: updatedUser,
            isProfileComplete: true,
          };
        });
      },
    }),
    {
      name: "auth0-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isTokenReady: state.isTokenReady,
        isProfileComplete: state.isProfileComplete,
      }),
      // Limpiar storage en caso de errores
      onRehydrateStorage: () => (state) => {
        if (state && !state.user) {
          state.resetAuthState?.();
        }
      },
    },
  ),
);
