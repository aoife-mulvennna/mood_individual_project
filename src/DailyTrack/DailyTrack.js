import React, { useState, useEffect, useCallback } from 'react';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode'; // Adjusted import statement
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
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const fetchStudentData = async (id, token) => {
        await fetchStudentName(id, token);
        await checkTrackedStatus(token);
        refreshMoods(token);
        fetchSocialisations(token);
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
            if (data && data.alreadyTracked !== undefined) {
                setAlreadyTracked(data.alreadyTracked);
            } else {
                console.error('Unexpected data structure:', data);
            }
        } catch (error) {
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
    };

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
            });

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
            <div className="max-w-7xl mx-auto mt-12 p-6 theme-primary-bg rounded-lg shadow-lg text-center">
                <h3 className="text-3xl font-semibold mb-4 theme-primary-text">Daily Tracker</h3>
                <h3 className="text-xl mb-2 theme-primary-text">Hi {studentName}</h3>
                <p className="theme-secondary-text mb-2">Sorry, you have already tracked today, come back tomorrow!</p>
                <p className="theme-secondary-text">For now, use the quick track feature on the dashboard!</p>
            </div>
        );
    } else {
        return (
            <div className="max-w-7xl mx-auto mt-12 p-6 theme-primary-bg rounded-lg shadow-lg">
                <h3 className="text-3xl font-semibold mb-6 text-center theme-primary-text">Daily Tracker</h3>
                <h3 className="text-xl mb-4 text-center theme-primary-text">Hi {studentName}</h3>
                <form>
                    <div className="form-group mb-6">
                        <label className="block theme-primary-text text-lg mb-2">How did you feel overall today?</label>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {moods.length === 0 ? (
                                <p className="theme-secondary-text">Loading moods...</p>
                            ) : (
                                moods.map(mood => (
                                    <button
                                        key={mood.mood_id}
                                        type="button"
                                        className={`btn mood-button px-3 py-2 rounded transition ${selectedMood === mood.mood_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                        onClick={() => handleMoodSelection(mood)}
                                    >
                                        {mood.mood_name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="form-group mb-6">
                        <label className="block theme-primary-text text-lg mb-2">How many minutes of exercise did you complete today?</label>
                        <input
                            type="number"
                            name="exercise_duration"
                            value={selectedExerciseDuration}
                            onChange={handleExerciseDurationChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 theme-focus-ring"
                        />
                    </div>
                    <div className="form-group mb-6">
                        <label className="block theme-primary-text text-lg mb-2">How many hours of sleep did you get last night?</label>
                        <input
                            type="number"
                            name="sleep_duration"
                            value={selectedSleepDuration}
                            onChange={handleSleepDurationChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 theme-focus-ring"
                        />
                    </div>
                    <div className="form-group mb-6">
                        <label className="block theme-primary-text text-lg mb-2">How many minutes of a non-physical social activity did you complete today?</label>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {socialisations.length === 0 ? (
                                <p className="theme-secondary-text">Loading socialisations...</p>
                            ) : (
                                socialisations.map(socialisation => (
                                    <button
                                        key={socialisation.socialisation_id}
                                        type="button"
                                        className={`btn mood-button px-3 py-2 rounded-lg transition ${selectedSocialisation === socialisation.socialisation_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                        onClick={() => handleSocialisationSelection(socialisation)}
                                    >
                                        {socialisation.socialisation_name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="form-group mb-6">
                        <label className="block theme-primary-text text-lg mb-2">Rate your productivity today (1-5):</label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map(value => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`btn productivity-button px-3 py-2 rounded-lg transition ${selectedProductivity === value ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                    onClick={() => handleProductivityChange(value)}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group text-center">
                        <button type="button" className="btn submit-button theme-button-bg theme-button-text px-6 py-2 rounded hover:opacity-80" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    }
};

export { DailyTrack };
