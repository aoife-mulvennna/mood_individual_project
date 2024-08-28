import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import { ThemeProvider } from './ThemeContext';
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
  const { token, logout } = useAuth(); // Ensure useAuth is correctly imported
  const location = useLocation();
  const showTopBar = location.pathname !== '/login' && location.pathname !== '/create-account' && location.pathname !== '/' && location.pathname !== '/logout';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Array of routes that should not have theming
  const noThemeRoutes = ['/', '/login', '/create-account', '/logout'];
  const shouldApplyTheme = !noThemeRoutes.includes(location.pathname);

  return (
    <div className="App font-sans relative ">
      {showTopBar && token && (
        <>
          <div className="top-bar flex justify-between items-center theme-topbar-bg h-20 px-4 sm:px-6">
            {/* Left Section: Logo, Title, and Navigation Links */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center mr-4">
                <img src={qubLogo} className="logo w-32 h-auto mr-2 mt-3" alt="qub logo" />
                <div className="theme-primary-text text-2xl font-bold">QUB Student Pulse</div>
              </div>
              <nav className="navbar hidden lg:flex gap-1 sm:gap-2">
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-active-txt theme-active-bg' : 'nav-link theme-nav-bg theme-nav-txt')}
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-active-txt theme-active-bg' : 'nav-link theme-nav-bg theme-nav-txt')}
                  to="/daily"
                >
                  Daily Tracker
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-active-txt theme-active-bg' : 'nav-link theme-nav-bg theme-nav-txt')}
                  to="/my-records"
                >
                  My Records
                </NavLink>
                <NavLink
                  className={({ isActive }) => (isActive ? 'nav-link active-link theme-active-txt theme-active-bg' : 'nav-link theme-nav-bg theme-nav-txt')}
                  to="/resources"
                >
                  Resources
                </NavLink>
              </nav>
            </div>

            {/* Right Section: Account and Sign Out */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-x-4">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active-link theme-active-txt theme-active-bg flex items-center gap-2 px-4 py-2'
                    : 'nav-link theme-nav-bg theme-nav-txt flex items-center gap-2 px-4 py-2'
                }
                to="/my-account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <span>Account</span>
              </NavLink>
              <NavLink className="signout-button theme-nav-bg theme-nav-txt flex gap-2 items-center px-3 py-2" to="/logout">
                <span>Sign out</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>

              </NavLink>
            </div>

            <div className="lg:hidden">
              <button
                className="theme-button-bg theme-button-text px-3 py-2"
                onClick={toggleSidebar}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>


          <div className={`sidebar fixed top-0 right-0 h-full w-64 theme-primary-bg theme-primary-text p-6 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out l`}>
            <button className="mb-4 theme-button-bg theme-button-text px-3 py-2" onClick={toggleSidebar}>Close</button>
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
                to="/resources"
                onClick={toggleSidebar}
              >
                Resources
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active-link theme-primary-text theme-active-link' : 'nav-link theme-primary-text')}
                to="/my-account"
                onClick={toggleSidebar}
              >
                My Account
              </NavLink>
              <NavLink className="nav-link signout-button theme-button-bg theme-button-text " to="/logout" onClick={toggleSidebar}>Sign out</NavLink>
            </nav>
          </div>
        </>
      )}

      {shouldApplyTheme ? (
        <ThemeProvider>
          <Content />
        </ThemeProvider>
      ) : (
        <Content />
      )}
    </div>
  );
};
const Content = () => {
  return (
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
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/add-staff" element={<AddStaff />} />
      <Route path="/my-records" element={<MyRecord />} />
      <Route path="/session-expired" element={<SessionExpired />} />
      <Route path="/resources" element={<ResourcesPage />} />
    </Routes>
  );
}

export default App;
