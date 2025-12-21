import { create } from "zustand";
import type { User } from "firebase/auth";
import type { UserModel } from "../models/auth.model";

export interface AuthStore {
  authUser: User | null;
  setAuthUser: (authUser: User | null) => void;

  dbUser: UserModel | null;
  setDbUser: (dbUser: UserModel | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  setAuthUser: (authUser) => {
    set(() => ({ authUser }));
  },

  dbUser: null,
  setDbUser: (dbUser) => {
    set(() => ({ dbUser }));
  },
}));
