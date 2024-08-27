// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the theme
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
    return useContext(ThemeContext);
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// useEffect(() => {
//   const savedTheme = localStorage.getItem('theme');
//   if (savedTheme) {
//     setTheme(savedTheme === 'light' ? lightTheme : darkTheme);
//   }
// }, []);
// useEffect(() => {
//   localStorage.setItem('theme', theme === lightTheme ? 'light' : 'dark');

// }, [theme]);

