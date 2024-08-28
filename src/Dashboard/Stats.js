import React, { useEffect, useState } from 'react';
import { variables } from '../Variables';

const formatTo1DecimalPlace = (value) => {
    if (isNaN(value)) {
        return '--';
    }
    return parseFloat(value).toFixed(1);
};


const Stats = ({ studentId, refreshTrigger }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);


    const [stats, setStats] = useState({
        today: {
            mood: 0.0,
            exercise: 0.0,
            sleep: 0.0,
            socialisation: 0.0,
            productivity: 0.0,
        },
        averages: {
            mood:0.0,
            exercise: 0.0,
            sleep: 0.0,
            socialisation: 0.0,
            productivity: 0.0,
        },
        trends: {
            mood: 0.0,
            exercise: 0.0,
            sleep: 0.0,
            socialisation: 0.0,
            productivity: 0.0,
        }
    });

    useEffect(() => {
        if (studentId) {
            fetchStats(studentId);
        }
    }, [studentId, refreshTrigger]);

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

    const getTodayIcon = (value) => {
        if (value === null) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
        } else if (value >= 3) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
        } else if (value > 0) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
        } else {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
        }
    };
    
    const getTrendIcon = (value) => {
        if (value === null) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-grey-500"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;  // Display '>' when no data
        } else if (value > 0) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>;
        } else if (value < 0) {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
        } else {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-grey-500"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
        }
    };
    

    return (
        <div className="max-w-md p-6 theme-secondary-bg rounded-none shadow-sm border theme-border">
            <div className="flex items-center justify-center mb-2">
                <h5 className="text-lg font-semibold theme-primary-text flex items-center">Stats
                    <p className="mx-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                    </svg>
                    </p></h5>
            </div>
            <div className="border-b theme-border mb-2"></div>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center font-semibold theme-primary-text"></div>
                <div className="text-center font-semibold theme-primary-text">Today</div>
                <div className="text-center font-semibold theme-primary-text">Avg (7 Days)</div>
                {[
                    { label: 'Mood', key: 'mood' },
                    { label: 'Exercise', key: 'exercise' },
                    { label: 'Sleep', key: 'sleep' },
                    { label: 'Socialisation', key: 'socialisation' },
                    { label: 'Productivity', key: 'productivity' }
                ].map((item) => (
                    <React.Fragment key={item.key}>
                        <div className="text-center theme-primary-text font-semibold">{item.label}</div>
                        <div className="text-center theme-primary-text flex items-center justify-center space-x-2">
                        {formatTo1DecimalPlace(stats.today[item.key] ?? '-')}/5 {getTodayIcon(formatTo1DecimalPlace(stats.today[item.key] ?? 0))}
                        </div>
                        <div className="text-center theme-primary-text flex items-center justify-center">
                        {formatTo1DecimalPlace(stats.averages[item.key] ?? 0)}/5 {getTrendIcon(stats.trends[item.key] ?? 0)}

                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Stats;
