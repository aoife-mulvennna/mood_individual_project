import React, { useState} from 'react';
// import './AddStaff.css'; // You can create this file to style your form
import { variables } from './Variables'; // Ensure you have this imported correctly


const AddStaff = () => {
  const [staffNumber, setStaffNumber] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    return email.endsWith('@qub.ac.uk');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(staffEmail)) {
      setErrorMessage('Please use your QUB email address.');
      setSuccessMessage('');
      return;
    }
    const newStaff = {
      staff_number: staffNumber,
      staff_name: staffName,
      staff_email: staffEmail,
      staff_password: staffPassword,
      role: 'admin', // Assuming staff is added as admin
    };

    try {
      const response = await fetch(`${variables.API_URL}staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStaff)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add staff line 44');
      }

      setSuccessMessage('Staff added successfully');
      setErrorMessage('');

      console.log('Staff added successfully:', data.message);
      // Display success message to user (optional)
    } catch (error) {
      setErrorMessage('Failed to add staff');
      setSuccessMessage('');
      console.error('Error adding staff:', error.message);
      // Display error message to user (e.g., toast, alert, or set state for error message in UI)
    }
  };

  return (
    <div className="add-staff-form">
      <h2>Add New Staff</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Staff Number:</label>
          <input type="text" value={staffNumber} onChange={(e) => setStaffNumber(e.target.value)} required />
        </div>
        <div>
          <label>Staff Name:</label>
          <input type="text" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
        </div>
        <div>
          <label>Staff Email:</label>
          <input type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} required />
        </div>
        <button type="submit">Add Staff</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default AddStaff;
