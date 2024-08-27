import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode';
import QuickTrack from './QuickTrack';
import StreakDisplay from './DisplayStreak';
import MyAssignments from './MyAssignments';
import Stats from './Stats.js';
import Resources from '../Resources/Resources';

const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [studentId, setStudentId] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [refreshStats, setRefreshStats] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.error('Token has expired');
                } else {
                    sessionStorage.setItem('userId', decodedToken.id);
                    fetchUserDetails(decodedToken.id);
                    setStudentId(decodedToken.id);
                    fetchAssignments(decodedToken.id);
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

    // Method to refresh stats
    const handleRefreshStats = useCallback(() => {
        setRefreshStats(prev => !prev);
    }, []);

    return (
        <div className="max-w-7xl mx-auto mt-2 p-6 theme-primary-bg">
            <h3 className="text-center text-2xl font-semibold mb-6 theme-primary-text ">Welcome to Your Dashboard, {userName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-6">
                    <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border">
                        <h5 className="text-lg font-semibold mb-2 theme-primary-text flex items-center border-b theme-border pb-2 justify-center">Quick Track <p className="mx-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        </p></h5>
                        <QuickTrack onEntryComplete={handleRefreshStats} />
                    </div>
                    <Stats studentId={studentId} refreshTrigger={refreshStats} />
                </div>
                <div className="flex flex-col gap-6 ">
                    <MyAssignments studentId={studentId} />
                    <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border ">
                        <h5 className="text-lg font-semibold mb-2 theme-primary-text flex items-center border-b theme-border pb-2 justify-center">Reach Out<p className="mx-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        </p></h5>
                        <div>If you need to speak to a member of the Student Pulse Team, you can send them an email here.</div>
                        <button
                            className="px-4 py-2 theme-button-bg theme-button-text mt-4"
                            onClick={() => navigate('/contact-us')}
                        >
                            Contact Us!
                        </button>
                    </div>
                    <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border ">
                        <h5 className="text-lg font-semibold mb-2 theme-primary-text flex items-center border-b theme-border pb-2 justify-center">About Student Pulse<p className="mx-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        </p></h5>
                        <p className="mb-3">This application was developed by Aoife Mulvenna for her final project for the degree of MSc Software Development.</p>
                        <p className="mb-3">The goal is to help students get the support they deserve both mentally and physically throughout their studies.</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border">
                        <h5 className="text-lg font-semibold mb-2 theme-primary-text flex items-center border-b theme-border pb-2 justify-center">Streak <p className="mx-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                        </svg>
                        </p></h5>
                        <StreakDisplay studentId={studentId} />
                    </div>
                    <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border ">
                        <h5 className="text-lg font-semibold mb-2 theme-primary-text flex items-center border-b theme-border pb-2 justify-center">How to use Student Pulse<p className="mx-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>


                        </p></h5>
                        <p className="mb-2">Record how you feel up to once per hour in <strong>Quick Track</strong></p>
                        <p className="mb-2">Record information about your day in <strong>Daily Track</strong></p>
                        <p className="mb-2">View your data and insights in <strong>My Records</strong></p>
                        <p className="mb-2">View helpful and reccomended resources in <strong>Resources</strong></p>
                        <p className="mb-2">View your account and change your application theme in <strong>My Account</strong></p>
                    </div>
                    <Resources limit={3} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
