import React, { useState, useEffect, useCallback } from 'react';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode';
import "./DailyTrack.css";

const DailyTrack = () => {
    const [moods, setMoods] = useState([]);
    const [socialisations, setSocialisations] = useState([]);

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
                
                setStudentId(decoded.id); // Ensure the id field is used consistently
                setToken(storedToken);
                fetchStudentData(decoded.id, storedToken);
            }
            catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const fetchStudentData = async (id, token) => {
        await fetchStudentName(id, token);
        await checkTrackedStatus(token);
        refreshMoods(token);
    };

    const fetchStudentName = (id, token) => {
        fetch(variables.API_URL + `student-details/${id}`, {
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
                setStudentName(data.student_name);
            })
            .catch(error => {
                console.error('Error fetching student name:', error);
            });
    };

    const checkTrackedStatus = async (token) => {
        try {
            const response = await fetch(variables.API_URL + 'mood/status', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log('Check Tracked Status:', data);
            setAlreadyTracked(data.alreadyTracked); // Set state to true to handle UI accordingly
        }
        catch (error) {
            console.error('Error checking tracked status:', error);
        }
    };

    const refreshMoods = async () => {
        try {
            const response = await fetch(variables.API_URL + 'mood', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            const sortedMoods = data.sort((a, b) => a.mood_score - b.mood_score);
            setMoods(sortedMoods);
        } catch (error) {
            console.error('Error fetching moods:', error);
        }
    };

    useEffect(() => {
        fetchSocialisations();
    }, []);

    const fetchSocialisations = async () => {
        try {
            const response = await fetch(variables.API_URL + 'socialisations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            setSocialisations(data);
        } catch (error) {
            console.error('Error fetching socialisations:', error);
        }
    };

    const handleMoodSelection = (mood) => {
        setSelectedMood(mood.mood_id);
    }
    const handleExerciseDurationChange = (event) => {
        setSelectedExerciseDuration(event.target.value);
    };

    const handleSleepDurationChange = (event) => {
        setSelectedSleepDuration(event.target.value);
    };

    const handleSocialisationSelection = (socialisation) => {
        setSelectedSocialisation(socialisation.socialisation_id);
    };

    const handleProductivityChange = (value) => {
        setSelectedProductivity(value);
    };

    const handleSubmit = async () => {
        try {
            if (!token) {
                alert('No token found, please log in again.');
                return;
            }

            console.log('Submitting with token:', token);
            console.log('Form data:', {
                student_id: studentId,
                mood_id: selectedMood,
                exercise_duration: selectedExerciseDuration,
                sleep_duration: selectedSleepDuration,
                socialisation_id: selectedSocialisation,
                productivity_score: selectedProductivity
            });

            const response = await fetch(`http://localhost:8000/api/daily-track`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student_id: studentId,
                    mood_id: selectedMood,
                    exercise_duration: selectedExerciseDuration,
                    sleep_duration: selectedSleepDuration,
                    socialisation_id: selectedSocialisation,
                    productivity_score: selectedProductivity
                })
            })

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed:', errorText);
                throw new Error('Failed: ' + errorText);
            }

            const data = await response.json();
            console.log('Response data:', data);
            alert(data.message);
            refreshMoods(token);
        } catch (error) {
            alert('Failed: ' + error.message);
            console.error('Error:', error);
        }
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
                                        className={`btn mood-button ${selectedMood === mood.mood_id ? 'btn-secondary' : ''}`}
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
                        <label>How many minutes of a non-physical social activity did you complete today?</label>
                        <div className="socialisation-buttons">
                            {socialisations.length === 0 ? (
                                <p>Loading socialisations...</p>
                            ) : (
                                socialisations.map(socialisation => (
                                    <button
                                        key={socialisation.socialisation_id}
                                        type="button"
                                        className={`btn mood-button ${selectedSocialisation === socialisation.socialisation_id ? 'btn-secondary' : ''}`}
                                        onClick={() => handleSocialisationSelection(socialisation)}
                                    >
                                        {socialisation.socialisation_name}
                                    </button>
                                ))
                            )}


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
