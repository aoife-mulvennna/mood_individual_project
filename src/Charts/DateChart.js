import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { variables } from '../Variables';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const generateDateRange = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
};

const fetchData = async (userId, endpoint) => {
    const response = await fetch(`${variables.API_URL}${endpoint}/${userId}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.json();
};

const DateChart = ({ studentId }) => {
    const [moodScores, setMoodScores] = useState([]);
    const [exerciseDurations, setExerciseDurations] = useState([]);
    const [sleepDurations, setSleepDurations] = useState([]);
    const [socialisationScores, setSocialisationScores] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState({
        mood: true,
        exercise: false,
        sleep: false,
        socialisation: false,
    });
    const [selectedRange, setSelectedRange] = useState('7_days');

    useEffect(() => {
        if (studentId) {
            fetchData(studentId, 'mood-scores').then(data => setMoodScores(data.moodScores));
            fetchData(studentId, 'exercise-minutes').then(data => setExerciseDurations(data.exerciseMinutes));
            fetchData(studentId, 'sleep-durations').then(data => setSleepDurations(data.sleepDurations));
            fetchData(studentId, 'socialisation').then(data => setSocialisationScores(data.socialisationScores));
        }
    }, [studentId]);

    useEffect(() => {
        const allData = [...moodScores, ...exerciseDurations, ...sleepDurations, ...socialisationScores];
        if (allData.length > 0) {
            const startDate = allData.reduce((min, p) => p.daily_record_timestamp < min ? p.daily_record_timestamp : min, allData[0].daily_record_timestamp);
            const endDate = allData.reduce((max, p) => p.daily_record_timestamp > max ? p.daily_record_timestamp : max, allData[0].daily_record_timestamp);
            setDateRange(generateDateRange(startDate, endDate));
        }
    }, [moodScores, exerciseDurations, sleepDurations, socialisationScores]);

    const filterDataByRange = (data, range) => {
        const now = new Date();
        let startDate;

        if (range === '7_days') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (range === '1_month') {
            startDate = new Date(now.setMonth(now.getMonth() - 1));
        } else if (range === '1_year') {
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        } else {
            startDate = new Date(0); // Default to all time if range is not recognized
        }

        return data.filter(record => new Date(record.x) >= startDate);
    };

    const dataPoints = {
        mood: filterDataByRange(moodScores.map(record => ({ x: new Date(record.daily_record_timestamp), y: record.mood_score })), selectedRange),
        exercise: filterDataByRange(exerciseDurations.map(record => ({ x: new Date(record.daily_record_timestamp), y: record.exercise_duration })), selectedRange),
        sleep: filterDataByRange(sleepDurations.map(record => ({ x: new Date(record.daily_record_timestamp), y: record.sleep_duration })), selectedRange),
        socialisation: filterDataByRange(socialisationScores.map(record => ({ x: new Date(record.daily_record_timestamp), y: record.socialisation_score })), selectedRange),
    };

    const chartData = {
        labels: dateRange,
        datasets: [
            selectedMetrics.mood && {
                label: 'Mood Score',
                data: dataPoints.mood,
                yAxisID: 'yMood',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            selectedMetrics.exercise && {
                label: 'Exercise Duration (min)',
                data: dataPoints.exercise,
                yAxisID: 'yExercise',
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
            selectedMetrics.sleep && {
                label: 'Sleep Duration (hours)',
                data: dataPoints.sleep,
                yAxisID: 'ySleep',
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
            },
            selectedMetrics.socialisation && {
                label: 'Socialisation Score',
                data: dataPoints.socialisation,
                yAxisID: 'ySocialisation',
                borderColor: 'rgb(255, 206, 86)',
                tension: 0.1,
            },
        ].filter(Boolean),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Metrics Over Time',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'dd/MM/yyyy',
                },
            },
            yMood: {
                type: 'linear',
                position: 'left',
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
                },
                title: {
                    display: true,
                    text: 'Mood Score'
                }
            },
            yExercise: {
                type: 'linear',
                position: 'left',
                min: 0,
                max: 60,
                ticks: {
                    stepSize: 10,
                },
                title: {
                    display: true,
                    text: 'Exercise Duration (min)'
                }
            },
            ySleep: {
                type: 'linear',
                position: 'right',
                min: 0,
                max: 12,
                ticks: {
                    stepSize: 1,
                },
                title: {
                    display: true,
                    text: 'Sleep Duration (hours)'
                }
            },
            ySocialisation: {
                type: 'linear',
                position: 'right',
                min: 0,
                max: 4,
                ticks: {
                    stepSize: 1,
                },
                title: {
                    display: true,
                    text: 'Socialisation Score'
                }
            }
        },
    };

    const handleMetricChange = (e) => {
        setSelectedMetrics(prevState => ({
            ...prevState,
            [e.target.name]: e.target.checked,
        }));
    };

    const handleRangeChange = (e) => {
        setSelectedRange(e.target.value);
    };

    return (
        <div>
            <div className="mb-4">
                <label>
                    <input
                        type="checkbox"
                        name="mood"
                        checked={selectedMetrics.mood}
                        onChange={handleMetricChange}
                    />
                    Mood Score
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="exercise"
                        checked={selectedMetrics.exercise}
                        onChange={handleMetricChange}
                    />
                    Exercise Duration
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="sleep"
                        checked={selectedMetrics.sleep}
                        onChange={handleMetricChange}
                    />
                    Sleep Duration
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="socialisation"
                        checked={selectedMetrics.socialisation}
                        onChange={handleMetricChange}
                    />
                    Socialisation Score
                </label>
            </div>
            <div className="mb-4">
                <label>
                    <input
                        type="radio"
                        name="dateRange"
                        value="7_days"
                        checked={selectedRange === '7_days'}
                        onChange={handleRangeChange}
                    />
                    Last 7 Days
                </label>
                <label>
                    <input
                        type="radio"
                        name="dateRange"
                        value="1_month"
                        checked={selectedRange === '1_month'}
                        onChange={handleRangeChange}
                    />
                    Last Month
                </label>
                <label>
                    <input
                        type="radio"
                        name="dateRange"
                        value="1_year"
                        checked={selectedRange === '1_year'}
                        onChange={handleRangeChange}
                    />
                    Last Year
                </label>
            </div>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default DateChart;
