import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
// import './Dashboard.css';
import '../themes.css';

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [expandedTopics, setExpandedTopics] = useState({});

    useEffect(() => {
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
            .then(data => {
                console.log('Fetched resources in ResourcesPage component:', data.resources);
                setResources(data.resources);
            })
            .catch(error => console.error('Error fetching resources:', error));
    };

    const groupedResources = resources.reduce((acc, resource) => {
        if (!acc[resource.resource_topic_name]) {
            acc[resource.resource_topic_name] = [];
        }
        acc[resource.resource_topic_name].push(resource);
        return acc;
    }, {});

    const toggleTopic = (topic) => {
        setExpandedTopics((prev) => ({
            ...prev,
            [topic]: !prev[topic]
        }));
    };

    return (
        <div className="max-w-7xl mx-auto mt-12 p-6 theme-primary-bg rounded-lg shadow-lg">
            <h3 className="text-center text-2xl font-semibold mb-6 theme-primary-text">All Resources</h3>
            {Object.keys(groupedResources).map((topic, index) => (
                <div key={index} className="mb-8">
                    <h4 className="text-xl font-semibold mb-4 theme-primary-text flex items-center cursor-pointer" onClick={() => toggleTopic(topic)}>
                        {topic}
                        {expandedTopics[topic] ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        )}
                    </h4>
                    {expandedTopics[topic] && (
                        <ul className="list-none pl-0">
                            {groupedResources[topic].map((resource, index) => (
                                <li key={index} className="mb-4">
                                    <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline link">
                                        {resource.resource_name}
                                    </a>
                                    <div className="text-sm theme-secondary-text">{new Date(resource.resource_added_date).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResourcesPage;
