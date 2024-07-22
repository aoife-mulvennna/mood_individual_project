import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode'; // Adjust the import path according to your project structure
import QuickTrack from './QuickTrack';
import Flame from '../Photos/Flame.png';
import Star from '../Photos/Star.png';
import StreakDisplay from './DisplayStreak';
import MyAssignments from './MyAssignments';
import Stats from './Stats.js';

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [studentId, setStudentId] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.error('Token has expired');
                    // Handle token expiration (e.g., redirect to login)
                } else {
                    console.log('Decoded Token:', decodedToken); // Log the decoded token for debugging
                    fetchUserDetails(decodedToken.id);
                    setStudentId(decodedToken.id);
                    fetchAssignments(decodedToken.id);
                    fetchStreak(decodedToken.id);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.error('No token found in session storage');
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

    const fetchStreak = (userId) => {
        fetch(`${variables.API_URL}streak/${userId}`, {
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
                console.log('Fetched streak data:', data); 
                setStreak(data.streakValue);
            })
            .catch(error => {
                console.error('Error fetching streak:', error);
            });
    };

    return (
        <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-center text-2xl font-semibold mb-6 text-gray-800">Welcome to Your Dashboard, {userName}, {studentId}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-6">
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h5 className="text-lg font-semibold mb-4 flex items-center">Quick Track</h5>
                        <QuickTrack />
                    </div>
                    <Stats studentId={studentId} />
                </div>
                <div className="flex flex-col gap-6">
                    <MyAssignments studentId={studentId} />
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h5 className="text-lg font-semibold mb-4 flex items-center">Recent Activity</h5>
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
