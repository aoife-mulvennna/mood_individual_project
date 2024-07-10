import React, { useState, useEffect } from 'react';
import './MyAccount.css';
import { useAuth } from '../AuthContext'; // Import your authentication context
import { variables } from '../Variables.js';
const MyAccount = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth(); // Use the context to get the user information and token

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        if (!user || !user.id) {
          throw new Error('User ID is not available');
        }

        const userId = user.id; // Get the user ID from the context
        console.log('User ID:', userId);
        const response = await fetch(`${variables.API_URL}student-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Received content type:', contentType);
          throw new Error('Response is not JSON');
        }

        const data = await response.json();
        console.log('Received data:', data);
        setStudentDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setError('Failed to fetch student details');
        setLoading(false);
      }
    };

    if (user && token) {
      fetchStudentDetails();
    }
  }, [user, token]); // Dependency array includes user and token

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  if (!studentDetails) {
    return <p>No student details found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-semibold mb-6 text-center">My Account</h3>
      <div className="account-info space-y-4">
        <p className="text-lg text-gray-700">Student Number: {studentDetails.student_number}</p>
        <p className="text-lg text-gray-700">Student Name: {studentDetails.student_name}</p>
        <p className="text-lg text-gray-700">Student Email: {studentDetails.student_email}</p>
        <p className="text-lg text-gray-700">Course: {studentDetails.course_name}</p>
        <p className="text-lg text-gray-700">Course Year: {studentDetails.academic_year}</p>
      </div>
      <hr className="my-6" />
      <div className="text-center">
        <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">Edit Details</button>
      </div>
    </div>
  );
}

export default MyAccount;
