import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode'; // Adjust the import path according to your project structure
import QuickTrack from './QuickTrack';
import Flame from '../Photos/Flame.png';
import Star from '../Photos/Star.png';
import StreakDisplay from './DisplayStreak';
import MyAssignments from './MyAssignments';

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [studentId, setStudentId] = useState(null);
    const [assignments, setAssignments] = useState([]);

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
                    <MyAssignments studentId={studentId} />
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
