import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { DailyTrack } from './DailyTrack/DailyTrack';
import { AuthProvider, useAuth } from './AuthContext'; // Make sure useAuth is imported correctly
import Login from './Login/Login';
import ForgotPassword from './Login/ForgotPassword';
import ResetPassword from './Login/ResetPassword';
import AddStudent from './AddStudent/AddStudent';
import LandingPage from './LandingPage/LandingPage';
import Dashboard from './Dashboard/Dashboard';
import ContactUs from './Dashboard/ContactUs';
import Variables from './Variables';
import MyAccount from './MyAccount/MyAccount'; // Import MyAccount
import Info from './Info/Info'; // Import Info
import Logout from './Logout/Logout'; // Import Logout component
import AddStaff from './AddStaff';
import MyRecord from './MyRecord/MyRecord';
import ResourcesPage from './Resources/ResourcesPage';
import Resources from './Resources/Resources';
import SessionExpired from './SessionExpired';
import './App.css';
import qubLogo from './Photos/QUB_Logo.jpg';
import './themes.css';

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
  const { token } = useAuth(); // Ensure useAuth is correctly imported
  const location = useLocation();
  const showTopBar = location.pathname !== '/login' && location.pathname !== '/create-account' && location.pathname !== '/' && location.pathname !== '/logout';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App font-sans relative ">
      {showTopBar && token && (
        <>
          <div className="top-bar flex justify-between items-center theme-topbar-bg h-20 px-6">
            <div className="flex items-center">
              <img src={qubLogo} className="logo w-32 h-auto mr-2 mt-3" alt="qub logo" />
              <div className="theme-primary-text text-xl font-bold ml-2">QUB Student Pulse</div>
            </div>
            <div className="flex items-center hidden lg:flex lg:w-0 lg:items-center lg:justify-end lg:flex-1 lg:gap-x-12">
              <nav className="navbar flex gap-4">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                  to="/daily"
                >
                  Daily Tracker
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                  to="/my-records"
                >
                  My Records
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                  to="/info"
                >
                  Info
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                  to="/my-account"
                >
                  My Account
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                  to="/resources"
                >
                  Resources
                </NavLink>

                <NavLink className="nav-link grey-button theme-button-bg theme-button-text" to="/logout">Sign out</NavLink>
              </nav>
            </div>

            <div className="lg:hidden">
              <button
                className="theme-button-bg theme-button-text px-3 py-2 rounded"
                onClick={toggleSidebar}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`sidebar fixed top-0 right-0 h-full w-64 theme-primary-bg theme-primary-text p-6 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <button className="mb-4 theme-button-bg theme-button-text px-3 py-2 rounded" onClick={toggleSidebar}>Close</button>
            <nav className="flex flex-col gap-4">
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                to="/dashboard"
                onClick={toggleSidebar}
              >
                Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                to="/daily"
                onClick={toggleSidebar}
              >
                Daily Tracker
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                to="/my-records"
                onClick={toggleSidebar}
              >
                My Records
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                to="/info"
                onClick={toggleSidebar}
              >
                Info
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                to="/my-account"
                onClick={toggleSidebar}
              >
                My Account
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                to="/resources"
                onClick={toggleSidebar}
              >
                Resources
              </NavLink>

              <NavLink className="nav-link grey-button theme-button-bg theme-button-text " to="/logout" onClick={toggleSidebar}>Sign out</NavLink>
            </nav>
          </div>
        </>
      )}

      <div className="content flex-1 p-6">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/create-account" element={<AddStudent />} />
          <Route path="/daily" element={<DailyTrack />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/info" element={<Info />} /> {/* Route to Info page */}
          <Route path="/my-account" element={<MyAccount />} /> {/* Route to My Account page */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/contact-us" element={<ContactUs/>}/>
          <Route path="/add-staff" element={<AddStaff />} />
          <Route path="/my-records" element={<MyRecord />} />
          <Route path="/session-expired" element={<SessionExpired />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
