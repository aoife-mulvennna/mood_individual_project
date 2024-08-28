import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { variables } from '../Variables';
import { jwtDecode } from 'jwt-decode';

const ContactUs = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [studentNumber, setStudentNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        fetchStudentDetails(decodedToken.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      setError('No token found. Please log in.');
    }
  }, []);

  const fetchStudentDetails = (userId) => {
    fetch(`${variables.API_URL}student-details/${userId}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error('Network response was not ok ' + response.statusText);
          });
        }
        return response.json();
      })
      .then(data => {
        setStudentNumber(data.student_number);
      })
      .catch(error => {
        console.error('Error fetching student details:', error);
      });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const emailData = {
      subject: 'A student has contacted the Pulse team',
      message: `Student Number: ${studentNumber}\n\n${message}`,
    };

    try {
      const response = await fetch(`${variables.API_URL}contact-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        setError('Failed to send email.');
        return;
      }

      setSuccess('Email sent successfully.');
      setMessage('');
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white">
      <h3 className="text-center text-2xl font-semibold mb-6 text-gray-800">Contact Us</h3>
      {success && (
        <div className="text-green-500 text-center mb-4">{success}</div>
      )}
      <form onSubmit={handleSendEmail}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300"
            rows="6"
          />
        </div>
        <div className="flex justify-center mb-4 space-x-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2font-semibold hover:bg-gray-600 transition"
            onClick={() => navigate('/')}
          >
            Go Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 font-semibold hover:bg-blue-600 transition"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
