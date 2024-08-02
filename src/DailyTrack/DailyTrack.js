import React, { useState, useEffect } from 'react';
import { variables } from '../Variables.js';
import {jwtDecode} from 'jwt-decode';
import "./DailyTrack.css";

const DailyTrack = () => {
    const [moods, setMoods] = useState([]);
    const [socialisations, setSocialisations] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [sleeps, setSleeps] = useState([]);

    const [selectedMood, setSelectedMood] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [selectedSleep, setSelectedSleep] = useState('');
    const [selectedSocialisation, setSelectedSocialisation] = useState('');
    const [selectedProductivity, setSelectedProductivity] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [token, setToken] = useState('');
    const [alreadyTracked, setAlreadyTracked] = useState(false);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setStudentId(decoded.id);
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
        fetchExercises(token);
        fetchSleeps(token);
    };

    const fetchStudentName = (id, token) => {
        fetch(variables.API_URL + `student-details/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
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
            const data = await response.json();
            setAlreadyTracked(data.alreadyTracked);
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
            const data = await response.json();
            setMoods(data);
        } catch (error) {
            console.error('Error fetching moods:', error);
        }
    };

    const fetchSocialisations = async () => {
        try {
            const response = await fetch(variables.API_URL + 'socialisations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSocialisations(data);
        } catch (error) {
            console.error('Error fetching socialisations:', error);
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await fetch(variables.API_URL + 'exercises', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setExercises(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const fetchSleeps = async () => {
        try {
            const response = await fetch(variables.API_URL + 'sleeps', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSleeps(data);
        } catch (error) {
            console.error('Error fetching sleeps:', error);
        }
    };

    const handleMoodSelection = (mood) => {
        setSelectedMood(mood.mood_id);
    };

    const handleExerciseSelection = (exercise) => {
        setSelectedExercise(exercise.exercise_id);
    };

    const handleSleepSelection = (sleep) => {
        setSelectedSleep(sleep.sleep_id);
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

            const response = await fetch(variables.API_URL + 'daily-track', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student_id: studentId,
                    mood_id: selectedMood,
                    exercise_id: selectedExercise,
                    sleep_id: selectedSleep,
                    socialisation_id: selectedSocialisation,
                    productivity_score: selectedProductivity
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed: ' + errorText);
            }

            const data = await response.json();
            alert(data.message);
            refreshMoods(token);
        } catch (error) {
            alert('Failed: ' + error.message);
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
                        <div className="flex flex-wrap gap-2 justify-center">
                            {exercises.length === 0 ? (
                                <p className="theme-secondary-text">Loading exercises...</p>
                            ) : (
                                exercises.map(exercise => (
                                    <button
                                        key={exercise.exercise_id}
                                        type="button"
                                        className={`btn exercise-button px-3 py-2 rounded-lg transition ${selectedExercise === exercise.exercise_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                        onClick={() => handleExerciseSelection(exercise)}
                                    >
                                        {exercise.exercise_name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="form-group mb-6">
                        <label className="block theme-primary-text text-lg mb-2">How do you rate last night's sleep?</label>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {sleeps.length === 0 ? (
                                <p className="theme-secondary-text">Loading sleeps...</p>
                            ) : (
                                sleeps.map(sleep => (
                                    <button
                                        key={sleep.sleep_id}
                                        type="button"
                                        className={`btn sleep-button px-3 py-2 rounded-lg transition ${selectedSleep === sleep.sleep_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                        onClick={() => handleSleepSelection(sleep)}
                                    >
                                        {sleep.sleep_name}
                                    </button>
                                ))
                            )}
                        </div>
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
                                        className={`btn socialisation-button px-3 py-2 rounded-lg transition ${selectedSocialisation === socialisation.socialisation_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
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
