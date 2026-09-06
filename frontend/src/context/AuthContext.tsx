import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sai_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          localStorage.setItem('sai_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('sai_token', res.token);
    localStorage.setItem('sai_user', JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const res = await api.register({ name, email, phone, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('sai_token', res.token);
    localStorage.setItem('sai_user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sai_token');
    localStorage.removeItem('sai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
