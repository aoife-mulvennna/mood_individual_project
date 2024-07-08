import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { variables } from '../Variables.js';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [studentNumber, setStudentNumber] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log('Attempting login with:', { studentNumber, studentPassword });

    try {
      const response = await fetch(variables.API_URL + 'login/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentNumber, studentPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token); // Assuming login sets the token in context
        sessionStorage.setItem('token', data.token); // Store token in sessionStorage
        console.log('Login successful');
        navigate('/dashboard');
      } else {
        console.log('Login failed:', data.message);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while logging in');
    }
  };
 
  return (
    <div className="login-wrapper">
      <h3>Please Log In </h3>
      <form className="login-form" onSubmit={handleLogin} >
        <label>
          <p>Student Number</p>
          <input type="number" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} required />
        </label>
        <label>
          <p>Password</p>
          <input type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} required />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Login;


// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications