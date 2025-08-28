'use client';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getToken, setToken, clearToken } from '@/lib/auth';
import { api } from '@/lib/api';
import type { User } from '@/types/index';

interface Ctx {
  user: User | null;
  ready: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<Ctx>({
  user: null,
  ready: false,
  setAuth: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (token) {
        try {
          const me = await api.me();
          setUser(me);
        } catch {
          clearToken();
          setUser(null);
        }
      }
      setReady(true);
    })();
  }, []);

  const setAuth = useCallback((u: User, t: string) => {
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(()=>({ user, ready, setAuth, logout }), [user, ready, setAuth, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
