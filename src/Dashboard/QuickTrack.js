import React, { useState, useEffect } from 'react';
import { variables } from '../Variables.js';

import Emoji1 from '../Photos/Emoji-1.png';
import Emoji2 from '../Photos/Emoji-2.png';
import Emoji3 from '../Photos/Emoji-3.png';
import Emoji4 from '../Photos/Emoji-4.png';
import Emoji5 from '../Photos/Emoji-5.png';
import Tick from '../Photos/Tick.png';

const emojiMap = {
    1: Emoji1,
    2: Emoji2,
    3: Emoji3,
    4: Emoji4,
    5: Emoji5
};

const cooldownPeriodSeconds = 3600;

const QuickTrack = ({ onEntryComplete }) => {
    const [moods, setMoods] = useState([]);
    const [selectedMoodId, setSelectedMoodId] = useState('');
    const [token, setToken] = useState('');
    const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState(0);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId'); // Retrieve student ID
        console.log('Component mounted, calling refreshMoods using userId:', userId, 'and for token:', token);
        if (storedToken && userId) {
            console.log('Token and userId found, setting token and calling checkCooldown');
            setToken(storedToken);
            checkCooldown(userId);
        } else {
            console.error('Token or userId not found');
        }

        refreshMoods();
    }, []);

    const checkCooldown = async (userId) => {
        try {
            const response = await fetch(`${variables.API_URL}quick-track/cooldown/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if (data.cooldownActive) {
                setCooldownRemainingSeconds(data.remainingTimeSeconds);
                localStorage.setItem(`cooldownRemainingSeconds_${userId}`, data.remainingTimeSeconds);
                localStorage.setItem(`lastUpdatedTime_${userId}`, Math.floor(Date.now() / 1000));
            }
        } catch (error) {
            console.error('Error checking cooldown:', error);
        }
    };


    useEffect(() => {
        if (cooldownRemainingSeconds > 0) {
            const userId = sessionStorage.getItem('userId');
            const interval = setInterval(() => {
                setCooldownRemainingSeconds(prevSeconds => {
                    const newSeconds = prevSeconds - 1;
                    localStorage.setItem(`cooldownRemainingSeconds_${userId}`, newSeconds);
                    localStorage.setItem(`lastUpdatedTime_${userId}`, Math.floor(Date.now() / 1000));
                    if (newSeconds <= 0) {
                        clearInterval(interval);
                    }
                    return newSeconds;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [cooldownRemainingSeconds]);

    const refreshMoods = () => {
        console.log('Fetching moods...');
        console.log('API URL:', variables.API_URL);  // Add this log to verify the API URL

        fetch(`${variables.API_URL}mood`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Moods data:', data);
                if (data.length === 0) {
                    console.warn('No moods returned by the API.');
                } else {
                    const sortedMoods = data.sort((a, b) => a.mood_score - b.mood_score);
                    setMoods(sortedMoods);
                }
            })
            .catch(error => {
                console.error('Error fetching moods:', error);
            });

    };

    const handleMoodSelection = (mood) => {
        setSelectedMoodId(mood.mood_id);
    };

    const handleSubmit = async () => {
        const userId = sessionStorage.getItem('userId');

        if (!token) {
            alert('No token found, please log in again.');
            return;
        }

        try {
            const res = await fetch(`${variables.API_URL}quick-track`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mood_id: selectedMoodId,
                    student_id: userId
                })
            });

            if (res.status === 409) {
                const { remainingTimeSeconds } = await res.json();
                setCooldownRemainingSeconds(remainingTimeSeconds);
                localStorage.setItem(`cooldownRemainingSeconds_${userId}`, remainingTimeSeconds);
                localStorage.setItem(`lastUpdatedTime_${userId}`, Math.floor(Date.now() / 1000));
                return;
            }

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            const data = await res.json();
            alert(data.message);
            setCooldownRemainingSeconds(cooldownPeriodSeconds);
            localStorage.setItem(`cooldownRemainingSeconds_${userId}`, cooldownPeriodSeconds);
            localStorage.setItem(`lastUpdatedTime_${userId}`, Math.floor(Date.now() / 1000));
            refreshMoods();

                // Trigger stats refresh
                if (onEntryComplete) {
                    onEntryComplete();
                }
                
        } catch (error) {
            alert('Failed: ' + error.message);
            console.error('Error:', error.message);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <div className="quick-track">
            <div className="form-group">
                <p className="text-center mb-4 theme-primary-text text-xl">How do you feel now?</p>
                <div className="flex justify-center gap-2 mb-4">
                    {moods.length === 0 ? (
                        <p className="theme-secondary-text">Loading moods...</p>
                    ) : (
                        moods.map(mood => (
                            <img
                                key={mood.mood_id}
                                src={emojiMap[mood.mood_score]}// Adjust path as per your folder structure
                                alt={mood.mood_name}
                                className={`w-12 h-12 cursor-pointer transform transition-transform duration-200 ${selectedMoodId === mood.mood_id ? 'scale-125 border-2 border-red-500 rounded-full' : ''}`}
                                onClick={() => handleMoodSelection(mood)}
                            />
                        ))
                    )}
                </div>
                {cooldownRemainingSeconds > 0 ? (
                    <div>
                        <p className="text-center theme-secondary-text">You can submit another entry in {formatTime(cooldownRemainingSeconds)}</p>
                    </div>
                ) : (
                    <button className="flex justify-center items-center tick-button mx-auto mt-4 theme-button-bg theme-button-text px-4 py-2 rounded hover:scale-110 transition-transform" onClick={handleSubmit}>
                        <img src={Tick} className="tick" alt="Submit" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuickTrack;
