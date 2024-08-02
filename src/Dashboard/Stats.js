import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';
import Star from '../Photos/Star.png';

const Stats = ({ studentId }) => {
    const [stats, setStats] = useState({
        today: {
            mood: null,
            exercise: null,
            sleep: null,
            socialisation: null,
            productivity: null,
        },
        averages: {
            mood: null,
            exercise: null,
            sleep: null,
            socialisation: null,
            productivity: null,
        },
        trends: {
            mood: null,
            exercise: null,
            sleep: null,
            socialisation: null,
            productivity: null,
        }
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
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>;
        } else if (value < 0) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
        } else {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-grey-500"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>

        }
    };
    const getTodayIcon = (value) => {
        if (value >= 3) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
        } else {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 theme-secondary-bg rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-4">
                <h5 className="text-xl font-semibold text-gray-800">Stats</h5>
                <img src={Star} className="w-6 h-6 ml-2" alt="Star" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center font-semibold text-gray-600">Feature</div>
                <div className="text-center font-semibold text-gray-600">Today</div>
                <div className="text-center font-semibold text-gray-600">Avg (7 Days)</div>
                {[
                    { label: 'Mood', key: 'mood' },
                    { label: 'Exercise', key: 'exercise' },
                    { label: 'Sleep', key: 'sleep' },
                    { label: 'Socialisation', key: 'socialisation' },
                    { label: 'Productivity', key: 'productivity' }
                ].map((item) => (
                    <React.Fragment key={item.key}>
                        <div className="text-center text-gray-700">{item.label}</div>
                        <div className="text-center text-gray-700 flex items-center justify-center space-x-2">{stats.today[item.key]}/5   {getTodayIcon(stats.today[item.key])}</div>
                        <div className="text-center text-gray-700 flex items-center justify-center">
                            {stats.averages[item.key]}/5 {getTrendIcon(stats.trends[item.key])}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Stats;
