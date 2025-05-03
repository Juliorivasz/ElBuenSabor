import { create } from "zustand";
import { Iuser } from "../types/user";
import { AuthStore } from "./authStore";

export const useAuthStore = create<AuthStore>((set) => ({
  logged: false,
  user: null,
  changeLogged: () => {
    set((state) => ({
      logged: !state.logged,
    }));
  },
  setUser: (newUser: Iuser) => {
    set(() => ({
      user: newUser,
    }));
  },
  logout: () => {},
}));
