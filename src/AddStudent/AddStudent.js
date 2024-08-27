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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visiblePasswordField, setVisiblePasswordField] = useState(null); // State to manage which password field is visible
    const [passwordsMatch, setPasswordsMatch] = useState(true); // State to check if passwords match
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [accountExists, setAccountExists] = useState(false);
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

    const checkIfAccountExists = async (studentNumber) => {
        try {
            const response = await fetch(`${variables.API_URL}check-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentNumber }),
            });

            const data = await response.json();
            if (data.exists) {
                setAccountExists(true);
            } else {
                setAccountExists(false);
            }
        } catch (error) {
            console.error('Error checking if account exists:', error.message);
        }
    };

    useEffect(() => {
        if (studentNumber) {
            checkIfAccountExists(studentNumber);
        }
    }, [studentNumber]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(studentEmail)) {
            setErrorMessage('Please use your QUB email address.');
            setSuccessMessage('');
            return;
        }

        if (!passwordsMatch) {
            setErrorMessage('Passwords do not match.');
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
            student_password: studentPassword,
        };

        try {
            const response = await fetch(`${variables.API_URL}create-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add student');
            }

            setSuccessMessage('Student added successfully');
            setErrorMessage('');
            console.log('Student added successfully:', data.message);

            // Redirect to login page after successful account creation
            navigate('/login');
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');
            console.error('Error adding student:', error.message);
        }
    };

    const togglePasswordVisibility = (field) => {
        setVisiblePasswordField(visiblePasswordField === field ? null : field);
    };

    const handlePasswordChange = (e) => {
        setStudentPassword(e.target.value);
        setPasswordsMatch(e.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordsMatch(e.target.value === studentPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mt-4 mb-4">

                <h2 className="text-2xl font-bold text-center mb-6 text-black">Create New Account</h2>
                {successMessage && (
                    <div className="text-green-500 text-center mb-4">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="text-red-500 text-center mb-4">{errorMessage}</div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {accountExists && (
                        <div className="text-red-500 text-center mb-4">
                            It looks like you already have an account.
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-800">
                            Student Number
                        </label>
                        <input
                          type="text"
                          value={studentNumber}
                          onChange={(e) => {
                            // Ensure only digits are allowed
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setStudentNumber(value);
                            }
                          }}
                          required
                            className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-800">
                            Student Name
                        </label>
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                            className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-800">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                            className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-800">
                            Student Email
                        </label>
                        <input
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            required
                            className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div class="relative mb-4">
                        <label className="block text-sm font-medium text-gray-800">
                            Course Name
                        </label>
                        <select
                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 sm:text-sm rounded leading-tight focus:outline-none focus:border-red-500"
                            value={selectedCourseName}
                            onChange={(e) => setSelectedCourseName(e.target.value)}
                            required
                        >
                            <option value="">Select Course Name</option>
                            {courseNames.map((course) => (
                                <option key={course.course_id} value={course.course_name}>
                                    {course.course_name}
                                </option>
                            ))}
                        </select>
                        {/* className="absolute right-5 bottom-2 cursor-pointer text-gray-500" */}
                        <div class="pointer-events-none absolute right-5 bottom-1 cursor-pointer text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-800">
                            Course Year
                        </label>
                        <select
                            value={selectedCourseYear}
                            onChange={(e) => setSelectedCourseYear(e.target.value)}
                            required
                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 sm:text-sm rounded leading-tight focus:outline-none focus:border-red-500"
                        >
                            <option value="">Select Course Year</option>
                            {courseYears.map((year) => (
                                <option key={year.academic_year_id} value={year.academic_year_name}>
                                    {year.academic_year_name}
                                </option>
                            ))}
                        </select>
                        <div class="pointer-events-none absolute right-5 bottom-1 cursor-pointer text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="relative mb-2">
                        <label className="block text-sm font-medium text-gray-800">
                            Password
                        </label>
                        <input
                            type={visiblePasswordField === 'studentPassword' ? "text" : "password"}
                            value={studentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                        <span
                            onClick={() => togglePasswordVisibility('studentPassword')}
                            className="absolute right-5 bottom-2 cursor-pointer text-gray-500"
                        >
                            {visiblePasswordField === 'studentPassword' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 1 0 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </span>
                    </div>
                    <div className="relative mb-4">
                        <label className="block text-sm font-medium text-gray-800">
                            Confirm Password
                        </label>
                        <input
                            type={visiblePasswordField === 'confirmPassword' ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            className="text-gray-700 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                        <span
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            className="absolute right-5 bottom-2 cursor-pointer text-gray-500"
                        >
                            {visiblePasswordField === 'confirmPassword' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 0 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 1 0 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </span>
                    </div>
                    {!passwordsMatch && (
                        <p className="text-red-500 text-center mt-2">Passwords do not match</p>
                    )}
                    <div className="flex justify-center mb-4">
                        <button
                            type="submit"
                            className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition"
                            disabled={!passwordsMatch}
                        >
                            Create Account
                        </button>
                    </div>
                    <p className="text-gray-700">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-500 hover:underline">
                            Login here
                        </Link>
                    </p>
                    <p className="text-gray-700">
                        Want to go back?{' '}
                        <button onClick={() => navigate('/')} className="text-red-500 hover:underline">
                            Go back
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AddStudentForm;
