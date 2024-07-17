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

const ExerciseMinutesChart = ({ studentId }) => {
    const [exerciseMinutes, setExerciseMinutes] = useState([]);

    useEffect(() => {
        if (studentId) {
            fetchExerciseMinutes(studentId);
        }
    }, [studentId]);

    const fetchExerciseMinutes = (userId) => {
        fetch(`${variables.API_URL}exercise-minutes/${userId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setExerciseMinutes(data.exerciseMinutes))
            .catch((error) => console.error('Error fetching exercise minutes:', error));
    };

    const dataPoints = exerciseMinutes.map(record => ({
        x: new Date(record.daily_record_timestamp),
        y: record.exercise_duration,
    }));

    const chartData = {
        datasets: [
            {
                label: 'Exercise Minutes',
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
                text: 'Exercise Minutes Over Time',
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
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default ExerciseMinutesChart;
