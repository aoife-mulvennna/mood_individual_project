// src/charts/MoodScoreChart.js

import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { variables } from '../Variables';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MoodScoreChart = ({ studentId }) => {
    const [moodScores, setMoodScores] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        if (studentId) {
            fetchMoodScores(studentId);
        }
    }, [studentId]);

    const fetchMoodScores = (userId) => {
        fetch(`${variables.API_URL}mood-scores/${userId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setMoodScores(data.moodScores))
            .catch(error => console.error('Error fetching mood scores:', error));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const data = {
        labels: moodScores.map(record => formatDate(record.daily_record_timestamp)),
        datasets: [
            {
                label: 'Mood Score',
                data: moodScores.map(record => record.mood_score),
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
    };

    useEffect(() => {
        const chartInstance = chartRef.current;

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, []);

    return <Line data={data} options={options} />;
};

export default MoodScoreChart;
