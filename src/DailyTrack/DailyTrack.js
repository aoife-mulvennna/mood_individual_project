import React, { useState, useEffect } from 'react';
import { variables } from '../Variables.js';
import { jwtDecode } from 'jwt-decode';

const DailyTrack = () => {
    const [moods, setMoods] = useState([]);
    const [socialisations, setSocialisations] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [sleeps, setSleeps] = useState([]);
    const [tags, setTags] = useState([]);

    const [selectedMood, setSelectedMood] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [selectedSleep, setSelectedSleep] = useState('');
    const [selectedSocialisation, setSelectedSocialisation] = useState('');
    const [selectedProductivity, setSelectedProductivity] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [token, setToken] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                setStudentId(decoded.id);
                setToken(storedToken);
                fetchStudentData(decoded.id, storedToken);
                fetchSavedSelections(decoded.id, storedToken);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const fetchSavedSelections = async (id, token) => {
        try {
            const response = await fetch(variables.API_URL + `daily-track/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

                if (response.status === 404) {
                    // No record found for today, reset selections to defaults
                    console.log('No daily record found for today.');
                    // Ensure the form is in a state to accept new data
                    setSelectedMood('');
                    setSelectedExercise('');
                    setSelectedSleep('');
                    setSelectedSocialisation('');
                    setSelectedProductivity('');
                    setSelectedTags([]);
                    return;
                } else if (!response.ok) {
                    throw new Error('Failed to fetch saved selections');
                }

            const data = await response.json();

            setSelectedMood(data.mood_id);
            setSelectedExercise(data.exercise_id);
            setSelectedSleep(data.sleep_id);
            setSelectedSocialisation(data.socialisation_id);
            setSelectedProductivity(data.productivity_score);
            setSelectedTags(data.tags);

        } catch (error) {
            if (error.message !== 'Failed to fetch saved selections') {
                console.error('Error fetching saved selections:', error);
            }
        }
    };

    const fetchStudentData = async (id, token) => {
        await fetchStudentName(id, token);
        refreshMoods(token);
        fetchSocialisations(token);
        fetchExercises(token);
        fetchSleeps(token);
        fetchTags(token);
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

    const fetchTags = async () => {
        try {
            const response = await fetch(variables.API_URL + 'tags', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
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

    const handleTagSelection = (tag) => {
        setSelectedTags(prevSelectedTags => {
            if (prevSelectedTags.includes(tag.tag_id)) {
                return prevSelectedTags.filter(id => id !== tag.tag_id);
            } else {
                return [...prevSelectedTags, tag.tag_id];
            }
        });
    };

    const handleSubmit = async () => {
        if (
            !selectedMood ||
            !selectedExercise ||
            !selectedSleep ||
            !selectedSocialisation ||
            !selectedProductivity
        ) {
            setErrorMessage('Please complete all required fields.');
            return;
        }

        try {
            if (!token) {
                setErrorMessage('No token found, please log in again.');
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
                    productivity_score: selectedProductivity,
                    tags: selectedTags
                })
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage(''); // Clear any existing error message
                fetchSavedSelections(studentId, token);
            } else {
                // Check if the message is "Please complete all fields"
                if (data.message === 'Please complete all fields') {
                    setErrorMessage('Please complete all fields');
                } else {
                    setErrorMessage(data.message || 'An unknown error occurred');
                }
            }
        } catch (error) {
            setErrorMessage('An error occurred while submitting the form. Please try again later.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-2 p-8 theme-primary-bg">
            <h3 className="text-3xl font-semibold mb-8 text-center theme-primary-text">Daily Tracker</h3>
            <h3 className="text-2xl font-semibold mb-8 theme-primary-text">Hey {studentName},</h3>
            <form>
                <div className="form-group mb-8">
                    <label className="block theme-primary-text text-lg mb-8 ml-32">How did you feel overall today?</label>
                    <div className="flex flex-wrap gap-4 justify-center ">
                        {moods.length === 0 ? (
                            <p className="theme-secondary-text">Loading moods...</p>
                        ) : (
                            [...moods]
                                .sort((a, b) => a.mood_score - b.mood_score)  // Sort moods by mood_score
                                .map(mood => (
                                    <button
                                        key={mood.mood_id}
                                        type="button"
                                        className={`btn px-3 py-2 transition mb-4 ${selectedMood === mood.mood_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                        onClick={() => handleMoodSelection(mood)}
                                    >
                                        {mood.mood_name}
                                    </button>
                                ))
                        )}
                    </div>
                </div>

                <div className="form-group mb-8">
                    <label className="block theme-primary-text text-lg mb-8 ml-32">How many minutes of exercise did you complete today?</label>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {exercises.length === 0 ? (
                            <p className="theme-secondary-text">Loading exercises...</p>
                        ) : (
                            exercises.map(exercise => (
                                <button
                                    key={exercise.exercise_id}
                                    type="button"
                                    className={`btn px-3 py-2 transition mb-4 ${selectedExercise === exercise.exercise_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                    onClick={() => handleExerciseSelection(exercise)}
                                >
                                    {exercise.exercise_name}
                                </button>
                            ))
                        )}
                    </div>
                </div>
                <div className="form-group mb-8">
                    <label className="block theme-primary-text text-lg mb-8 ml-32">How do you rate last night's sleep?</label>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {sleeps.length === 0 ? (
                            <p className="theme-secondary-text">Loading sleeps...</p>
                        ) : (
                            sleeps.map(sleep => (
                                <button
                                    key={sleep.sleep_id}
                                    type="button"
                                    className={`btn px-3 py-2 transition mb-4 ${selectedSleep === sleep.sleep_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                    onClick={() => handleSleepSelection(sleep)}
                                >
                                    {sleep.sleep_name}
                                </button>
                            ))
                        )}
                    </div>
                </div>
                <div className="form-group mb-8">
                    <label className="block theme-primary-text text-lg mb-8 ml-32">How many minutes of a non-physical social activity did you complete today?</label>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {socialisations.length === 0 ? (
                            <p className="theme-secondary-text">Loading socialisations...</p>
                        ) : (
                            socialisations.map(socialisation => (
                                <button
                                    key={socialisation.socialisation_id}
                                    type="button"
                                    className={`btn px-3 py-2 transition mb-4 ${selectedSocialisation === socialisation.socialisation_id ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                    onClick={() => handleSocialisationSelection(socialisation)}
                                >
                                    {socialisation.socialisation_name}
                                </button>
                            ))
                        )}
                    </div>
                </div>
                <div className="form-group mb-8">
                    <label className="block theme-primary-text text-lg mb-8 ml-32">Rate your productivity today (1-5):</label>
                    <div className="flex gap-4 justify-center">
                        {[1, 2, 3, 4, 5].map(value => (
                            <button
                                key={value}
                                type="button"
                                className={`btn px-3 py-2 transition mb-4 ${selectedProductivity === value ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                onClick={() => handleProductivityChange(value)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="form-group mb-8">
                    <label className="block theme-primary-text text-lg mb-8 ml-32">Is there anything else you would like to track?</label>
                    <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
                        {tags.length === 0 ? (
                            <p className="theme-secondary-text">Loading tags...</p>
                        ) : (
                            tags.map(tag => (
                                <button
                                    key={tag.tag_id}
                                    type="button"
                                    className={`btn px-3 py-2 transition mb-2 ${selectedTags.includes(tag.tag_id) ? 'theme-button-bg theme-button-text' : 'theme-secondary-bg theme-secondary-text hover:bg-gray-300'}`}
                                    onClick={() => handleTagSelection(tag)}
                                >
                                    {tag.tag_name}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 text-center">
                        {errorMessage}
                    </div>
                )}
                <div className="form-group text-center">
                    <button type="button" className="btn theme-button-bg theme-button-text w-100 mt-3 py-2 hover:opacity-80" onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export { DailyTrack };
