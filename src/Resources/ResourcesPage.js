import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import '../themes.css';

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [recommendedResources, setRecommendedResources] = useState([]);
    const [expandedTopics, setExpandedTopics] = useState({});
    const [personalisedMessage, setPersonalisedMessage] = useState(''); // Initialize as a string

    useEffect(() => {
        fetchResources();
        fetchRecommendedResources();
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

    const fetchRecommendedResources = () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            fetch(`${variables.API_URL}personalised-resources/${decodedToken.id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.recommendedResources && data.recommendedResources.length > 0) {
                        setRecommendedResources(data.recommendedResources);
                        if (data.message) {
                            setPersonalisedMessage(data.message);
                        }
                    } else {
                        setRecommendedResources([]); // Clear recommendations if none found
                        setPersonalisedMessage(''); // Clear the message if no recommendations
                    }
                })
                .catch(error => console.error('Failed to fetch personalised resources', error));
        }
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
        <div className="max-w-7xl mx-auto mt-4 p-6 theme-primary-bg rounded-lg">
            {recommendedResources.length > 0 && (
                <>
                    <h3 className="text-center text-2xl font-semibold mb-6 theme-primary-text">Recommended Resources</h3>
                    {personalisedMessage && (
                        <div className="mb-6">
                            <p className="text-md font-medium mb-4">
                                {personalisedMessage}
                            </p>
                        </div>
                    )}
                    <div className="mb-6">
                        <ul>
                            {recommendedResources.map((resource, index) => (
                                <li key={index} className="mb-6">
                                    <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="theme-secondary-text hover:underline link">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block align-middle">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>   {resource.resource_name}
                                    </a>
                                    <div className="text-sm text-gray-500">{resource.resource_topic_name}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

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
                                    <strong><a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="theme-secondary-text hover:underline link">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block align-middle">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>  {resource.resource_name}
                                    </a></strong>
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
