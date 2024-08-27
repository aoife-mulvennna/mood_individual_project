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

const MoodScoreChart = ({ studentId }) => {
    const [moodScores, setMoodScores] = useState([]);
    const [dateRange, setDateRange] = useState([]);

    useEffect(() => {
        if (studentId) {
            fetchMoodScores(studentId);
        }
    }, [studentId]);

    const fetchMoodScores = (userId) => {
        fetch(`${variables.API_URL}mood-scores/${userId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setMoodScores(data.moodScores);

                if (data.moodScores.length > 0) {
                    const startDate = data.moodScores[0].record_timestamp;
                    const endDate = data.moodScores[data.moodScores.length - 1].record_timestamp;
                    setDateRange(generateDateRange(startDate, endDate));
                }
            })
            .catch((error) => console.error('Error fetching mood scores:', error));
    };

    const moodLabels = moodScores.reduce((acc, record) => {
        acc[record.mood_score] = record.mood_name;
        return acc;
    }, {});

    const dataPoints = moodScores.map(record => ({
        x: new Date(record.record_timestamp),
        y: record.mood_score,
    }));

    const chartData = {
        datasets: [
            {
                label: 'Mood Score',
                data: dataPoints,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Mood Scores Over Time',
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
            y: {
                type: 'linear',
                beginAtZero: true,
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        return moodLabels[value] || value;
                    }
                }
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default MoodScoreChart;
