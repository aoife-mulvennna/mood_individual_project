import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode'; // Adjust the import path according to your project structure
import QuickTrack from './QuickTrack';
import Flame from '../Photos/Flame.png';
import Star from '../Photos/Star.png';
import StreakDisplay from './DisplayStreak';
const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [studentId, setStudentId] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ name: '', deadline: '' });


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            fetchUserDetails(decodedToken.id);
            setStudentId(decodedToken.id);
            fetchAssignments(decodedToken.id);
        }
    }, []);

    const fetchUserDetails = (userId) => {
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
                setUserName(data.student_name);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    };

    const fetchAssignments = (userId) => {
        fetch(`${variables.API_URL}assignments/${userId}`, {
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
                setAssignments(data.assignments);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    const handleAddAssignment = () => {
        setShowForm(!showForm);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveAssignment = async () => {
        try {
            const response = await fetch(`${variables.API_URL}assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    student_id: studentId,
                    assignment_name: newAssignment.name,
                    assignment_deadline: newAssignment.deadline
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            const data = await response.json();
            setAssignments(prevAssignments => [...prevAssignments, data.assignment]);
            setNewAssignment({ name: '', deadline: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };
    return (
        <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-center text-2xl font-semibold mb-6 text-gray-800">Welcome to Your Dashboard, {userName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-6">
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h5 className="text-lg font-semibold mb-4 flex items-center">Quick Track</h5>
                        <QuickTrack />
                    </div>
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h5 className="text-lg font-semibold mb-4 flex items-center">Stats <img src={Star} className="w-6 h-6 ml-2" alt='Star' /></h5>
                        <p>Your stats here...</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="p-6 bg-gray-100 rounded-lg shadow relative">
                        <h5 className="text-lg font-semibold mb-4 flex items-center">My Assignments</h5>
                        <button onClick={handleAddAssignment} className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        {showForm && (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={newAssignment.name}
                                    onChange={handleInputChange}
                                    placeholder="Assignment Name"
                                    className="mb-2 p-2 border rounded w-full"
                                />
                                <input
                                    type="date"
                                    name="deadline"
                                    value={newAssignment.deadline}
                                    onChange={handleInputChange}
                                    placeholder="Assignment Deadline"
                                    className="mb-2 p-2 border rounded w-full"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveAssignment}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                    >
                                        Save Assignment
                                    </button>
                                </div>
                            </div>
                        )}
                        {assignments.length === 0 ? (
                            <p>No assignments found</p>
                        ) : (
                            <ul className="list-none pl-0">
                                {assignments.map((assignment, index) => {
                                    const { day, month } = formatDate(assignment.assignment_deadline);
                                    return (
                                        <li key={index} className="flex items-center mb-4">
                                            <div className="flex-shrink-0 text-center">
                                                <div className="text-3xl font-bold text-gray-800">{day}</div>
                                                <div className="text-sm font-medium text-gray-600">{month}</div>
                                            </div>
                                            <div className="flex-grow mx-4 border-l-2 border-gray-300 h-12"></div>
                                            <div>
                                                <span className="text-lg text-gray-700">{assignment.assignment_name}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h5 className="text-lg font-semibold mb-4 flex items-center">Recent Activity</h5>
                        <p>Recent activity details...</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h5 className="text-lg font-semibold mb-4 flex items-center">Streak <img src={Flame} className="w-6 h-6 ml-2" alt='Flame' /></h5>

                        <StreakDisplay studentId={studentId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
