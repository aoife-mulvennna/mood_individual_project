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

const ProductivityScoreChart = ({ studentId }) => {
    const [productivityScores, setProductivityScores] = useState([]);

    useEffect(() => {
        if (studentId) {
            fetchProductivityScores(studentId);
        }
    }, [studentId]);

    const fetchProductivityScores = (userId) => {
        fetch(`${variables.API_URL}productivity-scores/${userId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setProductivityScores(data.productivityScores))
            .catch((error) => console.error('Error fetching productivity scores:', error));
    };

    const dataPoints = productivityScores.map(record => ({
        x: new Date(record.daily_record_timestamp),
        y: record.productivity_score,
    }));

    const chartData = {
        datasets: [
            {
                label: 'Productivity Score',
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
                text: 'Productivity Score Over Time',
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
                max: 5, // Assuming productivity score is between 0 and 5
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default ProductivityScoreChart;
