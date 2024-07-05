// MyAccount.js

import React, { useState, useEffect } from 'react';
import './MyAccount.css';

const MyAccount = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await fetch(`/api/student-details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json();
        setStudentDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setError('Failed to fetch student details');
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, []);

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
    <div className="my-account">
      <h1>My Account</h1>
      <div className="account-info">
        <p>Student Number: {studentDetails.student_number}</p>
        <p>Student Email: {studentDetails.student_email}</p>
 <hr/>
      </div>
    </div>
  );
}
export default MyAccount;
