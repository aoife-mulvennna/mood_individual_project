import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenValidity = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
          if (isTokenExpired(decoded)) {
            handleSessionExpired();
          }
        } catch (error) {
          console.error('Invalid token:', error);
          handleSessionExpired();
        }
      } else {
        setUser(null);
      }
    };

    checkTokenValidity();
  }, [token, location.pathname]);  // Added location.pathname as a dependency


  const isTokenExpired = (decodedToken) => {
    return decodedToken.exp * 1000 < Date.now();
  };
  const handleSessionExpired = () => {
    logout();
    navigate('/'); // Redirect to the landing page when the session expires
  };

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null); // Reset the user state
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
