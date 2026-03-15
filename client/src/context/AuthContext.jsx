import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { DEMO_MODE, getDemoUser } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ssipmt_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('ssipmt_access') || null);

  const login = useCallback(async (email, password) => {
    if (DEMO_MODE) {
      const demoUser = getDemoUser(email);
      localStorage.setItem('ssipmt_access', 'demo_token_' + demoUser.role);
      localStorage.setItem('ssipmt_refresh', 'demo_refresh_' + demoUser.role);
      localStorage.setItem('ssipmt_user', JSON.stringify(demoUser));
      setAccessToken('demo_token_' + demoUser.role);
      setUser(demoUser);
      return demoUser;
    }
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('ssipmt_access', data.accessToken);
    localStorage.setItem('ssipmt_refresh', data.refreshToken);
    localStorage.setItem('ssipmt_user', JSON.stringify(data.user));
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    if (DEMO_MODE) {
      const demoUser = getDemoUser(payload?.email || 'student');
      localStorage.setItem('ssipmt_access', 'demo_token_' + demoUser.role);
      localStorage.setItem('ssipmt_refresh', 'demo_refresh_' + demoUser.role);
      localStorage.setItem('ssipmt_user', JSON.stringify(demoUser));
      setAccessToken('demo_token_' + demoUser.role);
      setUser(demoUser);
      return demoUser;
    }
    const { data } = await api.post('/api/auth/register', payload);
    localStorage.setItem('ssipmt_access', data.accessToken);
    localStorage.setItem('ssipmt_refresh', data.refreshToken);
    localStorage.setItem('ssipmt_user', JSON.stringify(data.user));
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ssipmt_access');
    localStorage.removeItem('ssipmt_refresh');
    localStorage.removeItem('ssipmt_user');
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (DEMO_MODE) {
      const token = 'demo_token_refreshed';
      localStorage.setItem('ssipmt_access', token);
      setAccessToken(token);
      return token;
    }
    const refreshToken = localStorage.getItem('ssipmt_refresh');
    if (!refreshToken) throw new Error('No refresh token');
    const { data } = await api.post('/api/auth/refresh', { refreshToken });
    localStorage.setItem('ssipmt_access', data.accessToken);
    setAccessToken(data.accessToken);
    return data.accessToken;
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
