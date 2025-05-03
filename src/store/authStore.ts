import { Iuser } from "../types/user";

export type AuthStore = {
  logged: boolean;
  user: Iuser | null;

  changeLogged: () => void;
  setUser: (newUser: Iuser) => void;
  logout: () => void;
};
