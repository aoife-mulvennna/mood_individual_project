import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartTrendline from 'chartjs-plugin-trendline';
import { variables } from '../Variables';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartTrendline);

const fetchData = async (userId, endpoint) => {
    const response = await fetch(`${variables.API_URL}${endpoint}/${userId}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.json();
};


const fetchMoods = async () => {
    const response = await fetch(`${variables.API_URL}mood`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.json();
};
const fetchExercises = async () => {
    const response = await fetch(`${variables.API_URL}exercises`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.json();
};

const fetchSleep = async () => {
    const response = await fetch(`${variables.API_URL}sleeps`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.json();
};

const fetchSocialisations = async () => {
    const response = await fetch(`${variables.API_URL}socialisations`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.json();
};

const CustomAxisChart = ({ studentId }) => {
    const [moodScores, setMoodScores] = useState([]);
    const [exerciseDurations, setExerciseDurations] = useState([]);
    const [sleepDurations, setSleepDurations] = useState([]);
    const [socialisationScores, setSocialisationScores] = useState([]);
    const [productivityScores, setProductivityScores] = useState([]);
    const [xAxis, setXAxis] = useState('mood');
    const [yAxis, setYAxis] = useState('exercise');
    const [moodNameMap, setMoodNameMap] = useState({});
    const [exerciseNameMap, setExerciseNameMap] = useState({});
    const [sleepNameMap, setSleepNameMap] = useState({});
    const [socialisationNameMap, setSocialisationNameMap] = useState({});

    useEffect(() => {
        if (studentId) {
            fetchData(studentId, 'mood-scores').then(data => setMoodScores(data.moodScores));
            fetchData(studentId, 'exercise-time').then(data => setExerciseDurations(data.exerciseTime));
            fetchData(studentId, 'sleep-rating').then(data => setSleepDurations(data.sleepRating));
            fetchData(studentId, 'socialisation').then(data => setSocialisationScores(data.socialisationScores));
            fetchData(studentId, 'productivity-scores').then(data => setProductivityScores(data.productivityScores));
            fetchMoods().then(data => {
                const moodMap = {};
                data.forEach(mood => {
                    moodMap[mood.mood_score] = mood.mood_name;
                });
                setMoodNameMap(moodMap);
            });
            fetchExercises().then(data => {
                const exerciseMap = {};
                data.forEach(exercise => {
                    exerciseMap[exercise.exercise_score] = exercise.exercise_name;
                });
                setExerciseNameMap(exerciseMap);
            });
            fetchSleep().then(data => {
                const sleepMap = {};
                data.forEach(sleep => {
                    sleepMap[sleep.sleep_score] = sleep.sleep_name;
                });
                setSleepNameMap(sleepMap);
            });
            fetchSocialisations().then(data => {
                const socialisationMap = {};
                data.forEach(socialisation => {
                    socialisationMap[socialisation.socialisation_score] = socialisation.socialisation_name;
                });
                setSocialisationNameMap(socialisationMap);
            });
        }
    }, [studentId]);

    const getDataPoints = () => {
        const dataPoints = [];

        const allDates = [...new Set([
            ...moodScores.map(record => record.daily_record_timestamp),
            ...exerciseDurations.map(record => record.daily_record_timestamp),
            ...sleepDurations.map(record => record.daily_record_timestamp),
            ...socialisationScores.map(record => record.daily_record_timestamp),
            ...productivityScores.map(record => record.daily_record_timestamp)
        ])];

        allDates.forEach(date => {
            const mood = moodScores.find(record => record.daily_record_timestamp === date)?.mood_score;
            const exercise = exerciseDurations.find(record => record.daily_record_timestamp === date)?.exercise_score;
            const sleep = sleepDurations.find(record => record.daily_record_timestamp === date)?.sleep_id;
            const socialisation = socialisationScores.find(record => record.daily_record_timestamp === date)?.socialisation_score;
            const productivity = productivityScores.find(record => record.daily_record_timestamp === date)?.productivity_score;

            const point = {
                x: eval(xAxis),
                y: eval(yAxis)
            };

            if (point.x !== undefined && point.y !== undefined) {
                dataPoints.push(point);
            }
        });

        return dataPoints;
    };

    const getAxisOptions = (axis, nameMap) => ({
        type: 'linear',
        position: 'left',
        min: 0,
        max: 5,
        ticks: {
            stepSize: 1,
            callback: function (value) {
                return nameMap[value] || value;
            }
        },
        title: {
            display: true,
            text: axis.charAt(0).toUpperCase() + axis.slice(1)
        }
    });

    const chartData = {
        datasets: [
            {
                label: `${xAxis.charAt(0).toUpperCase() + xAxis.slice(1)} vs ${yAxis.charAt(0).toUpperCase() + yAxis.slice(1)}`,
                data: getDataPoints(),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 0,
                pointHoverRadius: 10,
                trendlineLinear: {
                    style: "rgba(255,105,180, .8)",
                    lineStyle: "solid",
                    width: 2
                }
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                // display: true,
                // text: 'Custom Axis Chart',
            },
        },
        scales: {
            x: xAxis === 'mood' ? getAxisOptions(xAxis, moodNameMap, 'bottom') :
                xAxis === 'exercise' ? getAxisOptions(xAxis, exerciseNameMap, 'bottom') :
                    xAxis === 'sleep' ? getAxisOptions(xAxis, sleepNameMap, 'bottom') :
                        xAxis === 'socialisation' ? getAxisOptions(xAxis, socialisationNameMap, 'bottom') : {
                            type: 'linear',
                            position: 'bottom',
                            min: 0,
                            max: 5,
                            title: {
                                display: true,
                                text: xAxis.charAt(0).toUpperCase() + xAxis.slice(1),
                            },
                        },
            y: yAxis === 'mood' ? getAxisOptions(yAxis, moodNameMap, 'left') :
                yAxis === 'exercise' ? getAxisOptions(yAxis, exerciseNameMap, 'left') :
                    yAxis === 'sleep' ? getAxisOptions(yAxis, sleepNameMap, 'left') :
                        yAxis === 'socialisation' ? getAxisOptions(yAxis, socialisationNameMap, 'left') : {
                            type: 'linear',
                            position: 'left',
                            min: 0,
                            max: 5,
                            title: {
                                display: true,
                                text: yAxis.charAt(0).toUpperCase() + yAxis.slice(1),
                            },
                        },

        },
    };

    return (
        <div className="bg-white p-6 rounded shadow-md flex flex-col lg:flex-row">
            <div className="flex-1" style={{ height: '500px' }}>
                <Scatter data={chartData} options={options} />
            </div>
            <div className="flex flex-col items-start lg:items-center lg:justify-center space-y-2 mt-4 lg:mt-0 lg:ml-4">
                <div>
                    <label className="mr-2">X-Axis:</label>
                    <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="form-select">
                        <option value="mood">Mood</option>
                        <option value="exercise">Exercise</option>
                        <option value="sleep">Sleep</option>
                        <option value="socialisation">Socialisation</option>
                        <option value="productivity">Productivity</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2">Y-Axis:</label>
                    <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="form-select">
                        <option value="mood">Mood</option>
                        <option value="exercise">Exercise</option>
                        <option value="sleep">Sleep</option>
                        <option value="socialisation">Socialisation</option>
                        <option value="productivity">Productivity</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CustomAxisChart;
