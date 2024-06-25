import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [student_number, setStudentNumber] = useState('');
  const [student_password, setStudentPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentNumber: student_number, student_password: student_password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token); // Store the token

        window.location.href = '/daily'; // Example redirect
        console.log('Login successful');
      } else {
        const errorText = await response.text(); 
        alert(`Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while logging in');
    }
  };

  return (
    <div className="login-wrapper">
      <h3>Please Log In </h3>
      <form onSubmit={handleLogin} >
        <label>
          <p>Student Number</p>
          <input type="number" onChange={e => setStudentNumber(e.target.value)} required />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setStudentPassword(e.target.value)} required />
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