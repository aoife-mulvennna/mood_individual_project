import React from 'react';
import { BrowserRouter, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { DailyTrack } from './DailyTrack/DailyTrack';
import { AuthProvider, useAuth } from './AuthContext'; // Make sure useAuth is imported correctly
import Login from './Login/Login';
import AddStudent from './AddStudent/AddStudent';
import LandingPage from './LandingPage/LandingPage';
import Dashboard from './Dashboard/Dashboard';
import MyAccount from './MyAccount/MyAccount'; // Import MyAccount
import Info from './Info/Info'; // Import Info
import Logout from './Logout/Logout'; // Import Logout component
import AddStaff from './AddStaff';
import './App.css';
import qubLogo from './Photos/QUB_Logo.jpg';

function App() {
  return (
      <BrowserRouter>
          <AuthProvider>
      <Main />
      </AuthProvider>
      </BrowserRouter>
  );
}

const Main = () => {
  const { token, user } = useAuth(); // Ensure useAuth is correctly imported
const location = useLocation();
const showTopBar = location.pathname !== '/login' && location.pathname !=='/create-account' && location.pathname !=='/' && location.pathname !=='/logout';

  return (
    <div className="App">
      {showTopBar && token && (
        <div className="top-bar">
          <div className="logo-container">
            <img src={qubLogo} className="logo" alt="qub logo" />
            <div className="app-title">QUB Student Pulse</div>
          </div>
          <div className="nav-container">
            <nav className="navbar">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/dashboard"
              >
                Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/daily"
              >
                Daily Tracker
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/info"
              >
                Info
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/my-account"
              >
                My Account
              </NavLink>
              {user && user.role === 'admin' && (
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                  to="/add-staff"
                >
                  Add Staff
                </NavLink>
              )}
              <NavLink className="nav-link grey-button" to="/logout">Sign out</NavLink>
            </nav>
          </div>
        </div>
      )}
      <div className="content">
        
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<AddStudent />} />
          <Route path="/daily" element={<DailyTrack />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/info" element={<Info />} /> {/* Route to Info page */}
          <Route path="/my-account" element={<MyAccount />} /> {/* Route to My Account page */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/add-staff" element={<AddStaff />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
