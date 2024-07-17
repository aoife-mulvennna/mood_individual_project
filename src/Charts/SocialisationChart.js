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

const SocialisationChart = ({studentId})=>{
    const [socialisationScores, setSocialisationScores] = useState([]);

    useEffect(()=>{
        if (studentId){
            fetchSocialisationScores(studentId);
        }
    },[studentId]);
    const fetchSocialisationScores = (userId)=>{
        fetch(`${variables.API_URL}socialisation/${userId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setSocialisationScores(data.socialisationScores))
            .catch((error) => console.error('Error fetching mood scores:', error));
    };

    const dataPoints = socialisationScores.map(record => ({
        x: new Date(record.daily_record_timestamp),
        y: record.socialisation_score,
    }));

    const socialisationLabels = socialisationScores.reduce((acc, record) => {
        acc[record.socialisation_score] = record.socialisation_name;
        return acc;
    }, {});
    const chartData = {
        datasets: [
            {
                label: 'Socialisation Score',
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
                text: 'Socialisation Score Over Time',
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
                max: 4,
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        return socialisationLabels[value] || value;
                    }
                }
            },
        },
    };
    return <Line data={chartData} options={options} />;
};

export default SocialisationChart;