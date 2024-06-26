import React from 'react';
import { BrowserRouter, Route, Routes, NavLink, Navigate} from 'react-router-dom';
import { DailyTrack } from './DailyTrack/DailyTrack';
import { AuthProvider, useAuth } from './AuthContext';
import PrivateRoute from './PrivateRoute';

import Login from './Login/Login';
import AddStudent from './AddStudent/AddStudent';
import LandingPage from './LandingPage/LandingPage';
import Dashboard from './Dashboard/Dashboard';
import MyAccount from './MyAccount/MyAccount'; // Import MyAccount
import Info from './Info/Info'; // Import Info
import Logout from './Logout/Logout'; // Import Logout component

import useToken from './useToken';

import './App.css';
import qubLogo from './Photos/QUB_Logo.jpg';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </AuthProvider>
  );
}
const Main = () => {
  const { token } = useAuth();

  
  return (
      <div className="App">
        {token && (
        <div className="top-bar">
          <div className="logo-container">
            <img src={qubLogo} className="logo" alt="qub logo" />
            <div className="app-title">QUB Student Pulse</div>
          </div>
          <div className="nav-container">
            <nav className="navbar">
              <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              <NavLink className="nav-link" to="/daily">Daily Tracker</NavLink>
              <NavLink className="nav-link" to="/info">Info</NavLink>
              <NavLink className="nav-link" to="/my-account">My Account</NavLink>
              <NavLink className="nav-link grey-button" to="/logout">Sign out</NavLink>
            </nav>
          </div>
        </div>
)}
        <div className="content">
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/create-account' element={<AddStudent />} />
            <Route path='/daily' element={<DailyTrack />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/info' element={<Info />} /> {/* Route to Info page */}
            <Route path='/my-account' element={<MyAccount />} /> {/* Route to My Account page */}
            <Route path='/logout' element={<Logout />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
