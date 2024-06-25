import React, { useState, useEffect } from 'react';
import './AddStudent.css'; // You can create this file to style your form
import { variables } from '../Variables'; // Ensure you have this imported correctly

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
                // Handle error state or display error message
            }
        };

        fetchCourseData();
    }, []);

    const validateEmail = (email) => {
        return email.endsWith('@qub.ac.uk');
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
        <div className="add-student-form">
            <h2>Add New Student</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Student Number:
                    <input type="number" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} required />
                </label>
                <label>
                    Student Name:
                    <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
                </label>
                <label>
                    Date of Birth:
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                </label>
                <label>
                    Student Email:
                    <input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
                </label>
                <label>
                    Course Name:
                    <select value={selectedCourseName} onChange={(e) => setSelectedCourseName(e.target.value)} required>
                        <option value="">Select Course Name</option>
                        {courseNames.map(course => (
                            <option key={course.course_id} value={course.course_name}>{course.course_name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Course Year:
                    <select value={selectedCourseYear} onChange={(e) => setSelectedCourseYear(e.target.value)} required>
                        <option value="">Select Course Year</option>
                        {courseYears.map(year => (
                            <option key={year.academic_year_id} value={year.academic_year_name}>{year.academic_year_name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Student Password:
                    <input type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} required />
                </label>
                <button type="submit">Add Student</button>
            </form>
        </div>
    );
};

export default AddStudentForm;
