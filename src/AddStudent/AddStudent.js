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
    const checkIfAccountExists = async (studentNumber, studentEmail) => {
        try {
            const response = await fetch(`${variables.API_URL}students/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentNumber, studentEmail }),
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
        if (studentNumber || studentEmail) {
            checkIfAccountExists(studentNumber, studentEmail);
        }
    }, [studentNumber, studentEmail]);

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
            student_password: studentPassword,
        };

        try {
            const response = await fetch(`${variables.API_URL}students`, {
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
        } catch (error) {
            setErrorMessage('Student Number or Email Address is already in use');
            setSuccessMessage('');
            console.error('Error adding student:', error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Create New Account</h2>
                {successMessage && (
                    <div className="text-green-500 text-center mb-4">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="text-red-500 text-center mb-4">{errorMessage}</div>
                )}
                {accountExists && (
                    <div className="text-center mb-4">
                        <p className="text-red-500">
                            It looks like you already have an account.
                        </p>
                    </div>
                )}
                {!accountExists && (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Student Number
                            </label>
                            <input
                                type="number"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Student Name
                            </label>
                            <input
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Student Email
                            </label>
                            <input
                                type="email"
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Course Name
                            </label>
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
                            <label className="block text-sm font-medium text-gray-700">
                                Course Year
                            </label>
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
                            <label className="block text-sm font-medium text-gray-700">
                                Student Password
                            </label>
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
                )}
            </div>
        </div>
    );
};

export default AddStudentForm;
