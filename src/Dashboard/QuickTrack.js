import React, { useState, useEffect } from 'react';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode';
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

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        console.log('Token retrieved from session storage:', storedToken);

        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                console.log('Decoded token:', decoded);
                setToken(storedToken);
                refreshMoods();
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const refreshMoods = () => {
        fetch(`${variables.API_URL}mood`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched moods:', data);
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
                // Add other fields as needed (exercise_duration, sleep_duration, etc.)
            })
        })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText);
                }
                const data = await res.json();
                alert(data.message);
            })
            .catch(error => {
                alert('Failed: ' + error.message);
                console.error('Error:', error.message);
            });
    };

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
                                className={`mood-image ${selectedMoodId === mood.mood_id? 'selected' : ''}`}
                                onClick={() => handleMoodSelection(mood)}
                            />
                        ))
                    )}
                </div>
                <button className="btn tick-button" onClick={handleSubmit}>
                <img src={Tick} className="tick" alt="Submit"/>
            </button>
            </div>
        </div>
    );
};

export default QuickTrack;
