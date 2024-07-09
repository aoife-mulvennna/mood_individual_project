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


const QuickTrack = () => {
    const [moods, setMoods] = useState([]);
    const [selectedMoodId, setSelectedMoodId] = useState('');
    const [token, setToken] = useState('');
    const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState(0);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');

        const storedCooldown = parseInt(localStorage.getItem('cooldownRemainingSeconds'), 10);
        if (!isNaN(storedCooldown) && storedCooldown > 0) {
            setCooldownRemainingSeconds(storedCooldown);
        }

        if (storedToken) {
            try {
                setToken(storedToken);
                refreshMoods();
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    useEffect(() => {
        // Save cooldownRemainingSeconds to localStorage whenever it changes
        localStorage.setItem('cooldownRemainingSeconds', cooldownRemainingSeconds);

        // Clear localStorage on successful submission
        if (cooldownRemainingSeconds === 0) {
            localStorage.removeItem('cooldownRemainingSeconds');
        }
    }, [cooldownRemainingSeconds]);

    const refreshMoods = () => {
        fetch(`${variables.API_URL}mood`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const sortedMoods = data.sort((a, b) => a.mood_score - b.mood_score);
                setMoods(sortedMoods);
            })
            .catch(error => {
                console.error('Error fetching moods:', error);
            });
    };

    const handleMoodSelection = (mood) => {
        setSelectedMoodId(mood.mood_id);
    };

    const handleSubmit = () => {
        if (!token) {
            alert('No token found, please log in again.');
            return;
        }
        fetch(`${variables.API_URL}quick-track`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mood_id: selectedMoodId
            })
        })
            .then(async res => {
                if (res.status === 409) {
                    const { remainingTimeSeconds } = await res.json();
                    setCooldownRemainingSeconds(remainingTimeSeconds);
                    return;
                }
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText);
                }
                const data = await res.json();
                alert(data.message);
                refreshMoods();
            })
            .catch(error => {
                alert('Failed: ' + error.message);
                console.error('Error:', error.message);
            });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        let interval;

        if (cooldownRemainingSeconds > 0) {
            interval = setInterval(() => {
                setCooldownRemainingSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [cooldownRemainingSeconds]);

    return (
        <div className="quick-track">
            <div className="form-group">
                <p>How do you feel now?</p>
                <div className="mood-buttons">
                    {moods.length === 0 ? (
                        <p>Loading moods...</p>
                    ) : (
                        moods.map(mood => (
                            <img
                                key={mood.mood_id}
                                src={emojiMap[mood.mood_score]}// Adjust path as per your folder structure
                                alt={mood.mood_name}
                                className={`mood-image ${selectedMoodId === mood.mood_id ? 'selected' : ''}`}
                                onClick={() => handleMoodSelection(mood)}
                            />
                        ))
                    )}
                </div>
                {cooldownRemainingSeconds > 1 ? (
                    <div>
                        <p>You can submit another entry in {formatTime(cooldownRemainingSeconds)}</p>
                    </div>
                ) : (
                    <button className="btn tick-button" onClick={handleSubmit}>
                        <img src={Tick} className="tick" alt="Submit" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuickTrack;
