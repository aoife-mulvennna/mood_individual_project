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

const SleepDurationChart = ({ studentId }) => {
    const [sleepDurations, setSleepDurations] = useState([]);

    useEffect(() => {
        if (studentId) {
            fetchSleepDurations(studentId);
        }
    }, [studentId]);

    const fetchSleepDurations = (userId) => {
        fetch(`${variables.API_URL}sleep-durations/${userId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setSleepDurations(data.sleepDurations))
            .catch((error) => console.error('Error fetching sleep durations:', error));
    };

    const dataPoints = sleepDurations.map(record => ({
        x: new Date(record.daily_record_timestamp),
        y: record.sleep_duration,
    }));

    const chartData = {
        datasets: [
            {
                label: 'Sleep Duration (hours)',
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
                text: 'Sleep Duration Over Time',
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
                max: 12, // Assuming sleep duration is between 0 and 12 hours
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default SleepDurationChart;
