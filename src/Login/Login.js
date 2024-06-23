import React, { useState } from 'react';
import { variables } from '../Variables.js';
import './Login.css';
import PropTypes from 'prop-types';

async function loginUser(credentials) {
  return fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      return response.json();
    })
    .catch(error => {
      alert(error.message);
      throw error;
    })
}

export function Login({ setToken }) {
  const [studentNumber, setStudentNumber] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      studentNumber,
      password
    });
    setToken(token);
  }

  return (
    <div className="login-wrapper">
      <h3>Please Log In </h3>
      <form onSubmit={handleSubmit} >
        <label>
          <p>Student Number</p>
          <input type="number" onChange={e => setStudentNumber(e.target.value)} required />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} required />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}



// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications