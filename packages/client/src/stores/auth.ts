import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAuth: (user: User | null, session: Session | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      }),
    setSession: (session) =>
      set((state) => {
        state.session = session;
      }),
    setIsLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),
    setAuth: (user, session) =>
      set((state) => {
        state.user = user;
        state.session = session;
        state.isAuthenticated = !!user;
        state.isLoading = false;
      }),
    clearAuth: () =>
      set((state) => {
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      }),
  })),
);

export const useShallowAuthStore = <TSelected>(
  selector: (state: AuthState & AuthActions) => TSelected,
): TSelected => {
  return useAuthStore(useShallow(selector));
};
