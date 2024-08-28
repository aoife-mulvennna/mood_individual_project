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

const aggregateByDate = (data, key) => {
    const result = {};
    data.forEach(record => {
        const timestamp = record.record_timestamp || record.daily_record_timestamp;  // Ensure using the correct field
        if (!timestamp || isNaN(new Date(timestamp).getTime())) {
            console.warn(`Invalid or missing timestamp encountered:`, record);
            return;
        }

        const date = new Date(timestamp).toISOString().split('T')[0];
        if (!result[date]) {
            result[date] = { count: 0, total: 0 };
        }
        result[date].count += 1;
        result[date].total += record[key];
    });

    return Object.keys(result).map(date => ({
        x: new Date(date),
        y: result[date].total / result[date].count,
    }));
};

const calculateAverage = (data) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, point) => acc + point.y, 0);
    return sum / data.length;
};

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

const DateChart = ({ studentId }) => {
    const [moodScores, setMoodScores] = useState([]);
    const [exerciseDurations, setExerciseDurations] = useState([]);
    const [sleepDurations, setSleepDurations] = useState([]);
    const [socialisationScores, setSocialisationScores] = useState([]);
    const [productivityScores, setProductivityScores] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState({
        mood: true,
        exercise: false,
        sleep: false,
        socialisation: false,
        productivity: false,
    });
    const [selectedRange, setSelectedRange] = useState('7_days');
    const [moodNameMap, setMoodNameMap] = useState({});
    const [exerciseNameMap, setExerciseNameMap] = useState({});
    const [sleepNameMap, setSleepNameMap] = useState({});
    const [socialisationNameMap, setSocialisationNameMap] = useState({});

    useEffect(() => {
        if (studentId) {
            fetchData(studentId, 'mood-scores').then(data => {
                console.log('Fetched mood data:', data.moodScores); // Log the mood data
                setMoodScores(aggregateByDate(data.moodScores, 'mood_score'));
            });
            fetchData(studentId, 'exercise-time').then(data => setExerciseDurations(aggregateByDate(data.exerciseTime, 'exercise_score')));
            fetchData(studentId, 'sleep-rating').then(data => setSleepDurations(aggregateByDate(data.sleepRating, 'sleep_score')));
            fetchData(studentId, 'socialisation').then(data => setSocialisationScores(aggregateByDate(data.socialisationScores, 'socialisation_score')));
            fetchData(studentId, 'productivity-scores').then(data => setProductivityScores(aggregateByDate(data.productivityScores, 'productivity_score')));
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

    useEffect(() => {
        const allData = [...moodScores, ...exerciseDurations, ...sleepDurations, ...socialisationScores, ...productivityScores];
        if (allData.length > 0) {
            const startDate = allData.reduce((min, p) => p.x < min ? p.x : min, allData[0].x);
            const endDate = allData.reduce((max, p) => p.x > max ? p.x : max, allData[0].x);
            setDateRange(generateDateRange(startDate, endDate));
        }
    }, [moodScores, exerciseDurations, sleepDurations, socialisationScores, productivityScores]);

    const filterDataByRange = (data, range) => {
        const now = new Date();
        let startDate;

        if (range === '7_days') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === '1_month') {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (range === '1_year') {
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
        } else {
            startDate = new Date(0); // Default to all time if range is not recognized
        }

        return data.filter(record => new Date(record.x) >= startDate);
    };

    const dataPoints = {
        mood: filterDataByRange(moodScores, selectedRange),
        exercise: filterDataByRange(exerciseDurations, selectedRange),
        sleep: filterDataByRange(sleepDurations, selectedRange),
        socialisation: filterDataByRange(socialisationScores, selectedRange),
        productivity: filterDataByRange(productivityScores, selectedRange),
    };

    const getMinDate = () => {
        const now = new Date();
        if (selectedRange === '7_days') {
            return new Date(now.setDate(now.getDate() - 6));
        } else if (selectedRange === '1_month') {
            return new Date(now.setMonth(now.getMonth() - 1));
        } else if (selectedRange === '1_year') {
            return new Date(now.setFullYear(now.getFullYear() - 1));
        }
        return new Date(0);
    };
    const getYAxisOptions = (selectedMetrics, moodNameMap, exerciseNameMap, sleepNameMap, socialisationNameMap) => {
        const yAxisOptions = {};

        if (selectedMetrics.mood) {
            yAxisOptions.yMood = {
                type: 'linear',
                position: 'left',
                min: 1, // Ensure min starts at 1 (adjust this as necessary)
                max: 5, // Ensure max is at 5 (adjust this as necessary)
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return moodNameMap[value] || value;
                    },
                    maxRotation: 38,
                    minRotation: 38
                },
                title: {
                    display: true,
                    text: 'Mood'
                },
            };
        }

        if (selectedMetrics.exercise) {
            yAxisOptions.yExercise = {
                type: 'linear',
                position: 'left',
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return exerciseNameMap[value] || value;
                    },
                    maxRotation: 38,
                    minRotation: 38
                },
                title: {
                    display: true,
                    text: 'Exercise'
                }
            };
        }

        if (selectedMetrics.sleep) {
            yAxisOptions.ySleep = {
                type: 'linear',
                position: 'right',
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return sleepNameMap[value] || value;
                    },
                    maxRotation: 38,
                    minRotation: 38
                },
                title: {
                    display: true,
                    text: 'Sleep'
                }
            };
        }

        if (selectedMetrics.socialisation) {
            yAxisOptions.ySocialisation = {
                type: 'linear',
                position: 'right',
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return socialisationNameMap[value] || value;
                    },
                    maxRotation: 38,
                    minRotation: 38
                },
                title: {
                    display: true,
                    text: 'Socialisation'
                }
            };
        }

        if (selectedMetrics.productivity) {
            yAxisOptions.yProductivity = {
                type: 'linear',
                position: 'left',
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1,
                    maxRotation: 38,
                    minRotation: 38
                },
                title: {
                    display: true,
                    text: 'Productivity'
                }
            };
        }

        return yAxisOptions;
    };

    const chartData = {
        datasets: [
            selectedMetrics.mood && {
                label: 'Mood',
                data: dataPoints.mood,
                yAxisID: 'yMood',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.mood && {
                label: 'Average Mood',
                data: dataPoints.mood.map(point => ({ x: point.x, y: calculateAverage(dataPoints.mood) })),
                yAxisID: 'yMood',
                borderColor: 'rgb(75, 192, 192)',
                borderDash: [6, 10],
                borderWidth: 4,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.exercise && {
                label: 'Exercise',
                data: dataPoints.exercise,
                yAxisID: 'yExercise',
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.exercise && {
                label: 'Average Exercise',
                data: dataPoints.exercise.map(point => ({ x: point.x, y: calculateAverage(dataPoints.exercise) })),
                yAxisID: 'yExercise',
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [6, 10],
                borderWidth: 4,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.sleep && {
                label: 'Sleep',
                data: dataPoints.sleep,
                yAxisID: 'ySleep',
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.sleep && {
                label: 'Average Sleep',
                data: dataPoints.sleep.map(point => ({ x: point.x, y: calculateAverage(dataPoints.sleep) })),
                yAxisID: 'ySleep',
                borderColor: 'rgb(54, 162, 235)',
                borderDash: [6, 10],
                borderWidth: 4,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.socialisation && {
                label: 'Socialisation',
                data: dataPoints.socialisation,
                yAxisID: 'ySocialisation',
                borderColor: 'rgb(255, 206, 86)',
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.socialisation && {
                label: 'Average Socialisation',
                data: dataPoints.socialisation.map(point => ({ x: point.x, y: calculateAverage(dataPoints.socialisation) })),
                yAxisID: 'ySocialisation',
                borderColor: 'rgb(255, 206, 86)',
                borderDash: [6, 10],
                borderWidth: 4,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.productivity && {
                label: 'Productivity',
                data: dataPoints.productivity,
                yAxisID: 'yProductivity',
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
            selectedMetrics.productivity && {
                label: 'Average Productivity',
                data: dataPoints.productivity.map(point => ({ x: point.x, y: calculateAverage(dataPoints.productivity) })),
                yAxisID: 'yProductivity',
                borderColor: 'rgb(153, 102, 255)',
                borderDash: [6, 10],
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 0,
                borderWidth: 4,
            },
        ].filter(Boolean),
    };


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20, 
                },
            },
        },
        layout: {
            padding: {
                top: 10,
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: selectedRange === '1_year' ? 'month' : 'day',
                    tooltipFormat: 'dd/MM/yyyy',
                },
                min: getMinDate(),
                max: new Date(),
                ticks: {
                    autoSkip: false,
                    maxRotation: 40,
                    minRotation: 40
                }
            },
            ...getYAxisOptions(selectedMetrics, moodNameMap, exerciseNameMap, sleepNameMap, socialisationNameMap)
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
        <div className="bg-white p-6 flex flex-col lg:flex-row lg:space-x-6 lg:space-y-0 space-y-4">
            <div className="flex-grow" style={{ height: '500px' }}>
                <Line data={chartData} options={options} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="mood"
                            checked={selectedMetrics.mood}
                            onChange={handleMetricChange}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>Mood</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="exercise"
                            checked={selectedMetrics.exercise}
                            onChange={handleMetricChange}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>Exercise</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="sleep"
                            checked={selectedMetrics.sleep}
                            onChange={handleMetricChange}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>Sleep</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="socialisation"
                            checked={selectedMetrics.socialisation}
                            onChange={handleMetricChange}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>Socialisation</span>
                    </label>
                    <label className="flex items-center space-x-2  text-gray-800">
                        <input
                            type="checkbox"
                            name="productivity"
                            checked={selectedMetrics.productivity}
                            onChange={handleMetricChange}
                            className="form-checkbox h-4 w-4"
                        />
                        <span>Productivity</span>
                    </label>
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2 text-gray-800">
                        <input
                            type="radio"
                            name="dateRange"
                            value="7_days"
                            checked={selectedRange === '7_days'}
                            onChange={handleRangeChange}
                            className="form-radio h-4 w-4"
                        />
                        <span>Last 7 Days</span>
                    </label>
                    <label className="flex items-center space-x-2  text-gray-800">
                        <input
                            type="radio"
                            name="dateRange"
                            value="1_month"
                            checked={selectedRange === '1_month'}
                            onChange={handleRangeChange}
                            className="form-radio h-4 w-4"
                        />
                        <span>Last Month</span>
                    </label>
                    <label className="flex items-center space-x-2  text-gray-800">
                        <input
                            type="radio"
                            name="dateRange"
                            value="1_year"
                            checked={selectedRange === '1_year'}
                            onChange={handleRangeChange}
                            className="form-radio h-4 w-4"
                        />
                        <span>Last Year</span>
                    </label>
                </div>

            </div>
        </div>
    );
};

export default DateChart;
