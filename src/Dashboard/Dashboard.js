import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode'; // Adjust the import path according to your project structure

const Dashboard = () => {
    const [streak, setStreak] = useState(0);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken);
            fetchUserDetails(decodedToken.id, decodedToken.role);
        }
        fetchStreak();
    }, []);

    const fetchUserDetails = (userId, userRole) => {
        const endpoint = userRole === 'student' ? 'student-details' : 'staff-details';
        fetch(`${variables.API_URL}${endpoint}/${userId}`, {
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
                console.log('User details fetched:', data);
                if (userRole === 'student') {
                    setUserName(data.student_name);
                } else if (userRole === 'staff') {
                    setUserName(data.staff_name);
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    };


    const fetchStreak = () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        fetch(`${variables.API_URL}streak`, {
            headers: {
                'Authorization': `Bearer ${token}`
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
                setStreak(data.streak);
            })
            .catch(error => {
                console.error('Error fetching streak:', error);
            });
    };

    return (
        <div className="dashboard">
            <h1>Welcome to Your Dashboard, {userName}</h1>
            <div className="card-container">
                <div className="card">
                    <h3>Stats</h3>
                    <p>Your stats here...</p>
                </div>
                <div className="card">
                    <h3>Recent Activity</h3>
                    <p>Recent activity details...</p>
                </div>
                <div className="card">
                    <h3>Streak</h3>
                    <p>Your current streak: {streak} days</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
