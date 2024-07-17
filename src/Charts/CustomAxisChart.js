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

const CustomAxisChart = ({ studentId }) => {
    const [moodScores, setMoodScores] = useState([]);
    const [exerciseDurations, setExerciseDurations] = useState([]);
    const [sleepDurations, setSleepDurations] = useState([]);
    const [socialisationScores, setSocialisationScores] = useState([]);
    const [xAxis, setXAxis] = useState('mood');
    const [yAxis, setYAxis] = useState('exercise');

    useEffect(() => {
        if (studentId) {
            fetchData(studentId, 'mood-scores').then(data => setMoodScores(data.moodScores));
            fetchData(studentId, 'exercise-minutes').then(data => setExerciseDurations(data.exerciseMinutes));
            fetchData(studentId, 'sleep-durations').then(data => setSleepDurations(data.sleepDurations));
            fetchData(studentId, 'socialisation').then(data => setSocialisationScores(data.socialisationScores));
        }
    }, [studentId]);

    const getDataPoints = () => {
        const dataPoints = [];

        const allDates = [...new Set([
            ...moodScores.map(record => record.daily_record_timestamp),
            ...exerciseDurations.map(record => record.daily_record_timestamp),
            ...sleepDurations.map(record => record.daily_record_timestamp),
            ...socialisationScores.map(record => record.daily_record_timestamp)
        ])];

        allDates.forEach(date => {
            const mood = moodScores.find(record => record.daily_record_timestamp === date)?.mood_score;
            const exercise = exerciseDurations.find(record => record.daily_record_timestamp === date)?.exercise_duration;
            const sleep = sleepDurations.find(record => record.daily_record_timestamp === date)?.sleep_duration;
            const socialisation = socialisationScores.find(record => record.daily_record_timestamp === date)?.socialisation_score;

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

    const chartData = {
        datasets: [
            {
                label: `${xAxis.charAt(0).toUpperCase() + xAxis.slice(1)} vs ${yAxis.charAt(0).toUpperCase() + yAxis.slice(1)}`,
                data: getDataPoints(),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 3,
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
                display: true,
                text: 'Custom Axis Chart',
            },
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: `${xAxis.charAt(0).toUpperCase() + xAxis.slice(1)}`,
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: `${yAxis.charAt(0).toUpperCase() + yAxis.slice(1)}`,
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
                        <option value="mood">Mood Score</option>
                        <option value="exercise">Exercise Duration</option>
                        <option value="sleep">Sleep Duration</option>
                        <option value="socialisation">Socialisation Score</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2">Y-Axis:</label>
                    <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="form-select">
                        <option value="mood">Mood Score</option>
                        <option value="exercise">Exercise Duration</option>
                        <option value="sleep">Sleep Duration</option>
                        <option value="socialisation">Socialisation Score</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CustomAxisChart;
