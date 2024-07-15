import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import { jwtDecode } from 'jwt-decode'; 
import './MyRecord.css';

const MyRecord = () => {
    const [dailyRecords, setDailyRecords] = useState([]);
    const [quickTrackerRecords, setQuickTrackerRecords] = useState([]);
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

    if (loading) {
        return <p>Loading records...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-center text-2xl font-semibold mb-6 text-gray-800">My Records</h3>
            {dailyRecords.length === 0 && quickTrackerRecords.length === 0 ? (
                <p>No records found</p>
            ) : (
                <>
                    <h4 className="text-xl font-semibold mb-4">Daily Records</h4>
                    <table className="min-w-full bg-white mb-6">
                        <thead>
                            <tr>
                                <th className="py-2">Date</th>
                                <th className="py-2">Mood</th>
                                <th className="py-2">Exercise Duration (min)</th>
                                <th className="py-2">Sleep Duration (hours)</th>
                                <th className="py-2">Social Activity (min)</th>
                                <th className="py-2">Productivity Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyRecords.map(record => (
                                <tr key={record.daily_record_id}>
                                    <td className="py-2 px-4 border">{new Date(record.daily_record_timestamp).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border">{record.mood_id}</td>
                                    <td className="py-2 px-4 border">{record.exercise_duration}</td>
                                    <td className="py-2 px-4 border">{record.sleep_duration}</td>
                                    <td className="py-2 px-4 border">{record.socialisation_id}</td>
                                    <td className="py-2 px-4 border">{record.productivity_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h4 className="text-xl font-semibold mb-4">Quick Tracker Records</h4>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Date</th>
                                <th className="py-2">Mood Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quickTrackerRecords.map(record => (
                                <tr key={record.quick_track_id}>
                                    <td className="py-2 px-4 border">{new Date(record.quick_track_timestamp).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border">{record.mood_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default MyRecord;
