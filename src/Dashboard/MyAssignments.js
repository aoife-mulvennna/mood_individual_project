import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';

const MyAssignments = ({ studentId }) => {
    const [assignments, setAssignments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ name: '', date: '' });

    useEffect(() => {
        if (studentId) {
            fetchAssignments(studentId);
        }
    }, [studentId]);

    const fetchAssignments = (userId) => {
        fetch(`${variables.API_URL}assignments/${userId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setAssignments(data.assignments))
            .catch(error => console.error('Error fetching assignments:', error));
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
                    assignment_deadline: newAssignment.date
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            const data = await response.json();
            setAssignments(prevAssignments => [...prevAssignments, data.assignment]);
            setNewAssignment({ name: '', date: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow relative">
            <div className="flex justify-between items-center">
                <h5 className="text-lg font-semibold mb-4 flex items-center">My Assignments</h5>
                <button onClick={handleAddAssignment} className="text-gray-700 hover:text-gray-900 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
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
                        name="date"
                        value={newAssignment.date}
                        onChange={handleInputChange}
                        placeholder="Assignment Date"
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
    );
};

export default MyAssignments;
