import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    set({ user, token });
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("auth_token", token);
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  },
}));

// Hidratação inicial do estado a partir do localStorage
const storedUser = localStorage.getItem("auth_user");
const storedToken = localStorage.getItem("auth_token");
if (storedUser && storedToken) {
  useAuthStore.getState().setAuth(JSON.parse(storedUser), storedToken);
}
