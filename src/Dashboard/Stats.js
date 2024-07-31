import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';
import Star from '../Photos/Star.png';

const Stats = ({ studentId }) => {
    const [stats, setStats] = useState({
        mood: null,
        exercise: null,
        sleep: null,
        socialisation: null,
    });

    useEffect(() => {
        if (studentId) {
            fetchStats(studentId);
        }
    }, [studentId]);

    const fetchStats = async (userId) => {
        try {
            const response = await fetch(`${variables.API_URL}stats/${userId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data.stats);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const getTrendIcon = (value) => {
        if (value > 0) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>;
        } else if (value < 0) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
        } else {
            return null;
        }
    };

    return (
        <div className="p-6 theme-secondary-bg rounded-lg shadow">
            <h5 className="text-lg font-semibold mb-4 flex items-center theme-primary-text">Stats <img src={Star} className="w-6 h-6 ml-2" alt='Star' /></h5>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="theme-primary-text">Mood</span>
                    {getTrendIcon(stats.mood)}
                </div>
                <div className="flex justify-between items-center">
                    <span className="theme-primary-text">Exercise Minutes</span>
                    {getTrendIcon(stats.exercise)}
                </div>
                <div className="flex justify-between items-center">
                    <span className="theme-primary-text">Sleep Length</span>
                    {getTrendIcon(stats.sleep)}
                </div>
                <div className="flex justify-between items-center">
                    <span className="theme-primary-text">Socialisation</span>
                    {getTrendIcon(stats.socialisation)}
                </div>
            </div>
        </div>
    );
};

export default Stats;
