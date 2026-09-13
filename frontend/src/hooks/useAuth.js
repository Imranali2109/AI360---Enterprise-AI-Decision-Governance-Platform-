import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try { return stored ? JSON.parse(stored) : null; } catch { return null; }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verify token on mount and fetch fresh user data
  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => {
          // After interceptor: res is { user } object (from getMe which wraps in { success, data: { user } })
          // Actually getMe returns { success, user } — no data key — so interceptor passes it as-is
          const userData = res?.user ?? res;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          // Invalid/expired token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Login — calls POST /api/auth/login
   * After interceptor, response is { success, token, user }
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const newToken = res.token;
    const newUser = res.user;
    if (!newToken) throw new Error('Login failed');
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token
  };
}
