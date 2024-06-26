// Dashboard.js

import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <div className="card-container">
        <div className="card">
          <h3>Stats</h3>
          <p>Your stats here...</p>
        </div>
        <div className="card">
          <h3>Recent Activity</h3>
          <p>Recent activity details...</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
