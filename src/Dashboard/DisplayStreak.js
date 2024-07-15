import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';

const StreakDisplay = ({ studentId }) => {
    const [streakValue, setStreakValue] = useState(0);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                console.log('Fetching streak for studentId:', studentId);
                const response = await fetch(`${variables.API_URL}streak/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setStreakValue(data.streakValue);
                } else {
                    console.error('Error fetching streak:', data.message);
                }
            } catch (error) {
                console.error('Error fetching streak:', error);
            }
        };

        fetchStreak();
    }, [studentId]);

    return (
        <div>
            {streakValue > 0 ? (
                <p>Your current streak: {streakValue} {streakValue === 1 ? 'day' : 'days'}</p>
            ) : (
                <p>You have no streak. Start recording in the daily tracker to build your streak!</p>
            )}
        </div>

    );
};

export default StreakDisplay;
