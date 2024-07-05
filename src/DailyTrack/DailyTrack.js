import React, { useState, useEffect, useCallback } from 'react';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode';
import "./DailyTrack.css";

const DailyTrack = () => {
    const [moods, setMoods] = useState([]);
    const [selectedMood, setSelectedMood] = useState('');
    const [selectedExerciseDuration, setSelectedExerciseDuration] = useState(0);
    const [selectedSleepDuration, setSelectedSleepDuration] = useState(0);
    const [selectedSocialisation, setSelectedSocialisation] = useState(null);
    const [selectedProductivity, setSelectedProductivity] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [token, setToken] = useState('');
    const [alreadyTracked, setAlreadyTracked] = useState(false);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        console.log('Token retrieved from session storage:', storedToken);

        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                console.log('Decoded token:', decoded);
                setStudentName(decoded.studentName);
                setStudentId(decoded.studentId);
                setToken(storedToken); // Set token in state
            }
            catch (error) {
                console.error('Error decoding token:', error);
            }
        }

    }, []);

    useEffect(() => {
        if (studentId) {
            fetchStudentName(studentId);
        }
    }, [studentId]);

    const fetchStudentName = (id) => {
        fetch(variables.API_URL + `students/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            setStudentName(data.name);
        })
        .catch(error => {
            console.error('Error fetching student name:', error);
        });
    };

    const checkTrackedStatus = useCallback(() => {
        if (!token) return;

        fetch(variables.API_URL + 'mood', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Check Tracked Status:', data);
                if (data.status === 409 && data.message === 'Already tracked today') {
                    setAlreadyTracked(true); // Set state to true to handle UI accordingly
                }
            })
            .catch(error => {
                console.error('Error checking tracked status:', error);
            });
    }, [token]);

    useEffect(() => {
        if (token) {
            checkTrackedStatus();
        }
        refreshList();
    }, [token, checkTrackedStatus]);

    const refreshList = () => {
        fetch(variables.API_URL + 'mood')
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
                console.error('There was an error!', error);
            });
    }

    const handleMoodSelection = (mood) => {
        setSelectedMood(mood.mood_name);
    }
    const handleExerciseDurationChange = (event) => {
        setSelectedExerciseDuration(event.target.value);
    };

    const handleSleepDurationChange = (event) => {
        setSelectedSleepDuration(event.target.value);
    };

    const handleSocialisationChange = (value) => {
        setSelectedSocialisation(value);
    };

    const handleProductivityChange = (value) => {
        setSelectedProductivity(value);
    };

    const handleSubmit = () => {
        if (!token) {
            alert('No token found, please log in again.');
            return;
        }
        fetch(variables.API_URL + 'mood', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                student_id: studentId,
                mood_name: selectedMood,
                exercise_duration: selectedExerciseDuration,
                sleep_duration: selectedSleepDuration,
                socialisation: selectedSocialisation,
                productivity: selectedProductivity
            })
        })

            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText);
                }
                const data = await res.json();
                alert(data.message);
                refreshList();
            })
            .catch((error) => {
                alert('Failed: ' + error.message);
                console.error('Error:', error.message);
            });
    };
    if (alreadyTracked) {
        return (
            <div>
                <h3>This is the Daily Tracker page</h3>
                <h3>Hi {studentName}</h3>
                <p>Sorry, you have already tracked today!</p>
            </div>
        );

    } else {

        return (
            <div className="container">
                <h3>This is the Daily Tracker page</h3>
                <h3>Hi {studentName}</h3>
                <form>
                    <div className="form-group">
                        <label>How did you feel overall today?</label>
                        <div className="mood-buttons">
                            {moods.length === 0 ? (
                                <p>Loading moods...</p>
                            ) : (
                                moods.map(mood => (
                                    <button
                                        key={mood.mood_id}
                                        type="button"
                                        className={`btn mood-button ${selectedMood === mood.mood_name ? 'btn-secondary' : ''}`}
                                        onClick={() => handleMoodSelection(mood)}
                                    >
                                        {mood.mood_name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>How many minutes of exercise did you complete today?</label>
                        <input
                            type="number"
                            name="exercise_duration"
                            value={selectedExerciseDuration}
                            onChange={handleExerciseDurationChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>How many hours of sleep did you get last night?</label>
                        <input
                            type="number"
                            name="sleep_duration"
                            value={selectedSleepDuration}
                            onChange={handleSleepDurationChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Did you complete a non-physical social activity today?</label>
                        <div className="socialisation-buttons">
                            <button type="button"
                                className={`btn social-button ${selectedSocialisation === true ? 'btn-secondary' : ''}`}
                                onClick={() => handleSocialisationChange(true)}>
                                Yes
                            </button>
                            <button type="button"
                                className={`btn social-button ${selectedSocialisation === false ? 'btn-secondary' : ''}`}
                                onClick={() => handleSocialisationChange(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Rate your productivity today (1-5):</label>
                        <div className="productivity-buttons">
                            {[1, 2, 3, 4, 5].map(value => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`btn productivity-button ${selectedProductivity === value ? 'btn-secondary' : ''}`}
                                    onClick={() => handleProductivityChange(value)}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <button type="button" className="btn submit-button" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </form>

            </div>
        );
    };
};
export { DailyTrack };
