// Logout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Logout = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth();
    const [message, setMessage] = useState('');
  

  useEffect(() => {
    const handleLogout = async () => {
        try {
          // Clear any session/token information
          setIsLoggedIn('');
          sessionStorage.removeItem('token');
          // Optionally, you can clear other state or local storage items related to the user session
  
          // Delay the message display for visual feedback (optional)
          await new Promise((resolve) => setTimeout(resolve, 500));
  
          setMessage('Logged out successfully');
          // Navigate to the login page or home page after logout
          navigate('/'); // Example: Navigate to the login page after logout
        } catch (error) {
          console.error('Logout error:', error);
          setMessage('Logout failed'); // Set an error message if logout fails
        }
      };

    handleLogout();
  }, [navigate, setIsLoggedIn]); // useEffect dependency to prevent unnecessary re-renders

    // Function to dismiss the message manually (optional)
    const dismissMessage = () => {
        setMessage('');
      };

      return (
    <div className="logout">
      {message && (
        <div className="logout-message">
          <h3>{message}</h3>

          <button onClick={dismissMessage}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default Logout;
