import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { variables } from '../Variables.js';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [studentNumber, setStudentNumber] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(false); // State to manage password visibility

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

  const togglePasswordVisibility = () => {
    setVisiblePassword(!visiblePassword);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-bold text-center mb-6">Please Log In</h3>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Number</label>
            <input
              type="number"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={visiblePassword ? "text" : "password"}
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute  right-5 bottom-2 cursor-pointer text-gray-500"
            >
              {visiblePassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
            >
              Submit
            </button>
            <Link to="/create-account" className="text-sm text-red-500 hover:underline">
              Don't have an account? Sign up here
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">
              Forgot your password? Click here to reset it.
            </Link>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:underline"
            >
              Go back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications