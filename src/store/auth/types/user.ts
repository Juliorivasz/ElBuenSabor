export interface IUser {
  token: string;
  roles: string[];
}

export interface AuthStore {
  user: IUser;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}
