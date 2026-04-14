import React, { createContext, useEffect, useMemo, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('mwj-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mwj-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mwj-user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const updateUser = (updates) => {
    setUser((currentUser) => (currentUser ? { ...currentUser, ...updates } : currentUser));
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, updateUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
