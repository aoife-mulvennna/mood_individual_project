import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { variables } from '../Variables.js';

const MyAccount = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
  const [visiblePasswordField, setVisiblePasswordField] = useState(null);
  const { user, token } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);


  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        if (!user || !user.id) {
          throw new Error('User ID is not available');
        }

        const userId = user.id;
        const response = await fetch(`${variables.API_URL}student-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }

        const data = await response.json();
        setStudentDetails(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch student details');
        setLoading(false);
      }
    };

    if (user && token) {
      fetchStudentDetails();
    }
  }, [user, token]);

  const handleThemeChange = (e) => {
    toggleTheme(e.target.value);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${variables.API_URL}change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        if (errorData.message === 'Incorrect current password. Try again.') {
          throw new Error('Incorrect current password. Try again.');
        } else {
          throw new Error('Failed to change password');
        }
      }

      setPasswordChangeSuccess('Password changed successfully');
      setPasswordChangeError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setVisiblePasswordField(null);
    } catch (error) {
      if (error.message === 'Incorrect current password. Try again.') {
        setPasswordChangeError('Incorrect current password. Try again.');
      } else {
        setPasswordChangeError('Failed to change password');
      }
      setPasswordChangeSuccess(null);
    }
  };

  const togglePasswordVisibility = (field) => {
    setVisiblePasswordField(visiblePasswordField === field ? null : field);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!studentDetails) {
    return <p className="text-center text-gray-500">No student details found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 theme-bg-primary">
      <h3 className="text-3xl font-semibold mb-4 text-center theme-text-primary">My Account</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-2xl font-semibold mb-4 theme-text-primary">Account Details</h4>
          <p className="text-lg theme-text-secondary">Student Number: {studentDetails.student_number}</p>
          <p className="text-lg theme-text-secondary">Student Name: {studentDetails.student_name}</p>
          <p className="text-lg theme-text-secondary">Student Email: {studentDetails.student_email}</p>
          <p className="text-lg theme-text-secondary">Course: {studentDetails.course_name}</p>
          <p className="text-lg theme-text-secondary">Course Year: {studentDetails.academic_year}</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-2xl font-semibold mb-4 theme-text-primary">Change Password</h4>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="relative">
              <label htmlFor="currentPassword" className="block theme-text-primary">Current Password</label>
              <input
                type={visiblePasswordField === 'currentPassword' ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border"
                required
              />
              <span
                onClick={() => togglePasswordVisibility('currentPassword')}
                className="absolute right-5 bottom-2 cursor-pointer theme-text-ternary"
              >
                {visiblePasswordField === 'currentPassword' ? (
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
            <div className="relative">
              <label htmlFor="newPassword" className="block theme-text-primary">New Password</label>
              <input
                type={visiblePasswordField === 'newPassword' ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border"
                required
              />
              <span
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute right-5 bottom-2 cursor-pointer theme-text-ternary"
              >
                {visiblePasswordField === 'newPassword' ? (
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
            <div className="relative">
              <label htmlFor="confirmPassword" className="block theme-text-primary">Confirm New Password</label>
              <input
                type={visiblePasswordField === 'confirmPassword' ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border"
                required
              />
              <span
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-5 bottom-2 cursor-pointer theme-text-ternary"
              >
                {visiblePasswordField === 'confirmPassword' ? (
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
            {passwordChangeError && <p className="text-red-500">{passwordChangeError}</p>}
            {passwordChangeSuccess && <p className="text-green-500">{passwordChangeSuccess}</p>}
            <div className="text-center">
              <button type="submit" className="block appearance-none w-full theme-button-bg theme-text-ternary py-2 px-3 pr-8 sm:text-sm leading-tight focus:outline-none focus:border-red-500">Change Password</button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-6 relative">
        <label htmlFor="theme" className="block theme-primary-text">Theme</label>
        <select id="theme" value={theme} onChange={handleThemeChange} className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 sm:text-sm leading-tight focus:outline-none focus:border-red-500 rounded-none">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="pink">Pink</option>
        </select>
        <div class="pointer-events-none absolute right-5 bottom-1 cursor-pointer text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>

      </div>
    </div>
  );
};

export default MyAccount;