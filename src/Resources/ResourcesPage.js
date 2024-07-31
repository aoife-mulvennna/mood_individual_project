import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import './Dashboard.css'; // Ensures the same styling as Dashboard
import './theme.css'; // Ensures the same theme management as Dashboard

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Apply theme on mount
        console.log('Setting theme:', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = () => {
        fetch(`${variables.API_URL}resources`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setResources(data.resources))
            .catch(error => console.error('Error fetching resources:', error));
    };

    return (
        <div className="max-w-7xl mx-auto mt-12 p-6 theme-primary-bg rounded-lg shadow-lg">
            <h3 className="text-center text-2xl font-semibold mb-6 theme-primary-text">All Resources</h3>
            <ul className="list-none pl-0">
                {resources.map((resource, index) => (
                    <li key={index} className="mb-4">
                        <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {resource.resource_name}
                        </a>
                        <div className="text-sm theme-secondary-text">{new Date(resource.resource_added_date).toLocaleDateString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourcesPage;
