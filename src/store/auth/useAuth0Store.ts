import { create } from "zustand";
import type { AuthStore } from "./types/user";

interface ExtendedAuthStore extends AuthStore {
  isTokenReady: boolean;
  setTokenReady: (ready: boolean) => void;
}

export const useAuth0Store = create<ExtendedAuthStore>((set) => ({
  user: {
    token: "",
    roles: [],
  },
  isTokenReady: false,
  setUser: (user) => set({ user, isTokenReady: true }),
  setTokenReady: (ready) => set({ isTokenReady: ready }),
  clearUser: () => set({ user: { token: "", roles: [] }, isTokenReady: false }),
}));
