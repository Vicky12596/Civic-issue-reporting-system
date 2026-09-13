import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cc_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('cc_user', JSON.stringify(user));
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cc_token', data.token);
    const loggedInUser = { id: data.userId, fullName: data.fullName, email: data.email, roles: data.roles };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('cc_token', data.token);
    const registeredUser = { id: data.userId, fullName: data.fullName, email: data.email, roles: data.roles };
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setUser(null);
  };

  const isAdmin = !!user?.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
