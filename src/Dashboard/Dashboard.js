import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode'; // Adjust the import path according to your project structure
import QuickTrack from './QuickTrack';
import Flame from '../Photos/Flame.png';
import Star from '../Photos/Star.png';
const Dashboard = () => {
    const [streak, setStreak] = useState(0);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken);
            fetchUserDetails(decodedToken.id);
        }
        fetchStreak();
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
                console.log('User details fetched:', data);
                setUserName(data.student_name);
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
            <h3>Welcome to Your Dashboard, {userName}</h3>
            <div className="card-container">
                <div className="column">
                    <div className="card">
                        <h5>Quick Track</h5>
                    <QuickTrack />
                    </div>
                    <div className="card">
                        <h5>Stats <img src={Star} className="icon" alt='Star'/></h5>
                        <p>Your stats here...</p>
                    </div>
                </div>
                <div className="column">
                    <div className="card">
                        <h5>Recent Activity</h5>
                        <p>Recent activity details...</p>
                    </div>
                </div>
                <div className="column">
                    <div className="card">
                        <h5>Streak <img src={Flame} className="icon" alt='Flame'/></h5>
                        <p>Your current streak: {streak} days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
