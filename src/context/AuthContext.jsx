import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('elevate_role') || null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('elevatex_token');
    if (token) {
      authAPI
        .me()
        .then((u) => {
          setUser(u);
          setRole(u.role || localStorage.getItem('elevate_role'));
        })
        .catch(() => {
          localStorage.removeItem('elevatex_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { token, user: u } = await authAPI.login({ email, password });
    localStorage.setItem('elevatex_token', token);
    localStorage.setItem('elevate_role', u.role);
    setUser(u);
    setRole(u.role);
    return u;
  };

  const register = async (name, email, password, selectedRole) => {
    const { token, user: u } = await authAPI.register({ name, email, password, role: selectedRole });
    localStorage.setItem('elevatex_token', token);
    localStorage.setItem('elevate_role', u.role);
    setUser(u);
    setRole(u.role);
    return u;
  };

  const setUserRole = (r) => {
    setRole(r);
    localStorage.setItem('elevate_role', r);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('elevatex_token');
    localStorage.removeItem('elevate_role');
    localStorage.removeItem('elevate_onboarded');
  };

  const updateUser = (updates) => setUser((prev) => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, role, setUserRole, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

