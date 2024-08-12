import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import {jwtDecode} from 'jwt-decode';
import DateChart from '../Charts/DateChart';
import CustomAxisChart from '../Charts/CustomAxisChart';

const MyRecord = () => {
    const [dailyRecords, setDailyRecords] = useState([]);
    const [quickTrackerRecords, setQuickTrackerRecords] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setStudentId(decodedToken.id);
            fetchDailyRecords(decodedToken.id);
            fetchQuickTrackerRecords(decodedToken.id);
            fetchStudentInsights(decodedToken.id);
        }
    }, []);

    const fetchDailyRecords = async (studentId) => {
        try {
            const response = await fetch(`${variables.API_URL}records/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setDailyRecords(data.records);
            } else {
                setError(data.message);
            }
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch daily records');
            setLoading(false);
        }
    };

    const fetchQuickTrackerRecords = async (studentId) => {
        try {
            const response = await fetch(`${variables.API_URL}quick-tracker/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setQuickTrackerRecords(data.records);
            } else {
                setError(data.message);
            }
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch quick tracker records');
            setLoading(false);
        }
    };

    const fetchStudentInsights = async (studentId) => {
        try {
            const response = await fetch(`${variables.API_URL}student-insights/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setInsights(data.insights);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to fetch student insights');
        }
    };

    if (loading) {
        return <p className="text-center text-gray-600">Loading records...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto mt-2 p-6 bg-white rounded-lg">
            <h3 className="text-center text-3xl font-bold text-gray-800 mb-8">Personal Records Overview</h3>
            
            {insights.length > 0 && (
                <div className="mb-8">
                    <h4 className="text-2xl font-semibold text-gray-700 mb-4">Weekly Insights</h4>
                    <ul className="list-disc pl-5 space-y-2">
                        {insights.map((insight, index) => (
                            <li key={index} className="text-gray-600">{insight}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Mood and Activity Trends</h3>
                <DateChart studentId={studentId} />
            </div>
            <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Wellness Metrics Correlation</h3>
                <CustomAxisChart studentId={studentId} />
            </div>
        </div>
    );
};

export default MyRecord;
