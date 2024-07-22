import React, { useState } from 'react';
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
import MyRecord from './MyRecord/MyRecord';
import SessionExpired from './SessionExpired';
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
  const showTopBar = location.pathname !== '/login' && location.pathname !== '/create-account' && location.pathname !== '/' && location.pathname !== '/logout';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App font-sans relative">
      {showTopBar && token && (
        <>
          <div className="top-bar flex justify-between items-center bg-gray-800 h-20 px-6">
            <div className="flex items-center">
              <img src={qubLogo} className="logo w-32 h-auto mr-2 mt-3" alt="qub logo" />
              <div className="text-white text-xl font-bold ml-2">QUB Student Pulse</div>
            </div>
            <div className="flex items-center hidden lg:flex lg:w-0 lg:items-center lg:justify-end lg:flex-1 lg:gap-x-12">
              <nav className="navbar flex gap-4">
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
                  to="/my-records"
                >
                  My Records
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

                <NavLink className="nav-link grey-button" to="/logout">Sign out</NavLink>
              </nav>
            </div>

            <div className="lg:hidden">
              <button
                className="text-white bg-gray-700 px-3 py-2 rounded"
                onClick={toggleSidebar}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

              </button>
            </div>
          </div>

          <div className={`sidebar fixed top-0 right-0 h-full w-64 bg-gray-800 text-white p-6 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <button className="mb-4 text-white bg-gray-700 px-3 py-2 rounded" onClick={toggleSidebar}>Close</button>
            <nav className="flex flex-col gap-4">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/dashboard"
                onClick={toggleSidebar}
              >
                Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/daily"
                onClick={toggleSidebar}
              >
                Daily Tracker
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/my-records"
                onClick={toggleSidebar}
              >
                My Records
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/info"
                onClick={toggleSidebar}
              >
                Info
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                to="/my-account"
                onClick={toggleSidebar}
              >
                My Account
              </NavLink>

              <NavLink className="nav-link grey-button" to="/logout" onClick={toggleSidebar}>Sign out</NavLink>
            </nav>
          </div>
        </>

      )}




      <div className="content flex-1 p-6">

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
          <Route path="/my-records" element={<MyRecord />} />
          <Route path="/session-expired" element={<SessionExpired />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
