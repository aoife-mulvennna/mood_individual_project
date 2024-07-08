import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirm = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="confirmation-page">
      <h2>Are you sure you want to log out?</h2>
      <div className="confirmation-buttons">
        <button className="btn-confirm" onClick={handleConfirm}>Yes, I'm sure</button>
        <button className="btn-cancel" onClick={handleCancel}>No, go back</button>
      </div>
    </div>
  );
};

export default Logout;
