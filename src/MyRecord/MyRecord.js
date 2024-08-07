import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import { jwtDecode } from 'jwt-decode';
import DateChart from '../Charts/DateChart';
import CustomAxisChart from '../Charts/CustomAxisChart';
import './MyRecord.css';

const MyRecord = () => {
    const [dailyRecords, setDailyRecords] = useState([]);
    const [quickTrackerRecords, setQuickTrackerRecords] = useState([]);
    const [recommendedResources, setRecommendedResources] = useState([]);
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
            fetchRecommendedResources(decodedToken.id);
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

    const fetchRecommendedResources = async (studentId) => {
        try {
            const response = await fetch(`${variables.API_URL}recommended-resources/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendedResources(data.resources);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to fetch recommended resources');
        }
    };

    if (loading) {
        return <p className="theme-secondary-text">Loading records...</p>;
    }

    if (error) {
        return <p className="theme-accent-color">{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto mt-12 p-6 theme-primary-bg rounded-lg shadow-lg">
            <h3 className="text-center text-2xl font-semibold mb-6 theme-primary-text">My Records</h3>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 theme-primary-text">Chart with Different Components</h3>
                <DateChart studentId={studentId} />
            </div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 theme-primary-text">Chart with Any</h3>
                <CustomAxisChart studentId={studentId} />
            </div>
            {recommendedResources.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 theme-primary-text">Recommended Resources</h3>
                    <ul>
                        {recommendedResources.map((resource, index) => (
                            <li key={index} className="mb-4">
                                <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {resource.resource_name}
                                </a>
                                <div className="text-sm text-gray-500">{resource.resource_topic_name}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MyRecord;
