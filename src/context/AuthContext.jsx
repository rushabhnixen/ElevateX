import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('elevate_role') || null);
  const [loading, setLoading] = useState(false);

  const setUserRole = (r) => {
    setRole(r);
    localStorage.setItem('elevate_role', r);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('elevate_role');
    localStorage.removeItem('elevate_onboarded');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, setUserRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
