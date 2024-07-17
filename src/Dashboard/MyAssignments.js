import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';

const MyAssignments = ({ studentId }) => {
    const [assignments, setAssignments] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ name: '', date: '' });
    const [editAssignmentId, setEditAssignmentId] = useState(null);

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
        setNewAssignment({ name: '', date: '' });
        setEditAssignmentId(null);
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

            // setNewAssignment({ name: '', date: '' });
            fetchAssignments(studentId);
            setShowForm(false);

        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    const handleEditAssignment = (assignment) => {
        if (editAssignmentId === assignment.assignment_id) {
            setShowForm(false);
            setEditAssignmentId(null);
        } else {
            setNewAssignment({ name: assignment.assignment_name, date: assignment.assignment_deadline });
            setEditAssignmentId(assignment.assignment_id);
            setShowForm(true);
        }
    };


    const handleUpdateAssignment = async () => {
        try {
            const response = await fetch(`${variables.API_URL}assignments/${editAssignmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    assignment_name: newAssignment.name,
                    assignment_deadline: newAssignment.date
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            fetchAssignments(studentId);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating assignment:', error);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) return;

        try {
            const response = await fetch(`${variables.API_URL}assignments/${assignmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            // Fetch assignments again to refresh the list
            fetchAssignments(studentId);
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    const visibleAssignments = showAll ? assignments : assignments.slice(0, 3);

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
                            onClick={editAssignmentId ? handleUpdateAssignment : handleSaveAssignment}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                            {editAssignmentId ? 'Update Assignment' : 'Save Assignment'}
                        </button>
                    </div>
                </div>
            )}
            {assignments.length === 0 ? (
                <p>No assignments found</p>
            ) : (
                <ul className="list-none pl-0">
                    {visibleAssignments.map((assignment, index) => {
                        const { day, month } = formatDate(assignment.assignment_deadline);
                        return (
                            <li key={index} className="flex items-center mb-4">
                                <div className="flex-shrink-0 text-center">
                                    <div className="text-3xl font-bold text-gray-800">{day}</div>
                                    <div className="text-sm font-medium text-gray-600">{month}</div>
                                </div> 
                                <div className="mx-4 border-l-2 border-gray-300 "></div> 
                                {/* Fix this!!! */}
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-lg text-gray-700 ">{assignment.assignment_name}</span>
                                    <div className="flex space-x-2 ml-auto">
                                        <button onClick={() => handleEditAssignment(assignment)} className="text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>

                                        </button>
                                        <button onClick={() => handleDeleteAssignment(assignment.assignment_id)} className="text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            {assignments.length > 3 && (
                <div className="flex justify-center mt-4">
                    <button onClick={() => setShowAll(!showAll)} className="text-gray-800 hover:underline flex items-center">
                        {showAll ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                </svg>
                                See Less
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                                See More
                            </>
                        )}
                    </button>
                </div>
            )
            }
        </div >
    );
};

export default MyAssignments;
