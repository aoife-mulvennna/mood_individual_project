import React, { useState, useEffect } from 'react';
import './AddStudent.css'; // You can create this file to style your form
import { variables } from '../Variables'; // Ensure you have this imported correctly
import { useNavigate, Link } from 'react-router-dom';

const AddStudentForm = () => {
    const [studentNumber, setStudentNumber] = useState('');
    const [studentName, setStudentName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [courseNames, setCourseNames] = useState([]);
    const [selectedCourseName, setSelectedCourseName] = useState('');
    const [courseYears, setCourseYears] = useState([]);
    const [selectedCourseYear, setSelectedCourseYear] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [existingAccountMessage, setExistingAccountMessage] = useState('');
    const navigate = useNavigate();
  

    // Fetch course names and years when the component mounts
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Fetch course names
                const responseCourseNames = await fetch(`${variables.API_URL}course-names`);
                if (!responseCourseNames.ok) {
                    throw new Error('Failed to fetch course names');
                }
                const courseNamesData = await responseCourseNames.json();
                setCourseNames(courseNamesData);

                // Fetch course years
                const responseCourseYears = await fetch(`${variables.API_URL}course-years`);
                if (!responseCourseYears.ok) {
                    throw new Error('Failed to fetch course years');
                }
                const courseYearsData = await responseCourseYears.json();
                setCourseYears(courseYearsData);
            } catch (error) {
                console.error('Error fetching course data:', error.message);
            }
        };

        fetchCourseData();
    }, []);

    const validateEmail = (email) => {
        return email.endsWith('@qub.ac.uk');
    };

    const checkExistingAccount = async (identifier) => {
        try {
          const response = await fetch(`${variables.API_URL}check-student?identifier=${identifier}`);
          const data = await response.json();
          if (response.ok && data.exists) {
            setExistingAccountMessage(`It looks like you already have an account. Please log in.`);
          } else {
            setExistingAccountMessage('');
          }
        } catch (error) {
          console.error('Error checking existing account:', error.message);
        }
      };

      const handleStudentNumberChange = (e) => {
        const value = e.target.value;
        setStudentNumber(value);
        checkExistingAccount(value);
      };
    
      const handleStudentEmailChange = (e) => {
        const value = e.target.value;
        setStudentEmail(value);
        checkExistingAccount(value);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(studentEmail)) {
            setErrorMessage('Please use your QUB email address.');
            setSuccessMessage('');
            return;
        }

        
        const newStudent = {
            student_number: studentNumber,
            student_name: studentName,
            date_of_birth: dateOfBirth,
            student_email: studentEmail,
            course_name: selectedCourseName,
            academic_year: selectedCourseYear,
            student_password: studentPassword
        };

        try {
            const response = await fetch(`${variables.API_URL}students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newStudent)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add student');
            }

            setSuccessMessage('Student added successfully');
            setErrorMessage('');
            
            console.log('Student added successfully:', data.message);
            // Display success message to user (optional)
        } catch (error) {
            setErrorMessage('Student Number or Email Address is already in use');
            setSuccessMessage('');
            console.error('Error adding student:', error.message);
            // Display error message to user (e.g., toast, alert, or set state for error message in UI)
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Create New Account</h2>
          {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
          {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
          {existingAccountMessage && (
            <div className="text-yellow-500 text-center mb-4">
              {existingAccountMessage}
              <br />
              <Link to="/login" className="text-red-500 hover:underline">Log in here</Link>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Number</label>
              <input
                type="number"
                value={studentNumber}
                onChange={handleStudentNumberChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Email</label>
              <input
                type="email"
                value={studentEmail}
                onChange={handleStudentEmailChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <select
                value={selectedCourseName}
                onChange={(e) => setSelectedCourseName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              >
                <option value="">Select Course Name</option>
                {courseNames.map((course) => (
                  <option key={course.course_id} value={course.course_name}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Year</label>
              <select
                value={selectedCourseYear}
                onChange={(e) => setSelectedCourseYear(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              >
                <option value="">Select Course Year</option>
                {courseYears.map((year) => (
                  <option key={year.academic_year_id} value={year.academic_year_name}>
                    {year.academic_year_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Password</label>
              <input
                type="password"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition"
              >
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default AddStudentForm;
