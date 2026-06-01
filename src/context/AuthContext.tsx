import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { api } from '@/lib/api';
import { DEMO_ACCOUNTS } from '@/lib/roles';
import { useData } from '@/context/DataContext';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  register: (data: { fullName: string; email: string; password: string; departmentId: number | null }) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'helpdesk_session_user_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { version } = useData();
  const [userId, setUserId] = useState<number | null>(() => {
    const v = sessionStorage.getItem(SESSION_KEY);
    return v ? Number(v) : null;
  });

  const user = useMemo(
    () => (userId ? api.getUser(userId) ?? null : null),
    [userId, version],
  );

  const setSession = (id: number | null) => {
    if (id) sessionStorage.setItem(SESSION_KEY, String(id));
    else sessionStorage.removeItem(SESSION_KEY);
    setUserId(id);
  };

  const value: AuthContextValue = {
    user,
    login(email, password) {
      const u = api.getUserByEmail(email);
      if (u && u.password === password) {
        api.auditLogin(u.id, 'login');
        setSession(u.id);
        return true;
      }
      return false;
    },
    loginAsRole(role) {
      const email = DEMO_ACCOUNTS[role];
      const u = api.getUserByEmail(email);
      if (u) {
        api.auditLogin(u.id, 'quick_role_login');
        setSession(u.id);
      }
    },
    logout() {
      if (user) api.auditLogin(user.id, 'logout');
      setSession(null);
    },
    register(data) {
      if (api.getUserByEmail(data.email)) return false;
      const u = api.registerUser(data);
      setSession(u.id);
      return true;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside provider');
  return ctx;
}
