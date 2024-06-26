// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');

  const setIsLoggedIn = (newToken) => {
    if (newToken) {
      sessionStorage.setItem('token', newToken);
    } else {
      sessionStorage.removeItem('token');
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
