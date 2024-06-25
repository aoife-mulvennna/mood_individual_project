import './App.css';
import qubLogo from './Photos/QUB_Logo.jpg';
import { DailyTrack } from './DailyTrack/DailyTrack';
import Login from './Login/Login';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import AddStudent from './AddStudent/AddStudent';

import React from 'react';
import useToken from './useToken';

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }
  return (
    <BrowserRouter>
      <div className="App container">
        <div className="Top">
          <div className="logo-container">
            <img src={qubLogo} className="logo" alt="qub logo" />
          </div>
          <h3 className="text-center mb-4 Title">Mood Tracker</h3>
        </div>
        <div className="nav-container">
          <nav className="navbar navbar-expand-sm bg-light navbar-dark">
            <ul className="navbar-nav">
              <li className="nav-item m-1">
                <NavLink className="btn btn-light btn-outline-primary" to="/daily">
                  Daily Tracker
                </NavLink>
              </li>
              <li className="nav-item m-1">
                <NavLink className="btn btn-light btn-outline-primary" to="/add-student">
                  Add Student
                </NavLink>
              </li>
            </ul>
          </nav>


        </div>
        <Routes>
          <Route path='/daily' element={<DailyTrack />} />
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/add-student' element={<AddStudent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
