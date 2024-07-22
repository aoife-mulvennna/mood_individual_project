import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="session-expired">
      <h1>Session Ended</h1>
      <p>Your session has ended. Please log in again.</p>
      <button onClick={handleLoginRedirect}>Login</button>
    </div>
  );
};

export default SessionExpired;
