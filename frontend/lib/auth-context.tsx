"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { clearToken, getMe, getToken, setToken } from "./api";
import type { AuthUser, Usuario } from "./types";

interface AuthContextValue {
  user: AuthUser | Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (accessToken: string, user: AuthUser) => void;
  signInWithToken: (accessToken: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- não há dado para buscar
      setIsLoading(false);
      return;
    }

    getMe()
      .then((usuario) => setUser(usuario))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback((accessToken: string, authUser: AuthUser) => {
    setToken(accessToken);
    setUser(authUser);
  }, []);

  // Usado no retorno do login com Google: o backend redireciona só com o
  // token na URL, então buscamos os dados do usuário separadamente.
  const signInWithToken = useCallback(async (accessToken: string) => {
    setToken(accessToken);
    try {
      const usuario = await getMe();
      setUser(usuario);
    } catch (err) {
      clearToken();
      setUser(null);
      throw err;
    }
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    const usuario = await getMe();
    setUser(usuario);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signInWithToken,
      signOut,
      refreshUser,
    }),
    [user, isLoading, signIn, signInWithToken, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider.");
  }
  return context;
}
