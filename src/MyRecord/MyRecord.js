import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import { jwtDecode } from 'jwt-decode';
import DateChart from '../Charts/DateChart';
import CustomAxisChart from '../Charts/CustomAxisChart';

const MyRecord = () => {
    const [records, setRecords] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setStudentId(decodedToken.id);
            fetchRecords(decodedToken.id);
            fetchStudentInsights(decodedToken.id);
        }
    }, []);

    const fetchRecords = async (studentId) => {
        try {
            const response = await fetch(`${variables.API_URL}records/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setRecords(data.records);
            } else {
                setError(data.message);
            }
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch records');
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
        return <p className="text-center theme-primary-text">Loading records...</p>;
    }

    if (error) {
        return <p className="text-center theme-error-text">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto mt-2 p-6 theme-primary-bg">
            <h3 className="text-center text-2xl font-semibold mb-6 theme-primary-text">Personal Records Overview</h3>

            {insights.length > 0 && (
                <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border mb-6">
                    <h4 className="text-lg font-semibold mb-4 theme-primary-text border-b theme-border pb-2">Weekly Insights</h4>
                    <ul className="list-none pl-2 space-y-2">
                        {insights.map((insight, index) => (
                            <li key={index} className="theme-primary-text">{insight}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border mb-6">
                <h3 className="text-lg font-semibold mb-4 theme-primary-text border-b theme-border pb-2">Mood and Activity Trends</h3>
                <DateChart studentId={studentId} />
            </div>

            <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border">
                <h3 className="text-lg font-semibold mb-2 theme-primary-text ">Impact Analysis</h3>
                <div className="text-m border-b theme-border pb-2 mb-4 ">This chart shows how each metric tracked in Daily Track impacts the others. Adjust the axes using the dropdowns.</div>
                <CustomAxisChart studentId={studentId} />
            </div>
        </div>
    );
};

export default MyRecord;
